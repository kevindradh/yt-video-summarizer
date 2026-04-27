const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { getVideoMetadata, getTranscript } = require('../services/youtubeService');
const { generateSummary } = require('../services/aiService');
const cacheService = require('../services/cacheService');
const { splitTranscript } = require('../services/chunkService');

const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;

// Validation Schema
const SummarizeRequestSchema = z.object({
  url: z.string().regex(YOUTUBE_URL_REGEX, 'URL YouTube tidak valid.'),
  outputLanguage: z.enum(['id', 'en']).optional().default('id'),
  summaryLength: z.enum(['short', 'normal', 'detailed']).optional().default('normal'),
});

router.post('/', async (req, res, next) => {
  const startTime = Date.now();
  
  // 1. Validate Input
  const validation = SummarizeRequestSchema.safeParse(req.body);
  if (!validation.success) {
    return next({ 
      code: 'INVALID_INPUT', 
      httpStatus: 400, 
      message: validation.error.errors[0].message 
    });
  }

  const { url, outputLanguage, summaryLength } = validation.data;
  const match = url.match(YOUTUBE_URL_REGEX);
  const videoId = match[5];

  // 2. Check Cache
  const cacheKey = cacheService.generateKey(videoId, outputLanguage, summaryLength);
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) {
    return res.json({
      success: true,
      data: {
        ...cachedData,
        cached: true,
        processingTimeMs: Date.now() - startTime
      }
    });
  }

  // 3. Fetch Metadata
  const metadata = await getVideoMetadata(videoId);

  // 4. Validate Duration
  const MAX_DURATION = 7200; 
  if (metadata.duration > MAX_DURATION) {
    throw { code: 'VIDEO_TOO_LONG', httpStatus: 422, message: 'Video melebihi batas 2 jam.' };
  }

  // 5. Fetch Transcript
  const transcript = await getTranscript(videoId);

  // 6. AI Processing
  const transcriptChunks = splitTranscript(transcript, 3000);
  const textToProcess = transcriptChunks[0]; 
  
  const aiResult = await generateSummary({
    transcript: textToProcess,
    title: metadata.title,
    language: outputLanguage,
    length: summaryLength
  });

  const responseData = {
    ...metadata,
    summary: aiResult.summary,
    keyPoints: aiResult.keyPoints,
    outputLanguage,
    summaryLength,
    processedAt: new Date().toISOString(),
    warning: transcriptChunks.length > 1 ? 'Video sangat panjang, ringkasan didasarkan pada bagian utama video.' : null
  };

  // 7. Save to Cache
  cacheService.set(cacheKey, responseData);

  res.json({
    success: true,
    data: {
      ...responseData,
      cached: false,
      processingTimeMs: Date.now() - startTime
    }
  });
});

module.exports = router;

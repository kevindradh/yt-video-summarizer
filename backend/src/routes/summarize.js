const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { getVideoMetadata, getTranscript } = require('../services/youtubeService');
const { generateSummary } = require('../services/aiService');
const cacheService = require('../services/cacheService');
const { splitTranscript } = require('../services/chunkService');
const { YOUTUBE_URL_REGEX, MAX_VIDEO_DURATION_SECONDS, CHUNK_SIZE_WORDS } = require('../utils/constants');

// Validation Schema
const SummarizeRequestSchema = z.object({
  url: z.string().regex(YOUTUBE_URL_REGEX, 'URL YouTube tidak valid.'),
  outputLanguage: z.enum(['id', 'en']).optional().default('id'),
  summaryLength: z.enum(['short', 'normal', 'detailed']).optional().default('normal'),
});

router.post('/', async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    // 1. Validate Input
    const validation = SummarizeRequestSchema.safeParse(req.body);
    if (!validation.success) {
      const errorMsg = validation.error?.errors?.[0]?.message || 'Input tidak valid.';
      return next({ code: 'INVALID_INPUT', httpStatus: 400, message: errorMsg });
    }

    const { url, outputLanguage, summaryLength } = validation.data;
    const match = url.match(YOUTUBE_URL_REGEX);
    
    if (!match || !match[5]) {
      return next({ code: 'INVALID_URL', httpStatus: 400, message: 'URL YouTube tidak valid.' });
    }

    const videoId = match[5];

    // 2. Check Cache
    const cacheKey = cacheService.generateKey(videoId, outputLanguage, summaryLength);
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        data: { ...cachedData, cached: true, processingTimeMs: Date.now() - startTime }
      });
    }

    // 3. Fetch Metadata
    const metadata = await getVideoMetadata(videoId);

    // 4. Validate Duration (PRD 5.3)
    if (metadata.duration > MAX_VIDEO_DURATION_SECONDS) {
      throw { code: 'VIDEO_TOO_LONG', httpStatus: 422, message: 'Video melebihi batas 2 jam.' };
    }

    // 5. Fetch Transcript
    const transcript = await getTranscript(videoId);

    // 6. AI Processing with Segmentation (PRD 5.3)
    const transcriptChunks = splitTranscript(transcript, CHUNK_SIZE_WORDS);
    
    let finalSummary = '';
    let finalKeyPoints = [];

    if (transcriptChunks.length === 1) {
      // Single pass for normal videos
      const aiResult = await generateSummary({
        transcript: transcriptChunks[0],
        title: metadata.title,
        language: outputLanguage,
        length: summaryLength
      });
      finalSummary = aiResult.summary;
      finalKeyPoints = aiResult.keyPoints;
    } else {
      // Recursive/Segmented processing for long videos
      const partialSummaries = [];
      
      for (let i = 0; i < transcriptChunks.length; i++) {
        const partialResult = await generateSummary({
          transcript: transcriptChunks[i],
          title: `${metadata.title} (Part ${i+1})`,
          language: outputLanguage,
          length: 'short' // Keep partials short
        });
        partialSummaries.push(partialResult.summary);
        if (i === 0) finalKeyPoints = partialResult.keyPoints; // Take points from first chunk primarily
      }

      // Final consolidation pass
      const consolidationResult = await generateSummary({
        transcript: partialSummaries.join('\n\n'),
        title: metadata.title,
        language: outputLanguage,
        length: summaryLength
      });
      finalSummary = consolidationResult.summary;
      // Merge key points if needed, or take the consolidated ones
      if (consolidationResult.keyPoints) finalKeyPoints = consolidationResult.keyPoints;
    }

    const responseData = {
      ...metadata,
      summary: finalSummary,
      keyPoints: finalKeyPoints,
      outputLanguage,
      summaryLength,
      processedAt: new Date().toISOString(),
      warning: transcriptChunks.length > 1 ? 'Video ini diringkas dalam beberapa tahap karena durasinya yang panjang.' : null
    };

    // 7. Save to Cache
    cacheService.set(cacheKey, responseData);

    res.json({
      success: true,
      data: { ...responseData, cached: false, processingTimeMs: Date.now() - startTime }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = { router, YOUTUBE_URL_REGEX };

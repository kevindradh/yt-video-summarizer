import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import * as youtubeService from '../services/youtubeService';
import * as aiService from '../services/aiService';

// Manual Mocks
vi.mock('../services/youtubeService');
vi.mock('../services/aiService');
vi.mock('../services/cacheService', () => ({
  get: vi.fn().mockReturnValue(null),
  set: vi.fn(),
  generateKey: vi.fn().mockReturnValue('mock-key')
}));

describe('POST /api/summarize', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return 400 if URL is missing', async () => {
    const res = await request(app)
      .post('/api/summarize')
      .send({});
    
    expect(res.status).toBe(400);
  });

  it('should return 200 and summary for valid YouTube URL', async () => {
    // Setup mocks
    vi.spyOn(youtubeService, 'getVideoMetadata').mockResolvedValue({
      videoId: 'dQw4w9WgXcQ',
      title: 'Test Video',
      channel: 'Test Channel',
      duration: 300,
      thumbnail: 'https://test.jpg',
      publishedAt: '2021-01-01',
      durationLabel: '5:00'
    });
    vi.spyOn(youtubeService, 'getTranscript').mockResolvedValue('This is a test transcript.');
    vi.spyOn(aiService, 'generateSummary').mockResolvedValue({
      summary: 'This is a test summary.',
      keyPoints: [{ point: 'Point 1' }]
    });

    const res = await request(app)
      .post('/api/summarize')
      .send({ 
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary).toBe('This is a test summary.');
  });

  it('should return 422 if video exceeds 2-hour duration (PRD 5.3)', async () => {
    vi.spyOn(youtubeService, 'getVideoMetadata').mockResolvedValue({
      videoId: 'dQw4w9WgXcQ',
      title: 'Long Video',
      channel: 'Test Channel',
      duration: 7300, // 2h 1m
      thumbnail: 'https://test.jpg',
      publishedAt: '2021-01-01',
      durationLabel: '2:01:40'
    });

    const res = await request(app)
      .post('/api/summarize')
      .send({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
    
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VIDEO_TOO_LONG');
    expect(res.body.error.suggestion).toContain('2 jam');
  });
});

import { describe, it, expect } from 'vitest';
import { validateYouTubeUrl } from './urlValidator';

describe('validateYouTubeUrl', () => {
  // Valid test cases
  const validUrls = [
    ['https://youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ?t=30', 'dQw4w9WgXcQ'],
    ['https://youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://m.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ];

  it.each(validUrls)('should validate valid URL: %s', (url, expectedId) => {
    const result = validateYouTubeUrl(url);
    expect(result.valid).toBe(true);
    expect(result.videoId).toBe(expectedId);
  });

  // Invalid test cases
  it('should return INPUT_EMPTY for empty string', () => {
    expect(validateYouTubeUrl('').error).toBe('INPUT_EMPTY');
    expect(validateYouTubeUrl('   ').error).toBe('INPUT_EMPTY');
  });

  it('should return NOT_A_URL for non-url strings', () => {
    expect(validateYouTubeUrl('tutorial react js').error).toBe('NOT_A_URL');
  });

  it('should return NOT_YOUTUBE for other domains', () => {
    expect(validateYouTubeUrl('https://vimeo.com/123456').error).toBe('NOT_YOUTUBE');
  });

  it('should return NO_VIDEO_ID for youtube URLs without video ID', () => {
    expect(validateYouTubeUrl('https://youtube.com/').error).toBe('NO_VIDEO_ID');
    expect(validateYouTubeUrl('https://youtube.com/channel/UCxxxxx').error).toBe('NO_VIDEO_ID');
    expect(validateYouTubeUrl('https://youtube.com/playlist?list=PLxxxxx').error).toBe('NO_VIDEO_ID');
  });

  it('should return INVALID_ID_FORMAT for IDs not 11 characters', () => {
    expect(validateYouTubeUrl('https://youtube.com/watch?v=short').error).toBe('INVALID_ID_FORMAT');
    expect(validateYouTubeUrl('https://youtube.com/watch?v=toolongid123').error).toBe('INVALID_ID_FORMAT');
  });
});

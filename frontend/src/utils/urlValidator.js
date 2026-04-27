// Regex pattern for all valid YouTube URL formats
const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;

/**
 * Validates a YouTube URL and extracts the Video ID.
 * @param {string} input - The URL string to validate.
 * @returns {object} - { valid: boolean, videoId?: string, error?: string }
 */
export function validateYouTubeUrl(input) {
  if (!input || input.trim() === '') {
    return { valid: false, error: 'INPUT_EMPTY' };
  }
  
  if (!input.startsWith('http://') && !input.startsWith('https://')) {
    // Check if it's maybe just a query string, not a URL
    if (!input.includes('.')) {
      return { valid: false, error: 'NOT_A_URL' };
    }
  }
  
  if (!input.includes('youtube.com') && !input.includes('youtu.be')) {
    return { valid: false, error: 'NOT_YOUTUBE' };
  }
  
  const match = input.match(YOUTUBE_URL_REGEX);
  if (!match) {
    return { valid: false, error: 'NO_VIDEO_ID' };
  }
  
  const videoId = match[5];
  if (videoId.length !== 11) {
    return { valid: false, error: 'INVALID_ID_FORMAT' };
  }

  return { valid: true, videoId };
}

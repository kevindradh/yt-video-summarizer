/**
 * Backend Constants
 */
module.exports = {
  YOUTUBE_URL_REGEX: /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  MAX_VIDEO_DURATION_SECONDS: 7200, // 2 Hours
  CHUNK_SIZE_WORDS: 3000,
  CACHE_TTL_SECONDS: process.env.CACHE_TTL_SECONDS || 86400,
};

const { google } = require('googleapis');
const { YoutubeTranscript } = require('youtube-transcript');

const youtube = google.youtube('v3');

/**
 * Fetches video metadata from YouTube Data API
 * @param {string} videoId 
 * @returns {Promise<object>}
 */
async function getVideoMetadata(videoId) {
  try {
    const response = await youtube.videos.list({
      key: process.env.YOUTUBE_API_KEY,
      part: 'snippet,contentDetails,status',
      id: videoId,
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw { code: 'VIDEO_NOT_FOUND', httpStatus: 404 };
    }

    const video = response.data.items[0];
    const snippet = video.snippet;
    
    // Check if video is private or restricted
    if (video.status.privacyStatus === 'private') {
      throw { code: 'VIDEO_PRIVATE', httpStatus: 403 };
    }
    
    if (video.contentDetails.regionRestriction) {
      // Basic check, could be more detailed
      // throw { code: 'GEO_RESTRICTED', httpStatus: 451 };
    }

    // Convert ISO 8601 duration to seconds
    const duration = parseIsoDuration(video.contentDetails.duration);

    return {
      videoId,
      title: snippet.title,
      channel: snippet.channelTitle,
      thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
      publishedAt: snippet.publishedAt,
      duration,
      durationLabel: formatDuration(duration)
    };
  } catch (error) {
    if (error.code) throw error;
    
    if (error.errors && error.errors[0].reason === 'quotaExceeded') {
      throw { code: 'YOUTUBE_QUOTA_EXCEEDED', httpStatus: 429 };
    }
    
    throw { 
      code: 'YOUTUBE_API_ERROR', 
      httpStatus: 500, 
      message: error.message 
    };
  }
}

/**
 * Fetches transcript/captions for a video
 * @param {string} videoId 
 * @returns {Promise<string>}
 */
async function getTranscript(videoId) {
  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcriptItems || transcriptItems.length === 0) {
      throw { code: 'VIDEO_NO_TRANSCRIPT', httpStatus: 422 };
    }

    // Join all transcript parts into one clean string
    return transcriptItems
      .map(item => item.text)
      .join(' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  } catch (error) {
    if (error.code) throw error;
    
    // youtube-transcript might throw errors if captions are disabled
    throw { 
      code: 'VIDEO_NO_TRANSCRIPT', 
      httpStatus: 422,
      message: 'Video ini tidak memiliki transkrip yang dapat diproses.' 
    };
  }
}

// Utility functions
function parseIsoDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

module.exports = {
  getVideoMetadata,
  getTranscript
};

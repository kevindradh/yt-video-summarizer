const NodeCache = require('node-cache');

// TTL 24 hours by default
const ttl = process.env.CACHE_TTL_SECONDS || 86400;
const cache = new NodeCache({ stdTTL: ttl, checkperiod: 120 });

/**
 * Cache Service Wrapper
 */
const cacheService = {
  get: (key) => {
    return cache.get(key);
  },
  
  set: (key, value) => {
    return cache.set(key, value);
  },
  
  generateKey: (videoId, language, length) => {
    return `${videoId}_${language}_${length}`;
  }
};

module.exports = cacheService;

const { redis } = require('./database');

// Cache TTL in seconds (1 hour)
const CACHE_TTL = 3600;

/**
 * Get potential matches from cache
 * @param {string} userId - The user's ID
 * @returns {Promise<Array|null>} - Cached matches or null if not found
 */
const getCachedMatches = async (userId) => {
  try {
    const cachedMatches = await redis.get(`matches:${userId}`);
    return cachedMatches ? JSON.parse(cachedMatches) : null;
  } catch (error) {
    console.error('Error getting cached matches:', error);
    return null;
  }
};

/**
 * Set potential matches in cache
 * @param {string} userId - The user's ID
 * @param {Array} matches - The matches to cache
 */
const setCachedMatches = async (userId, matches) => {
  try {
    await redis.setEx(
      `matches:${userId}`,
      CACHE_TTL,
      JSON.stringify(matches)
    );
  } catch (error) {
    console.error('Error setting cached matches:', error);
  }
};

/**
 * Invalidate potential matches cache for a user
 * @param {string} userId - The user's ID
 */
const invalidateMatchesCache = async (userId) => {
  try {
    await redis.del(`matches:${userId}`);
  } catch (error) {
    console.error('Error invalidating matches cache:', error);
  }
};

module.exports = {
  getCachedMatches,
  setCachedMatches,
  invalidateMatchesCache
}; 
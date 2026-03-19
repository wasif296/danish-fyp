const CACHE_TTL_MS = 5 * 60 * 1000;

const analyticsCache = new Map();

const getCacheKey = (schoolId) => `school:${String(schoolId)}`;

const getCachedAnalytics = (schoolId) => {
  const cacheKey = getCacheKey(schoolId);
  const cachedEntry = analyticsCache.get(cacheKey);

  if (!cachedEntry) {
    return null;
  }

  if (cachedEntry.expiresAt <= Date.now()) {
    analyticsCache.delete(cacheKey);
    return null;
  }

  return cachedEntry.data;
};

const setCachedAnalytics = (schoolId, data) => {
  analyticsCache.set(getCacheKey(schoolId), {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
};

const clearCachedAnalytics = (schoolId) => {
  analyticsCache.delete(getCacheKey(schoolId));
};

module.exports = {
  CACHE_TTL_MS,
  getCachedAnalytics,
  setCachedAnalytics,
  clearCachedAnalytics,
};

const redis = require('./redis');

// Save data to cache with TTL (time to live in seconds)
// Saves data to Redis cache with an expiration time
// key: unique identifier for the cache (e.g. 'products:all')
// data: the data to store (converted to string since Redis only stores strings)
// ttl: time in seconds before cache expires (e.g. 600 = 10 minutes)
async function setCache(key, data, ttl) {
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
}


// Get data from cache
// Retrieves data from Redis cache by key
// Returns parsed object if found, null if not found or expired
async function getCache(key) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
}

// Delete cache by key
// Deletes a single cache entry by key
// Used when a specific item is updated or deleted (e.g. one product updated)
async function deleteCache(key) {
    await redis.del(key);
}

// Delete multiple keys by pattern
// Deletes all cache entries matching a pattern
// Used when multiple caches need to be cleared (e.g. 'products:*' clears all product caches)
async function deleteCacheByPattern(pattern) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
}

module.exports = { setCache, getCache, deleteCache, deleteCacheByPattern };
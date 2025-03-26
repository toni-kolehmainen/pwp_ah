const NodeCache = require('node-cache');

// Creating a cache instance with default TTL of 5 minutes
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes in seconds
  checkperiod: 60 // Check for expired keys every 60 seconds
});

// GET Routes are cached
const cachedRoutes = [
  { path: '/api/users', method: 'GET' },
  { path: '/api/users/:user_id', method: 'GET' },
  { path: '/api/categories', method: 'GET' },
  { path: '/api/items', method: 'GET' },
  { path: '/api/items/:id', method: 'GET' },
  { path: '/api/bids', method: 'GET' },
  { path: '/api/bids/:bid_id', method: 'GET' },
  { path: '/api/auctions', method: 'GET' },
  { path: '/api/auctions/:id', method: 'GET' }
];

// Routes that should invalidate cache when called
const cacheInvalidationRoutes = [
  // User cache invalidation
  { path: '/api/users', method: 'POST', invalidate: ['/api/users'] },
  { path: '/api/users/:user_id', method: 'PUT', invalidate: ['/api/users', '/api/users/:user_id'] },
  { path: '/api/users/:user_id', method: 'DELETE', invalidate: ['/api/users', '/api/users/:user_id'] },

  // Item cache invalidation
  { path: '/api/items', method: 'POST', invalidate: ['/api/items'] },
  { path: '/api/items/:id', method: 'PUT', invalidate: ['/api/items', '/api/items/:id'] },
  { path: '/api/items/:id', method: 'DELETE', invalidate: ['/api/items', '/api/items/:id'] },

  // Category cache invalidation
  { path: '/api/categories', method: 'POST', invalidate: ['/api/categories'] },
  { path: '/api/categories/:id', method: 'DELETE', invalidate: ['/api/categories'] },

  // Bid cache invalidation
  { path: '/api/bids', method: 'POST', invalidate: ['/api/bids'] },
  { path: '/api/bids/:bid_id', method: 'DELETE', invalidate: ['/api/bids', '/api/bids/:bid_id'] },
  { path: '/api/bids', method: 'DELETE', invalidate: ['/api/bids'] },

  // Auction cache invalidation
  { path: '/api/auctions', method: 'POST', invalidate: ['/api/auctions'] },
  { path: '/api/auctions/:id', method: 'DELETE', invalidate: ['/api/auctions', '/api/auction/:id'] },
  { path: '/api/auctions', method: 'DELETE', invalidate: ['/api/auctions'] }
];

// Helper function to check if a route matches a pattern
const routeMatches = (routePattern, requestPath) => {
  // Convert route pattern to regex
  const pattern = routePattern
    .replace(/:\w+/g, '[^/]+') // Replace :param with regex for any character except /
    .replace(/\//g, '\\/'); // Escape / for regex

  const regex = new RegExp(`^${pattern}$`);
  return regex.test(requestPath);
};

// Helper function to replace path params with actual values from request
const replacePathParams = (pattern, requestPath) => {
  const patternParts = pattern.split('/');
  const requestParts = requestPath.split('/');

  let result = pattern;
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      result = result.replace(patternParts[i], requestParts[i]);
    }
  }

  return result;
};

// Cache middleware
const cacheMiddleware = (req, res, next) => {
  // Skip caching for non GET requests unless its a cache invalidation route
  if (req.method !== 'GET') {
    // Check if this request should invalidate cache
    for (const route of cacheInvalidationRoutes) {
      if (route.method === req.method && routeMatches(route.path, req.path)) {
        // This route should invalidate cache
        route.invalidate.forEach((invalidatePath) => {
          // If the invalidate path has parameters, replace them with actual values
          const resolvedPath = replacePathParams(invalidatePath, req.path);

          // Delete the cache for this path
          cache.del(resolvedPath);

          // Also try to invalidate any potential query parameter variations
          const keys = cache.keys();
          keys.forEach((key) => {
            if (key.startsWith(resolvedPath)) {
              cache.del(key);
            }
          });
        });
        break;
      }
    }
    return next();
  }

  // Check if this route should be cached
  let newCache = false;
  for (const route of cachedRoutes) {
    if (routeMatches(route.path, req.path)) {
      newCache = true;
      break;
    }
  }

  if (!newCache) {
    return next();
  }

  // Generating cache key based on path and query parameters
  const cacheKey = req.originalUrl || req.url;

  // Checking if already cached response
  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    // Return cached response
    return res.status(cachedResponse.status)
      .set('X-Cache', 'HIT')
      .json(cachedResponse.data);
  }

  // If no cache hit, replace res.json to intercept the response
  const originalJson = res.json;
  res.json = function (data) {
    // Savnig the response in cache
    cache.set(cacheKey, {
      status: res.statusCode,
      data
    });

    // Set cache header
    res.set('X-Cache', 'MISS');

    // Call the original json method
    return originalJson.call(this, data);
  };

  next();
};

// Export the cache instance and middleware
module.exports = {
  cache,
  cacheMiddleware
};

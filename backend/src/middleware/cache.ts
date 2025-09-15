import { Request, Response, NextFunction } from 'express';
import cacheService from '../services/cache.service';

// Cache middleware
interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyGenerator?: (req: Request) => string;
  skipCache?: (req: Request) => boolean;
}

export const cache = (options: CacheOptions = {}) => {
  const { ttl = 300, keyGenerator, skipCache } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip cache if specified
    if (skipCache && skipCache(req)) {
      return next();
    }

    // Generate cache key
    const cacheKey = keyGenerator 
      ? keyGenerator(req)
      : `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;

    try {
      // Try to get from cache
      const cachedData = await cacheService.get(cacheKey);
      
      if (cachedData) {
        console.log(`📦 Cache HIT: ${cacheKey}`);
        return res.json(cachedData);
      }

      console.log(`📭 Cache MISS: ${cacheKey}`);

      // Store original json method
      const originalJson = res.json;

      // Override json method to cache the response
      res.json = function(body: any) {
        // Cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cacheService.set(cacheKey, body, ttl)
            .then(() => console.log(`💾 Cached: ${cacheKey}`))
            .catch(err => console.error('Cache set error:', err));
        }

        // Call original json method
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Specific cache middlewares
export const cacheProducts = cache({
  ttl: 300, // 5 minutes
  keyGenerator: (req) => {
    const params = new URLSearchParams(req.query as any).toString();
    return `products:list:${params}`;
  }
});

export const cacheProduct = cache({
  ttl: 600, // 10 minutes
  keyGenerator: (req) => `product:${req.params.id}`
});

export const cacheCategories = cache({
  ttl: 1800, // 30 minutes
  keyGenerator: () => 'categories:list'
});

export const cacheFilters = cache({
  ttl: 900, // 15 minutes
  keyGenerator: () => 'filters:data'
});

export const cacheDashboard = cache({
  ttl: 300, // 5 minutes
  keyGenerator: () => 'admin:dashboard:stats'
});

// Rate limiting middleware
interface RateLimitOptions {
  maxRequests: number;
  windowInSeconds: number;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
}

export const rateLimit = (options: RateLimitOptions) => {
  const {
    maxRequests,
    windowInSeconds,
    keyGenerator,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    message = 'Too many requests, please try again later.'
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier = keyGenerator 
      ? keyGenerator(req)
      : req.ip || 'unknown';

    try {
      const { allowed, remaining, resetTime } = await cacheService.checkRateLimit(
        identifier,
        maxRequests,
        windowInSeconds
      );

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString()
      });

      if (!allowed) {
        return res.status(429).json({
          success: false,
          error: message,
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
        });
      }

      // If we should skip tracking on success/failure, override res.end
      if (skipSuccessfulRequests || skipFailedRequests) {
        const originalEnd = res.end;
        res.end = function(...args: any[]) {
          const shouldSkip = 
            (skipSuccessfulRequests && res.statusCode >= 200 && res.statusCode < 400) ||
            (skipFailedRequests && res.statusCode >= 400);

          if (shouldSkip) {
            // Decrement the counter since we shouldn't have counted this request
            cacheService.decrementRateLimit(identifier)
              .catch((err: any) => console.error('Rate limit decrement error:', err));
          }

          return originalEnd.apply(this, args as any);
        };
      }

      next();
    } catch (error) {
      console.error('Rate limit error:', error);
      // Fail open in case of Redis error
      next();
    }
  };
};

// Predefined rate limits
export const apiRateLimit = rateLimit({
  maxRequests: 100,
  windowInSeconds: 60, // 100 requests per minute
  keyGenerator: (req) => `api:${req.ip}`
});

export const authRateLimit = rateLimit({
  maxRequests: 5,
  windowInSeconds: 300, // 5 attempts per 5 minutes
  keyGenerator: (req) => `auth:${req.ip}:${req.body.email || 'unknown'}`,
  skipSuccessfulRequests: true
});

export const adminRateLimit = rateLimit({
  maxRequests: 200,
  windowInSeconds: 60, // 200 requests per minute for admin users
  keyGenerator: (req) => `admin:${(req as any).user?.id || req.ip}`
});

// Cache invalidation middleware
export const invalidateCache = (patterns: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store original json method
    const originalJson = res.json;

    // Override json method to invalidate cache after successful operations
    res.json = function(body: any) {
      // Invalidate cache on successful mutations (POST, PUT, DELETE)
      if (res.statusCode >= 200 && res.statusCode < 300 && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
        const patternsArray = Array.isArray(patterns) ? patterns : [patterns];
        
        Promise.all(
          patternsArray.map(pattern => cacheService.delPattern(pattern))
        ).then(() => {
          console.log(`🗑️ Cache invalidated: ${patternsArray.join(', ')}`);
        }).catch(err => {
          console.error('Cache invalidation error:', err);
        });
      }

      // Call original json method
      return originalJson.call(this, body);
    };

    next();
  };
};

// Export cache service for direct use
export { cacheService };

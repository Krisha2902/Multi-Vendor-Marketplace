import { ApiError } from '../utils/ApiError.js';

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests. Please try again later.',
  keyGenerator,
  skip,
} = {}) => {
  const hits = new Map();

  const cleanupExpired = (now) => {
    for (const [key, entry] of hits.entries()) {
      if (now >= entry.resetAt) {
        hits.delete(key);
      }
    }
  };

  return (req, res, next) => {
    if (typeof skip === 'function' && skip(req)) {
      return next();
    }

    const now = Date.now();
    if (hits.size > 5000) {
      cleanupExpired(now);
    }

    const rawKey =
      typeof keyGenerator === 'function'
        ? keyGenerator(req)
        : req.ip || req.socket?.remoteAddress || 'unknown';
    const key = String(rawKey || 'unknown');

    let entry = hits.get(key);
    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;
    const remaining = Math.max(0, max - entry.count);
    const resetSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(remaining));
    res.setHeader('RateLimit-Reset', String(resetSeconds));

    if (entry.count > max) {
      res.setHeader('Retry-After', String(resetSeconds));
      return next(new ApiError(429, message));
    }

    return next();
  };
};

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
});

export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Rate limit exceeded. Please slow down and try again shortly.',
  skip: (req) => req.path === '/health',
});


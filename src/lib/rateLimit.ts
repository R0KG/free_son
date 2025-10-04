import { NextRequest, NextResponse } from 'next/server';

type Counter = { count: number; resetAt: number };
const store = new Map<string, Counter>();

export interface RateLimitResult {
  allowed: boolean;
  response?: NextResponse;
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export function rateLimit(request: NextRequest, routeKey: string, limit = 60, windowMs = 60_000): RateLimitResult {
  const ip = getClientIp(request);
  const key = `${routeKey}:${ip}`;
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (current.count < limit) {
    current.count += 1;
    return { allowed: true };
  }

  const retryAfterSec = Math.max(0, Math.ceil((current.resetAt - now) / 1000));
  const res = NextResponse.json(
    { error: 'Too many requests' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSec),
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(current.resetAt / 1000)),
      },
    }
  );
  return { allowed: false, response: res };
}



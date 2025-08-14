type TokenBucket = { tokens: number; lastRefillMs: number }

const buckets = new Map<string, TokenBucket>()

export function rateLimit({
  id,
  capacity = 10,
  refillPerSec = 5,
}: {
  id: string
  capacity?: number
  refillPerSec?: number
}) {
  const now = Date.now()
  const bucket = buckets.get(id) || { tokens: capacity, lastRefillMs: now }
  const elapsedSec = (now - bucket.lastRefillMs) / 1000
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsedSec * refillPerSec)
  bucket.lastRefillMs = now

  if (bucket.tokens < 1) {
    buckets.set(id, bucket)
    const deficit = 1 - bucket.tokens
    const retryAfter = Math.ceil(deficit / refillPerSec)
    return { allowed: false, retryAfter }
  }

  bucket.tokens -= 1
  buckets.set(id, bucket)
  return { allowed: true, retryAfter: 0 }
}

export function getClientIdFromRequest(req: Request) {
  // Attempt to use IP; fall back to forwarded-for; otherwise a static key
  // Note: NextRequest extends Request but we'll use headers for portability
  const xff = req.headers.get('x-forwarded-for') || ''
  const ip = (xff.split(',')[0] || '').trim()
  return ip || 'anonymous'
}

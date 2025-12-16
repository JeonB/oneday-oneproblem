import mongoose from 'mongoose'

export const connectDB = async () => {
  // 빌드 시점에는 연결을 건너뜀
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return
  }

  const MONGODB_URI =
    process.env.NODE_ENV !== 'production'
      ? process.env.MONGODB_URI_LOCAL
      : process.env.MONGODB_URI

  if (mongoose.connections[0].readyState) return
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }
  await mongoose.connect(MONGODB_URI)
}

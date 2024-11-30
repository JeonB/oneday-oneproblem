import mongoose from 'mongoose'

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }
  await mongoose.connect(process.env.MONGODB_URI)
}

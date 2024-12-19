import mongoose, { Document, Schema } from 'mongoose'

export interface UserProps {
  name: string
  email: string
  password: string
  problemSolveStreak: number
  problemSolveCount: number
}

const UserSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  problemSolveStreak: {
    type: Number,
    default: 0,
  },
  problemSolveCount: {
    type: Number,
    default: 0,
  },
})

export default mongoose.models.User ||
  mongoose.model<UserProps>('User', UserSchema)

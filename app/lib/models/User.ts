import mongoose, { Schema } from 'mongoose'

export interface UserProps {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password: string
  streak: number
  totalProblemsSolved: number
  lastSolvedDate: string
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
  streak: {
    type: Number,
    default: 0,
  },
  totalProblemsSolved: {
    type: Number,
    default: 0,
  },
  lastSolvedDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
})

export default mongoose.models.User ||
  mongoose.model<UserProps>('User', UserSchema)

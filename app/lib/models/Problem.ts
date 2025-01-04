import mongoose, { Schema } from 'mongoose'

export interface ProblemProps {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  topic: string
  difficulty: string
  content: string
  userSolution?: string
  createdAt: Date
}

const ProblemSchema: Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  content: { type: String, required: true },
  userSolution: { type: String },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Problem ||
  mongoose.model<ProblemProps>('Problem', ProblemSchema)

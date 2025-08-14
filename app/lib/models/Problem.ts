import mongoose, { Schema } from 'mongoose'

export interface ProblemProps {
  _id?: mongoose.Types.ObjectId
  userId?: mongoose.Types.ObjectId
  title: string
  topic: string
  difficulty: string
  content: string
  contentHash: string
  userSolution: string
  createdAt: Date
}

const ProblemSchema: Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  content: { type: String, required: true },
  contentHash: { type: String, required: true, index: true },
  userSolution: { type: String },
  createdAt: { type: Date, default: Date.now },
})

ProblemSchema.index({ userId: 1, contentHash: 1 }, { unique: true })

export default mongoose.models.Problem ||
  mongoose.model<ProblemProps>('Problem', ProblemSchema)

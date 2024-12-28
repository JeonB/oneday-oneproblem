import mongoose, { Schema } from 'mongoose'

export interface ProblemProps {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  problemId: string
  topic: string
  difficulty: string
  problem: {
    description: string
    constraints: string[]
    examples: {
      input: string
      output: string
    }[]
  }
  userSolution?: string
  createdAt: Date
}

const ProblemSchema: Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  problem: {
    description: { type: String, required: true },
    constraints: [String],
    examples: [
      {
        input: String,
        output: String,
      },
    ],
  },
  userSolution: { type: String },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.User ||
  mongoose.model<ProblemProps>('Problem', ProblemSchema)

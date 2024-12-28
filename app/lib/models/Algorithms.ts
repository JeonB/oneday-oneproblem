import mongoose, { Schema } from 'mongoose'

export interface Algorithm {
  name: string
  topic: string
  img: string
}

const Algorithms: Schema = new Schema({
  name: { type: String, required: true, index: true },
  topic: { type: String, required: true },
  img: { type: String, required: false },
})

export default mongoose.models.Algorithms ||
  mongoose.model<Algorithm>('Algorithms', Algorithms)

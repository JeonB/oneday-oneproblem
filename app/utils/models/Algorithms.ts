import mongoose, { Document, Schema } from 'mongoose'

export interface Algorithms extends Document {
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
  mongoose.model<Algorithms>('Algorithms', Algorithms)

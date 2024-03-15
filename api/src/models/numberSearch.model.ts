import mongoose, { Schema, Document } from 'mongoose';

const indexSearch = new Schema(
  {
    index: { type: Number, default: 1, required: true },
  },
  { timestamps: true }
);
export default mongoose.model('indexSearch', indexSearch);

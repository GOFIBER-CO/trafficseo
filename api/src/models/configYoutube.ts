import mongoose, { Schema, Document } from 'mongoose';

const configYoutube = new Schema(
  {
    link: { type: String, default: '', required: true },
  },
  { timestamps: true }
);
export default mongoose.model('configYoutube', configYoutube);

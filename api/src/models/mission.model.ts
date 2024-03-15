import mongoose, { Schema } from 'mongoose';
import { IPostHome } from '../interfaces';
interface PostHomeDocument extends IPostHome, Document {}
const Mission = new mongoose.Schema(
  {
    status: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret, options) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model<PostHomeDocument>('Mission', Mission, 'Mission');

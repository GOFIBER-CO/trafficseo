import mongoose, { Schema } from 'mongoose';
import { IPostHome } from '../interfaces';
interface PostHomeDocument extends IPostHome, Document {}
const notificationReferral = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
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

export default mongoose.model<PostHomeDocument>(
  'notificationReferral',
  notificationReferral,
  'notificationReferral'
);

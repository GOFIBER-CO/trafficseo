import mongoose, { Schema, Document } from 'mongoose';
import { PostType } from '../interfaces';

const reportPostSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'post' },
    details: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        reason: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model('reportPost', reportPostSchema);

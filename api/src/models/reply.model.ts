import mongoose, { Schema, Document } from 'mongoose';

import { ReplyType } from '../interfaces';

export interface ReplyModel extends ReplyType, Document {}

const ReplySchema: Schema = new Schema({
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  commentId: { type: Schema.Types.ObjectId, ref: 'comment' },
  like: [{ type: Schema.Types.ObjectId, ref: 'user' }],
}, { timestamps: true });
export default mongoose.model('reply', ReplySchema);

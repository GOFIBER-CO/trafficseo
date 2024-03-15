import mongoose, { Schema, Document } from 'mongoose';
import { PointLogType } from '../interfaces';

export interface PointLog extends PointLogType, Document {}

const PointLogModel: Schema = new Schema(
  {
    post: { type: mongoose.Types.ObjectId, ref: 'post' },
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    point: { type: Number, required: true },
    userAgent: { type: String, required: true },
    origin: { type: String },
    ip: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<PointLog>('pointLogs', PointLogModel);

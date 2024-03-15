import mongoose, { Schema, Document } from 'mongoose';
import { PostType } from '../interfaces';
export interface PostModel extends PostType, Document {}

const PostSchema: Schema = new Schema(
  {
    stt: { type: Number, unique: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    whoSeen: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    userCompleted: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    quantityAfterReset: { type: Number, default: 0 },
    like: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    running: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    comment: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
    quantity: { type: Number, default: 50, min: 0 },
    browser: { type: String, default: '' },
    reportExtension: { type: Number, default: 0 },
    status: { type: Number, default: 0 }, //0 là mới tạo, chờ trợ lý duyệt //1 là leader đã duyệt , chờ trợ lý duyệt  // 2 là trợ lý duyệt, bài được hoạt động  // 3 là bài bị tắt //4 là leader từ chối //5 là trợ lý từ chối //6 là tắt do đủ số lượng
    note: { type: String, default: '' },
    repeat: { type: Number, default: 0 },
    dateCompleted: { type: Date, default: null },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    reportExtensionUser: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    startDate: { type: Date },
    endDate: { type: Date },
    quantityEveryDay: { type: Number, default: 50, min: 0 },
    quantityTotal: { type: Number, default: 50, min: 0 },
    quantityTotalRemain: { type: Number },
    quantityCurrent: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model<PostModel>('post', PostSchema);

import mongoose, { Schema, Document } from 'mongoose';
import { ActionHistoryType } from '../interfaces';

export interface ActionHistory extends ActionHistoryType, Document {}

const HistoryBlockAccount: Schema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    ip: { type: String, required: true },
    fp: { type: String, required: true },
    listUserSame: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    timestamps: true,
  }
);

HistoryBlockAccount.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default mongoose.model<ActionHistory>(
  'HistoryBlockAccount',
  HistoryBlockAccount
);

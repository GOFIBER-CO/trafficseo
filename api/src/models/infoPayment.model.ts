import mongoose, { Schema } from 'mongoose';
import { IInfoPayment } from '../interfaces';
interface InfoPaymentDocument extends IInfoPayment, Document {}
const InfoPayment = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    fullName: { type: String, required: true },
    stk: { type: String, required: true },
    bank: { type: String, required: true },
    code: String,
  },
  { timestamps: true }
);

export default mongoose.model<InfoPaymentDocument>(
  'InfoPayment',
  InfoPayment,
  'InfoPayment'
);

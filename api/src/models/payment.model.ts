import mongoose, { Schema } from 'mongoose';
import { IPayment } from '../interfaces';

const PaymentSchema = new mongoose.Schema(
  {
    stt: { type: Number, required: true },
    points: { type: Number, required: true },
    amount: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'rejected'],
      default: 'pending',
    },
    reason: {
      type: String,
    },
    image: {
      type: String,
    },
    infoPayment: {
      type: Object,

      required: true,
    },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model<IPayment>(
  'Payment',
  PaymentSchema,
  'Payment'
);

export default PaymentModel;

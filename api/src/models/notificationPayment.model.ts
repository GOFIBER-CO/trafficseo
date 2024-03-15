import mongoose, { Schema } from 'mongoose';
import { IPostHome } from '../interfaces';
interface NotificationDocument extends IPostHome, Document {}
const notificationPayment = new mongoose.Schema(
  {
    paymentId: { type: mongoose.Types.ObjectId, ref: 'Payment' },
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
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

export default mongoose.model<NotificationDocument>(
  'notificationPayment',
  notificationPayment,
  'notificationPayment'
);

import mongoose, { Schema, Document } from 'mongoose';

const quantityMaxPayment = new Schema(
  {
    quantity: { type: Number, default: 1, required: true },
  },
  { timestamps: true }
);
export default mongoose.model('quantityMaxPayment', quantityMaxPayment);

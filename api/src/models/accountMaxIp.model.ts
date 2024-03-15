import mongoose, { Schema, Document } from 'mongoose';

const AccountMaxIP = new Schema(
  {
    quantity: { type: Number, default: 5, required: true },
  },
  { timestamps: true }
);
export default mongoose.model('AccountMaxIP', AccountMaxIP);

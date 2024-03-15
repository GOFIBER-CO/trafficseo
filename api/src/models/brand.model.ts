import mongoose, { Schema } from 'mongoose';
import { IPostHome } from '../interfaces';
interface PostHomeDocument extends IPostHome, Document {}
const Brand = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<PostHomeDocument>('Brand', Brand, 'Brand');

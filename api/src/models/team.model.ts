import mongoose, { Schema } from 'mongoose';
import { IPostHome } from '../interfaces';
interface PostHomeDocument extends IPostHome, Document {}
const Team = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<PostHomeDocument>('Team', Team, 'Team');

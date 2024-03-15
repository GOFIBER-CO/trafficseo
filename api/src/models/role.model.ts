import mongoose, { Schema } from 'mongoose';

const Role = new Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
  },
});

export default mongoose.model('role', Role);

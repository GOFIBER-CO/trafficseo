import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
const permissionSchema = new mongoose.Schema(
  {
    role: {
      type: ObjectId,
      ref: 'role',
      required: true,
    },
    name: {
      type: String,
      require: true,
    },
    add: {
      type: Boolean,
      default: false,
    },
    view: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    del: {
      type: Boolean,
      default: false,
    },
    ext: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Permission = mongoose.model('Permission', permissionSchema);
export default Permission;

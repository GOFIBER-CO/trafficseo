import mongoose, { Schema, Document } from 'mongoose';
import { UserType } from '../interfaces';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface UserModel extends UserType, Document {}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, default: '' },
    email: { type: String, required: true, default: '' },
    password: { type: String, required: true, default: '' },
    telegram: { type: String, unique: true, default: '' },
    telegramId: { type: String, unique: true, default: '' },
    online: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: 'https://api.trafficsseo.com/7309681.jpg',
      require: false,
    },

    cmnd: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    acceptPost: {
      type: Boolean,
      default: false,
    },
    cardNumber: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: String,
      default: '',
    },
    postIdBlock: [{ type: Schema.Types.ObjectId, ref: 'post', default: [] }],
    roleOfUser: {
      type: Schema.Types.ObjectId,
      ref: 'role',
    },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    isAgency: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 0, // sẽ bao gồm 4 level là 1,2,3. 0 là mặc định
    },
    point: {
      type: Number,
      default: 0,
    },
    isActivated: {
      type: Boolean,
      default: true,
    },
    isAccept: {
      type: Number,
      default: 1, // 0 là chờ duyệt //-1 là không duyệt  // 1 là duyệt
    },
    ip: String,
    fp: String,
    secret: String,
    // socketId: {
    //   type: [String],
    //   default: [],
    // },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isCheckIpLogin: {
      type: Boolean,
      default: false,
    },
    ipLogin: {
      type: String,
      default: '',
    },
    isMission: {
      type: Boolean,
      default: false,
    },
    isEnable2FaAuthenticate: {
      type: Boolean,
      default: false,
    },

    refernalUser: {
      // đây là mã được gới thiệu
      type: String,
    },
    referralCode: {
      // đây là mã giới thiệu của người dùng
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(mongoosePaginate);

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.password;
  },
});

export default mongoose.model<UserModel>('user', UserSchema);

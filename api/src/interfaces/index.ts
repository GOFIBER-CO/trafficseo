import { Request } from 'express';
import mongoose from 'mongoose';

export interface UserType {
  name: string;
  username: string;
  password: string;
  postIdBlock?: any;
  socketId: string[];
  roleOfUser: any;
  online: boolean;
  point: number;
  email: string;
  _id?: any;
  _doc?: any;
  id?: any;
  cmnd: string;
  address: string;
  avatar: string;
  cardNumber: string;
  bank: string;
  computer: string;
  salary: number;
  startTime: Date;
  workStatus: boolean;
  isDeleted: boolean;
  follower: any[];
  following: any[];
  secret: string;
  twoFactor: boolean;
}
export interface CommentType {
  content: string;
  userId: any;
  postId: any;
  like: any[];
  reply: any[];
  _id?: any;
  _doc?: any;
  isDeleted: boolean;
}

export interface IInfoPayment {
  user: mongoose.Types.ObjectId;
  fullName: string;
  stk: string;
}

export interface IPostHome {
  title: string;
  content: string;
  description: string;
}

export interface IPayment {
  points: number;
  amount: number;
  user: mongoose.Types.ObjectId;
  status: string;
  infoPayment: mongoose.Types.ObjectId;
}

export interface PostType {
  content: string;
  userId: any;
  like: any[];
  comment: any[];
  _id?: any;
  _doc?: any;
  isDeleted: boolean;
  quantity: number;
  status: number;
  reportExtension: number;
}
export interface ChatRequest extends Request {
  files?: any;
  user?: UserType;
}
export interface UploadRequest extends Request {
  files?: any;
}

export interface ReplyType {
  content: string;
  userId: any;
  commentId: any;
  like: any[];
  _id?: any;
  _doc?: any;
  isDeleted: boolean;
}

export interface CRequest extends Request {
  user: any;
}

export type ResponseStatus = 0 | 1;

export interface AuthRequest extends Request {
  user?: UserType;
}

export interface RequestType {
  title: string;
  group: any;
  createdDate: number;
  updatedDate: number;
  status: number;
  user: any;
  approver: any;
  approvedDate: Date;
  expiredDate: Date;
  attachments: any[];

  // báo quên checkout
  forgetDate?: Date;
  shift?: number;
  followers?: any;
}
export interface ActionHistoryType {
  action: string;
  user: string;
  createdAt: string;
  detail: string;
  ip: string;
}
export interface PointLogType {
  action: string;
  user: string;
  createdAt: string;
  detail: string;
  ip: string;
}

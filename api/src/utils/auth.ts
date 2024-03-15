import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export const verifyToken = (
  token: string,
  secretKey: string,
  options: any,
  callback: any
) => {
  jwt.verify(token, secretKey, options, callback);
};

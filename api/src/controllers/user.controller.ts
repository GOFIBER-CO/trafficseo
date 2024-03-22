//@ts-nocheck
import { genSaltSync, hashSync } from 'bcryptjs';

import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';
import userModel from '../models/user.model';
import { responseModel } from '../helper/responseModel';
import { RESPONSE_STATUS } from '../utils';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { compareSync } from 'bcrypt';
import { AuthRequest } from '../interfaces';
import axios from 'axios';
import roleModel from '../models/role.model';
import actionHistory from '../models/log.model';
import shortid from 'shortid';
import mongoose from 'mongoose';
import pointLogModel from '../models/pointLog.model';
import { generateUserCode } from '../utils/generateUserCode';
import {
  NOTICE_USER_EXIST_FP,
  senLogToUser,
  sendLog,
} from '../helper/Bottelegram';
import historyBlockAccountModel from '../models/historyBlockAccount.model';
import Permission from '../models/permission.model';
import qrcode from 'qrcode';
import { authenticator } from '@otplib/preset-default';

const generateUniqueSecret = () => {
  return authenticator.generateSecret();
};

const generateOTPToken = (username, serviceName, secret) => {
  return authenticator.keyuri(username, serviceName, secret);
};

const verifyOTPToken = (token, secret) => {
  return authenticator.verify({ token, secret });
};

const generateQRCode = async (otpAuth) => {
  try {
    const QRCodeImageUrl = await qrcode.toDataURL(otpAuth);
    return QRCodeImageUrl;
  } catch (error) {
    // console.log('Could not generate QR code', error);
    return;
  }
};

export async function getQrCode(req, res) {
  if (req.params.id) {
    const id = req.params.id;
    try {
      const user = await userModel.findById(id);
      if (!user) return res.status(404).json({ message: 'Không có user' });
      const secret = generateUniqueSecret();
      await userModel.findByIdAndUpdate(id, { secret: secret });
      const otpToken = generateOTPToken(user.username, 'login', secret);
      const qrcode = await generateQRCode(otpToken);
      return res.status(200).json({ qrcode: qrcode, secret: secret });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  } else {
    return res.status(403).json({ message: 'Không có user' });
  }
}

export async function verify2FaToken(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const token = req.body.token;

    const user = await userModel.findById(id).populate('roleOfUser');
    const check = verifyOTPToken(token, user?.secret);

    if (check) {
      await userModel.findByIdAndUpdate(id, { isEnable2FaAuthenticate: true });

      user.password = '';
      user.secret = '';
      return res
        .status(200)
        .json({ status: 1, message: 'Verify token thành công', user: user });
    }
    return res
      .status(400)
      .json({ status: -1, message: 'Verify token thất bại' });
  } catch (error) {
    // console.log(error);
    return res
      .status(500)
      .json({ status: -1, message: 'Verify token thất bại' });
  }
}

export async function verify2FaTokenLogin(req: Request, res: Response) {
  try {
    // console.log(req.body);
    if (!req.params.id || !req.body.token) {
      return res.status(403).json({ message: 'Thiếu token hoặc user id' });
    }

    const id = req.params.id;
    const token = req.body.token;

    const user = await userModel.findById(id).populate('roleOfUser');

    const check = verifyOTPToken(token, user?.secret);

    if (check) {
      req.session.user = {
        isEnable2FaAuthenticate: user?.isEnable2FaAuthenticate,
        verify2Fa: true,
      };
      return res
        .status(200)
        .json({ status: 1, message: 'Verify token thành công' });
    }
    return res.status(403).json({ message: 'Verify token thất bại' });
  } catch (error) {
    console.log(error);
  }
}

export async function disabled2Fa(req, res) {
  try {
    const user = await userModel.findById(req.params.id);
    console.log(req.body);
    if (compareSync(req.body.password, user?.password)) {
      userModel
        .findByIdAndUpdate(req.params.id, {
          isEnable2FaAuthenticate: false,
          secret: '',
        })
        .exec((err, result) => {
          if (err) {
            return res.status(400).json({
              status: -1,
              message: 'Tắt chức năng bảo mật 2 lớp thất bại!',
            });
          }
          return res.status(200).json({
            status: 1,
            message: 'Tắt chức năng bảo mật 2 lớp thành công',
          });
        });
    } else {
      return res.json({ status: -1, message: 'Sai mật khẩu!' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: -1, message: 'Có lỗi xảy ra' });
  }
}
export async function login2Fa(req, res) {
  try {
    if (!req.body.id || !req.body.token) {
      return res.status(403).json({ message: 'Thiếu token hoặc user id' });
    }
    const id = req.body.id;
    const token = req.body.token;

    const user = await userModel.findById(id).populate('role');

    const check = verifyOTPToken(token, user.secret);

    if (check) {
      user.password = '';
      user.secret = '';
      jwt.sign(
        { user },
        secretKey,
        { expiresIn: '24h' },
        async (err, token) => {
          if (err) {
            return res.json({ status: -1, message: 'Đăng nhập thất bại' });
          } else {
            const expiredAt = new Date(
              new Date().setHours(new Date().getHours() + 4)
            );

            return res.json({
              status: 1,
              message: 'Đăng nhập thành công!',
              data: { user, token, expiredAt },
            });
          }
        }
      );
    } else {
      return res.status(403).json({ message: 'Verify token thất bại' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Có lỗi xảy ra' });
  }
}
import ipLoginAdminModel from '../models/ipLoginAdmin.model';
import accountMaxIpModel from '../models/accountMaxIp.model';
import infoPaymentModel from '../models/infoPayment.model';

class UserController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const blackListIp = [
        '222.255.171.121',
        '2401:d800:decd:ad63:67d4:376e:d99e:19b',
        '2402:9d80:26f:bd4c:ec8d:f9a6:d99e:511d',
      ];
      const ip = req.headers['x-forwarded-for']?.split(',') || [];
      if (blackListIp?.includes(ip?.[0])) {
        throw new Error('IP Black List');
      }
      const schema = Joi.object({
        password: Joi.string().required().max(32).min(6).messages({
          'string.empty': 'Mật khẩu không được để trống',
          'string.min': 'Mật khẩu phải có tối thiểu 6 chữ',
          'string.max': 'Mật khẩu tối đa là 32 chữ',
        }),
        email: Joi.string().email().max(32).required().messages({
          'string.empty': 'Eamil không được để trống',
          'string.email': 'Email không đúng định dạng',
          'string.max': 'Email tối đa là 32 chữ',
        }),
      });

      const validate = schema.validate(req.body);

      if (validate.error) {
        throw new Error(validate.error.message);
      }

      const checkExist = await userModel
        .findOne({ email: req.body.email, isActivated: true })
        .populate('roleOfUser')
        .populate('team')
        .lean();

      console.log(req.body, checkExist);

      if (
        (checkExist?.roleOfUser?.name === 'btv' ||
          checkExist?.roleOfUser?.name === 'user') &&
        req.get('origin') === 'https://admin.trafficseo.online'
      )
        return res.json({
          status: -1,
          message: 'Tài khoản của bạn không được đăng nhập ở đây!',
        });
      if (!checkExist) {
        return res.json({
          status: -1,
          message: 'Tài khoản không tồn tại hoặc đã bị khóa!',
        });
      }
      if (checkExist?.isAccept === 0)
        return res.json({
          status: -1,
          message:
            'Tài khoản của bạn đang đợi duyệt. Vui lòng liên hệ admin để duyệt nhanh hơn!',
        });

      if (checkExist?.isAccept === -1)
        return res.json({
          status: -1,
          message: 'Tài khoản của bạn không được duyệt!',
        });
      const ipAcceptLoginAdmin = await ipLoginAdminModel.findOne();

      if (
        checkExist?.roleOfUser?.name === 'superAdmin' &&
        ip?.[0] !== ipAcceptLoginAdmin?.ip &&
        ipAcceptLoginAdmin?.ip !== '' &&
        ip?.length !== 0
      ) {
        return res.json({
          status: -1,
          message: 'Bạn không có quyền đăng nhập ở ip này!',
        });
      }
      if (
        checkExist?.isCheckIpLogin &&
        ip?.[0] !== checkExist?.ipLogin &&
        ip?.length !== 0 &&
        checkExist?.ipLogin !== ''
      ) {
        return res.json({
          status: -1,
          message: 'Bạn không có quyền đăng nhập ở ip này!',
        });
      }

      const checkPassword = compareSync(req.body.password, checkExist.password);

      if (!checkPassword) {
        return res.json({ status: -1, message: 'Sai mật khẩu!' });
      }

      const userAbility: any = [];

      const accessToken = jwt.sign(
        { id: checkExist._id ? checkExist._id : checkExist.id },
        config.auth.jwtSecretKey,
        { expiresIn: '1d' }
      );
      const refreshTokens = jwt.sign(
        { id: checkExist.id ? checkExist.id : checkExist._id },
        config.auth.jwtSecretKey,
        { expiresIn: '1d' }
      );
      delete checkExist.secret;
      const { password, ...returnUser } = checkExist;
      const permission = await Permission.find({
        role: checkExist?.roleOfUser?._id,
      }).select('name');
      const arrPermission = permission?.map((item) => item?.name);
      req.session.user = {
        isEnable2FaAuthenticate: checkExist?.isEnable2FaAuthenticate,
        verify2Fa: false,
      };
      const response = {
        message: 'Đăng nhập thành công',
        status: RESPONSE_STATUS.SUCCESS,
        user: { ...returnUser, ability: userAbility },
        accessToken,
        permission: arrPermission,
        isEnable2FaAuthenticate: checkExist?.isEnable2FaAuthenticate,
        verify2Fa: false,
        refreshToken: refreshTokens,
      };
      await userModel.updateOne(
        {
          email: req.body.email,
        },
        { ip: req.headers['x-forwarded-for'] || '::1' }
      );
      const bodyLog = { ...req.body };
      delete bodyLog.password;
      await actionHistory.create({
        actionName: `Người dùng đăng nhập`,
        requestDetail: `query: ${JSON.stringify(
          req.query
        )}, params: ${JSON.stringify(req.params)}, body:  ${JSON.stringify(
          bodyLog
        )}`,
        ip: req.headers['x-forwarded-for'] || '::1',
        user: checkExist._id,
      });
      // sendLog(`Người dùng đang nhập \n${JSON.stringify(checkExist)}`);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async updateFP(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user._id;

      const { visitorId, ip } = req.body;
      const userAfterUpdate = await userModel
        .findOneAndUpdate(
          { _id: id },
          {
            fp: visitorId,
            ip: ip,
          },
          { new: true }
        )
        .populate('roleOfUser');
      if (
        userAfterUpdate?.roleOfUser?.name === 'superAdmin' ||
        userAfterUpdate?.roleOfUser?.name == 'admin' ||
        userAfterUpdate?.acceptPost === true
      )
        return res.json({});
      const listUserByFP = await userModel
        .find({ fp: visitorId, _id: { $ne: id }, ip: ip })
        .select('_id email roleOfUser acceptPost')
        .populate('roleOfUser');

      if (listUserByFP?.length > 0) {
        listUserByFP?.forEach(async (user) => {
          if (
            user?.roleOfUser?.name !== 'superAdmin' &&
            user?.roleOfUser?.name !== 'admin' &&
            user?.acceptPost === false
          )
            await userModel.updateOne(
              { _id: user?._id },
              { isActivated: false }
            );
        });
        await userModel.updateOne({ _id: id }, { isActivated: false });
        const listId = listUserByFP?.map((item) => item?._id);

        const listEmail = listUserByFP?.map((item) => item?.email);
        senLogToUser(
          '-4082475559',
          NOTICE_USER_EXIST_FP({
            email: userAfterUpdate?.email,
            users: listEmail,
            fp: visitorId,
          })
        );
        await historyBlockAccountModel.create({
          user: id,
          fp: visitorId,
          ip: ip,
          listUserSame: listId,
        });
        return res.json({});
      }
      return res.json({});
    } catch (error) {
      //   console.log(error);
    }
  }
  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object({
        password: Joi.string().required().max(32).min(6).messages({
          'string.empty': 'Mật khẩu không được để trống',
          'string.min': 'Mật khẩu phải có tối thiểu 6 chữ',
          'string.max': 'Mật khẩu tối đa là 32 chữ',
        }),
        newPassword: Joi.string().required().max(32).required().messages({
          'string.empty': 'Eamil không được để trống',
          'string.min': 'Mật khẩu mới  phải có tối thiểu 6 chữ',
          'string.max': 'Mật khẩu mới tối đa là 32 chữ',
        }),
      });
      const validate = schema.validate(req.body);
      const checkExist = await userModel
        .findById(req.user?._id)
        .populate('roleOfUser')
        .lean();

      if (!checkExist) {
        throw new Error('User does not exist');
      }
      if (validate.error) {
        throw new Error(validate.error.message);
      }
      const salt = genSaltSync(Number(process.env.SALT_ROUND || 10));

      const checkPassword = compareSync(req.body.password, checkExist.password);
      const hash = hashSync(req.body.newPassword, salt);
      await userModel.findByIdAndUpdate(req.user?._id, { password: hash });
      if (!checkPassword) {
        return res.json({ status: -1, message: 'Sai mật khẩu!' });
      }
      const response = {
        message: 'Tạo tài khoản thành công',
        status: RESPONSE_STATUS.SUCCESS,
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      req.session.destroy();
      const response = {
        message: 'Đăng xuất thành công!',
        status: RESPONSE_STATUS.SUCCESS,
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object({
        username: Joi.string().required().max(32).min(6).messages({
          'string.empty': 'Tên người dùng không được để trống',
          'string.min': 'Tên người dùng phải có tối thiểu 6 chữ',
          'string.max': 'Tên người dùng tối đa là 32 chữ',
        }),
        password: Joi.string().required().max(32).min(6).messages({
          'string.empty': 'Mật khẩu không được để trống',
          'string.min': 'Mật khẩu phải có tối thiểu 6 chữ',
          'string.max': 'Mật khẩu tối đa là 32 chữ',
        }),
        email: Joi.string().email().max(32).required().messages({
          'string.empty': 'Eamil không được để trống',
          'string.email': 'Email không đúng định dạng',
          'string.max': 'Email tối đa là 32 chữ',
        }),
        team: Joi.string(),
        telegram: Joi.string(),
        telegramId: Joi.string(),
      });
      // console.log(req.headers['x-forwarded-for'])
      const validate = schema.validate(req.body);

      if (validate.error) {
        throw new Error(validate.error.message);
      }

      const salt = genSaltSync(Number(process.env.SALT_ROUND || 10));
      const hash = hashSync(req.body.password, salt);

      const checkExistEmail = await userModel.find({
        email: req.body.email,
      });

      if (checkExistEmail.length > 0) {
        throw new Error('Email đã tồn tại');
      }

      const findRole = await roleModel.findOne({ name: 'btv' });
      const newUser = await userModel.create({
        roleOfUser: findRole?._id,
        username: req.body.username,
        email: req.body.email,
        team: req.body.team,
        password: hash,
        isAccept: false,
        telegram: req.body.telegram,
        telegramId: req.body.telegramId,
        referralCode: shortid.generate(),
      });
      const { password, ...returnUser } = newUser;

      const accessToken = jwt.sign(
        { id: newUser.id },
        config.auth.jwtSecretKey,
        { expiresIn: '1d' }
      );

      const response = {
        message: 'Tạo tài khoản thành công',
        status: RESPONSE_STATUS.SUCCESS,
        user: { ...returnUser?._doc },
        accessToken,
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async loginWithGoogle(req: Request, res: Response, next: NextFunction) {
    try {
      const { tokenId, referralCode } = req.body;

      const verifyToken = await axios({
        method: 'GET',
        url: `https://oauth2.googleapis.com/tokeninfo?access_token=${tokenId}`,
        withCredentials: true,
      });
      if (verifyToken.status === 200) {
        //const { email_verified, email, name, picture } = verifyToken.data;
        const userData = await axios({
          method: 'GET',
          url: `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenId}`,
          withCredentials: true,
        });
        const { id, given_name, family_name, link, picture, name, email } =
          userData.data;
        //  const { email_verified, email, name, picture } = verifyToken.data;

        const findRole: any = await roleModel.findOne({ name: 'user' });
        const checkValidEmail = await userModel.findOne({ email: email });

        if (!checkValidEmail) {
          const ip = req.headers['x-forwarded-for']?.split(',')?.[0] || '::1';
          const countAccount = await userModel.countDocuments({ ipLogin: ip });
          const maxAccountIp = await accountMaxIpModel.findOne({});
          if (countAccount >= maxAccountIp?.quantity) {
            return res.json({
              status: RESPONSE_STATUS.FAILED,
              message: 'IP này đã đạt đến số lượng account tối đa',
            });
          }
          const salt = genSaltSync(Number(process.env.SALT_ROUND || 10));
          const hash = hashSync(String(process.env.SECRET_PASSWORD), salt);
          const newUser = await userModel.create({
            ipLogin: ip,
            username: name,
            roleOfUser: findRole?._id,
            email: email,
            avatar: picture,
            password: hash,
            refernalUser: referralCode || null,
            point: referralCode ? 0 : 0,
            referralCode: shortid.generate(),
          });
          const { password, ...returnUser } = newUser._doc;

          const accessToken = jwt.sign(
            { id: newUser.id ? newUser.id : newUser._id },
            config.auth.jwtSecretKey,
            { expiresIn: '1d' }
          );

          const response = {
            message: 'Tạo tài khoản thành công',
            status: RESPONSE_STATUS.SUCCESS,
            user: returnUser,
            accessToken,
          };
          await actionHistory.create({
            actionName: `Người dùng đăng nhập`,
            requestDetail: `query: ${JSON.stringify(
              req.query
            )}, params: ${JSON.stringify(req.params)}, body:  ${JSON.stringify(
              req.body
            )}`,
            ip: req.headers['x-forwarded-for'] || '::1',
            user: newUser._id,
          });
          sendLog(`Người dùng đăng nhập\n ${JSON.stringify(newUser)}`);
          return res.status(200).json(response);
        } else {
          const user: any = await userModel.findOne({ email: email });
          if (user.isActivated === false) {
            throw new Error('Tài khoản của bạn đã bị khóa');
          }

          const { password, ...returnUser } = user._doc;
          const accessToken = jwt.sign(
            { id: user._id },
            config.auth.jwtSecretKey,
            { expiresIn: '1d' }
          );
          const response = {
            message: 'Đăng nhập thành công',
            status: RESPONSE_STATUS.SUCCESS,
            user: returnUser,
            accessToken,
          };
          await actionHistory.create({
            actionName: `Người dùng đăng nhập`,
            requestDetail: `query: ${JSON.stringify(
              req.query
            )}, params: ${JSON.stringify(req.params)}, body:  ${JSON.stringify(
              req.body
            )}`,
            ip: req.headers['x-forwarded-for'] || '::1',
            user: user._id,
          });
          sendLog(`Người dùng đăng nhập\n ${JSON.stringify(user)}`);
          return res.status(200).json(response);
        }
      } else {
        const response = {
          message: 'Token không lệ ',
          status: RESPONSE_STATUS.FAILED,
          user: null,
        };
        return res.status(200).json(response);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateProfileForSuperAdmin(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      if (!id) {
        throw new Error('Không tìm thấy Phong Ban');
      }
      const bodyLog = { ...req.body };
      delete bodyLog.point;
      const updateUser = await userModel.findById(id, req.body);
      const response = {
        message: 'Cập nhật thành công',
        status: RESPONSE_STATUS.SUCCESS,
        user: updateUser,
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async upgradePoint(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id) {
        throw new Error('Không tìm thấy Phong Ban');
      }
      const { point } = req.body;

      const updateUser = await userModel.findByIdAndUpdate(
        id,
        {
          $inc: { point: parseInt(point) },
        },
        { new: true }
      );
      const response = {
        message: 'Cập nhật thành công',
        status: RESPONSE_STATUS.SUCCESS,
        user: updateUser,
      };
      sendLog(
        `Admin cộng điểm cho người dùng ${updateUser?.username} với số điểm ${point}`
      );
      await actionHistory.create({
        actionName: `Cộng điểm cho người dùng`,
        requestDetail: `Số điểm ${point}`,
        ip: req.headers['x-forwarded-for'] || '::1',
        user: req.params.id,
      });
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async deleteUserForSuperAdmin(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      if (!id) {
        throw new Error('Không tìm thấy Phong Ban');
      }
      const deleteUser = await userModel.findByIdAndDelete(id);
      const response = {
        message: 'Xóa thành công',
        status: RESPONSE_STATUS.SUCCESS,
        user: null,
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async getPagingUser(req: Request, res: Response, next: NextFunction) {
    try {
      let size: any = req.query.pageSize || 10;
      let page: any = req.query.pageIndex || 1;
      const status: any = req.query.status || '';
      const search = req.query.search || '';
      const sort = req.query.sort || 'createdAt';
      const startDate = req.query.startDate;
      const isAccept = req.query.isAccept || null;
      const endDate = req.query.endDate;
      const team = req.query.team || null;
      const role = req.query.role || null;
      if (size === 'undefined') {
        size = 10;
      }
      if (page === 'undefined') {
        page = 1;
      }
      let searchObj = {} as any;

      searchObj.roleOfUser = {
        $ne: '643e0df3b1245b360817b0a7',
      };
      if (isAccept && isAccept !== 'undefined') {
        searchObj.isAccept = isAccept;
      }
      if (startDate && endDate) {
        const temp = new Date(endDate);
        temp.setHours(29, 59, 59, 999);
        searchObj.createdAt = { $gte: startDate, $lte: temp };
      }
      if (status) {
        searchObj.isActivated = status;
      }
      if (team && team !== 'undefined' && team !== 'null') {
        searchObj.team = team;
      }
      if (role && role !== 'undefined' && role !== 'null') {
        searchObj.roleOfUser = role;
      }
      if (search && search !== 'undefined') {
        searchObj = {
          ...searchObj,
          $or: [
            { username: { $regex: `.*${search}.*`, $options: 'i' } },
            { email: { $regex: `.*${search}.*`, $options: 'i' } },
            { ip: { $regex: `.*${search}.*`, $options: 'i' } },
          ],
        };
      }

      const users = await userModel
        .find(searchObj)
        .skip(Number(page) * Number(size) - Number(size))
        .limit(Number(size))
        .populate('roleOfUser')
        .populate('postIdBlock')
        .populate('team')
        .sort({ [sort]: -1 });
      const total = await userModel.find(searchObj).countDocuments();
      const totalPages = Math.ceil(total / Number(size));

      const response = {
        message: 'Lấy danh sách thành công',
        status: RESPONSE_STATUS.SUCCESS,
        users,
        total,
        totalPages,
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async addUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        username,
        email,
        passwordForUser,
        roleOfUser,
        isActivated,
        team,
      } = req.body;
      const salt = genSaltSync(Number(process.env.SALT_ROUND || 10));
      const hash = hashSync(passwordForUser, salt);
      const newUser = await userModel.create({
        username,
        roleOfUser,
        email,
        team,
        password: hash,
        referralCode: shortid.generate(),
        isActivated,
      });
      const { password, ...returnUser } = newUser._doc;
      const response = {
        message: 'Tạo tài khoản thành công',
        status: RESPONSE_STATUS.SUCCESS,
        user: returnUser,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async editUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error('Không tìm thấy người dùng');
      }
      const bodyLog = { ...req.body };

      if (bodyLog?.password && bodyLog?.password !== '') {
        const salt = genSaltSync(Number(process.env.SALT_ROUND || 10));
        const hash = hashSync(bodyLog.password, salt);
        bodyLog.password = hash;
      } else {
        delete bodyLog.password;
      }

      delete bodyLog.point;
      if (bodyLog.isAccept === 1 && user.isAccept !== bodyLog.isAccept) {
        bodyLog.acceptPost = true;
      }

      const userUpdate = await userModel.findByIdAndUpdate(
        req.params.id,
        bodyLog
      );

      // add bank
      const { bank, fullName, stk } = req.body;

      if (bank && fullName && stk) {
        const infoPayment = await infoPaymentModel.findOne({
          user: req.params.id,
        });

        await infoPaymentModel.findByIdAndUpdate(
          infoPayment?._id || new mongoose.Types.ObjectId(),
          {
            $set: {
              user: req.params.id,
              bank,
              fullName,
              stk,
            },
          },
          {
            upsert: true,
          }
        );
      }

      const response = {
        message: 'Cập nhật thành công',
        status: RESPONSE_STATUS.SUCCESS,
        user: userUpdate,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error('Không tìm thấy người dùng');
      }
      const userUpdate = await userModel.findByIdAndDelete(req.params.id);
      const response = {
        message: 'Xóa thành công',
        status: RESPONSE_STATUS.SUCCESS,
        user: null,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async checkAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = jwt.sign(
        { id: req.user?._id ? req?.user?._id : req?.user?.id },
        config.auth.jwtSecretKey,
        { expiresIn: '1d' }
      );

      const user = await userModel
        .findById(req?.user?._id)
        .populate('roleOfUser')
        .populate('team');

      const permission = await Permission.find({
        role: req?.user?.roleOfUser,
      }).select('name');
      const arrPermission = permission?.map((item) => item?.name);
      const response = {
        message: 'Verified',
        status: RESPONSE_STATUS.SUCCESS,
        user: user,
        permission: arrPermission,
        accessToken,
        ...req.session.user,
      };
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }
  async startMission(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userModel.findByIdAndUpdate(
        req.user?._id,
        { isMission: true },
        { new: true }
      );
      if (!user) {
        throw new Error('Không tìm thấy người dùng');
      }

      const response = {
        message: 'Cập nhật thành công',
        status: RESPONSE_STATUS.SUCCESS,
        user,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async stopMission(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userModel.findByIdAndUpdate(
        req.user?._id,
        { isMission: false },
        { new: true }
      );
      if (!user) {
        throw new Error('Không tìm thấy người dùng');
      }

      const response = {
        message: 'Cập nhật thành công',
        status: RESPONSE_STATUS.SUCCESS,
        user,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  // lấy danh sách user theo referralUser
  async getPagingUserByRefernal(req: any, res: Response, next: NextFunction) {
    try {
      const pageIndex = Number(req.query.pageIndex) || 1;
      const pageSize = Number(req.query.pageSize) || 10;
      // mã giới thiệu của user
      let { referralUser } = req.user;

      // nếu là admin thì có quyền tìm theo userId truyền vào
      const { userId } = req.query;
      if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId))
          throw new Error('ID không hợp lệ!');

        const user: any = await userModel
          .findById(userId)
          .select('referralUser');
        if (!user) throw new Error('Không tìm thấy user!');

        if (
          req.user.role.name !== 'admin' &&
          req.user._id.toString() !== userId.toString()
        ) {
          throw new Error(
            'Bạn không có quyền xem danh sách người được mời của user này!'
          );
        }
        referralUser = user.referralUser;
      }
      const [users, totalDocs] = await Promise.all([
        userModel
          .find({ referralUser: referralUser })
          .select('-password -__v -createdAt -updatedAt')
          .limit(pageSize)
          .skip(pageSize * (pageIndex - 1)),
        userModel
          .find({
            referralUser: referralUser,
          })
          .countDocuments(),
      ]);
      const totalPages = Math.ceil(totalDocs / pageSize);

      res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        message: `Lấy danh sách người đã được mời thành công`,
        totalDocs,
        totalPages,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
  // lấy hoa hồng nhận được trong 1 tháng.
  async getCommissionReceived(req: any, res: Response, next: NextFunction) {
    try {
      const pageSize = +req?.query?.pageSize || 10;
      const pageIndex = +req?.query?.pageIndex || 1;
      const { referralCode } = req?.user;
      let month: any = +req?.query?.month;
      const year: number = +req?.query?.year;
      let monthIncrease: any = '';
      let yearIncrease: any = '';
      const condition: any = {
        point: { $gt: 200 },
      };
      if (!referralCode) {
        return res.status(200).json({
          status: RESPONSE_STATUS.SUCCESS,
          message: `Thành công`,
          commissionDetailList: [],
          commissionsTotal: 0,
          totalDocs: 0,
        });
      }
      //Điều kiện
      if (month) {
        if (!year)
          return res.status(400).json({ message: 'Vui lòng chọn năm.' });
        month = month < 10 && `0${month}`;
        monthIncrease = +month + 1;
        monthIncrease = monthIncrease < 10 && `0${monthIncrease}`;
        condition['createdAt'] = {
          $gte: new Date(`${year}-${month}-01`),
          $lt: new Date(`${year}-${monthIncrease}-01`),
        };
      } else {
        if (year) {
          yearIncrease = year + 1;
          condition['createdAt'] = {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${yearIncrease}-01-01`),
          };
        }
      }
      //   console.log(condition);
      const [commissionDetail, commissionTotal] = await Promise.all([
        userModel.aggregate([
          {
            $match: {
              refernalUser: referralCode,
            },
          },
          {
            $lookup: {
              from: 'pointlogs',
              let: { userId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$user', '$$userId'] },
                    ...condition,
                  },
                },
              ],
              as: 'Logs',
            },
          },
          // {
          //   $unwind: { path: '$Logs' },
          // },
          // {
          //   $match: {
          //     $and: [condition],
          //   },
          // },
          {
            $addFields: {
              totalCopies: { $sum: '$Logs.point' },
              totalCopiesWithPercentage: {
                $multiply: [{ $sum: '$Logs.point' }, 0.05],
              }, // Nhân kết quả với 3%
            },
          },
          {
            $group: {
              _id: { fullName: '$username' },
              totalCopies: { $sum: '$totalCopiesWithPercentage' },
            },
          },
          { $sort: { totalCopies: -1 } },

          {
            $skip: (pageIndex - 1) * pageSize,
          },
          {
            $limit: pageSize,
          },
        ]),
        userModel.aggregate([
          {
            $match: {
              refernalUser: referralCode,
            },
          },

          {
            $lookup: {
              from: 'pointlogs',
              localField: '_id',
              foreignField: 'user',
              as: 'Logs',
            },
          },
          {
            $unwind: '$Logs',
          },
          {
            $match: {
              $and: [condition],
            },
          },
          {
            $group: {
              _id: '$_id',
              totalCopies: { $sum: '$Logs.point' },
              totalCopiesWithPercentage: {
                $sum: { $multiply: ['$Logs.point', 0.05] },
              }, // Nhân kết quả với 3%
            },
          },
          {
            $project: {
              _id: 1,
              totalCopiesWithPercentage: 1,
            },
          },
        ]),
      ]);

      const commissionsTotal = commissionTotal.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.totalCopiesWithPercentage,
        0
      );
      // console.log("🚀 ~ file: user.controller.ts:604 ~ UserControlle r~ getCommissionReceived ~ rs:", commissionDetail, commissionTotal)
      return res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        message: `Thành công`,
        commissionDetailList: commissionDetail,
        commissionsTotal: commissionsTotal,
        totalDocs: commissionTotal?.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy tổng số thành viên nhập code
  async getCommissionReceivedTotal(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { referralCode } = req.user;
      const countRes = await userModel
        .find({ refernalUser: referralCode })
        .countDocuments();
      return res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        message: `Thành công`,
        userReceivedCodeList: countRes,
      });
      //
    } catch (error) {
      next(error);
    }
  }
  async insertReferralCodeForUserMissing(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updateReferralCode = async () => {
        const userMissingReferralCodeList = await userModel
          .find({ referralCode: { $ne: 'jfEHUEH8' } })
          .select('_id');
        for (let i = 0; i < userMissingReferralCodeList.length; i++) {
          const code: any = generateUserCode();
          const checkReferralCodeExist = await userModel.findOne({
            referralCode: code,
          });
          if (checkReferralCodeExist) {
            // console.log(`bị trùng nè, tôi sẽ chạy lại liền`)
            updateReferralCode();
          }
          const id = userMissingReferralCodeList[i]._id.toString();
          await userModel.findByIdAndUpdate(id, {
            $set: { referralCode: code },
          });
          // console.log(`Thành công ${i + 1}`)
        }
        return res.status(200).json({ message: 'Thành công' });
      };
      updateReferralCode();
    } catch (error) {
      next(error);
    }
  }
  async checkReferralCodeDuplicate(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const referralCodeList = await userModel.aggregate([
        {
          $group: {
            _id: '$referralCode',
            count: { $sum: 1 },
          },
        },
      ]);
      const duplicatelist: any = [];
      referralCodeList?.map((item) => {
        if (item?.count !== 1) duplicatelist.push(item);
      });
      return res.json({ duplicatelist });
    } catch (error) {
      next(error);
    }
  }

  async getTotalCommissionAndMoney(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { _id } = req.user;
      const { startDate, endDate } = req.query;
      const [countTotalComission, totalPoint, dataPoint] = await Promise.all([
        pointLogModel.countDocuments({
          user: _id,
          point: { $gte: 300 },
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        }),
        pointLogModel.aggregate([
          {
            $match: {
              user: _id,
              point: { $gte: 300 },
              createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
              },
            },
          },
          {
            $group: {
              _id: null,
              totalPoints: { $sum: '$point' },
            },
          },
        ]),
        pointLogModel
          .find({
            user: _id,
            point: { $gte: 300 },
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          })
          .populate('post'),
      ]);
      const listDomain = {},
        listKey = {};

      dataPoint?.map((item) => {
        if (item?.post) {
          const splitContent = item?.post?.content?.split('###');
          listDomain[splitContent[1]] =
            (listDomain[splitContent[1]] || 0) + item?.point;
          listKey[splitContent[0]] =
            (listKey[splitContent[0]] || 0) + item?.point;
        }
      });

      return res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        message: `Thành công`,
        data: {
          totalComission: countTotalComission,
          totalPoint: totalPoint?.[0]?.totalPoints || 0,
          listDomain,
          listKey,
        },
      });
      //
    } catch (error) {
      next(error);
    }
  }
  async enableUpPostUser(req: any, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      if (ids?.length === 0) {
        return res.status(200).json({
          status: RESPONSE_STATUS.SUCCESS,
          message: `Cập nhật người dùng thành công`,
        });
      }
      await userModel.updateMany({ _id: { $in: ids } }, { acceptPost: true });

      return res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        message: `Cập nhật người dùng thành công`,
      });
      //
    } catch (error) {
      next(error);
    }
  }
  async disableUpPostUser(req: any, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      if (ids?.length === 0) {
        return res.status(200).json({
          status: RESPONSE_STATUS.SUCCESS,
          message: `Cập nhật người dùng thành công`,
        });
      }
      await userModel.updateMany({ _id: { $in: ids } }, { acceptPost: false });

      return res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        message: `Cập nhật người dùng thành công`,
      });
      //
    } catch (error) {
      next(error);
    }
  }

  async getUserBlockByFP(req: any, res: Response, next: NextFunction) {
    try {
      const {
        pageSize = 10,
        pageIndex = 1,
        startDate,
        endDate,
        status,
        sort,
        search,
      } = req.query;
      const searchObj = {} as any;

      // searchObj.roleOfUser = {
      //   $ne: '643e0df3b1245b360817b0a7',
      // };

      if (startDate && endDate) {
        searchObj.createdAt = { $gte: startDate, $lte: endDate };
      }

      if (search && search !== 'undefined') {
        const searchCondition = {
          $or: [
            { username: { $regex: `.*${search}.*`, $options: 'i' } },
            { email: { $regex: `.*${search}.*`, $options: 'i' } },
            { ip: { $regex: `.*${search}.*`, $options: 'i' } },
          ],
        };
        const listUserSearch = await userModel
          .find(searchCondition)
          .select('_id');
        const ids = listUserSearch?.map((item) => item?._id);
        searchObj.user = { $in: ids };
      }

      const [data, totalDocs] = await Promise.all([
        historyBlockAccountModel
          .find(searchObj)
          .skip((parseInt(pageIndex) - 1) * parseInt(pageSize))
          .limit(pageSize)
          .populate('user')
          .populate('listUserSame')
          .sort({ [sort]: -1 }),
        historyBlockAccountModel.countDocuments(searchObj),
      ]);

      return res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        message: `Lấy danh sách thành công`,
        data: data,
        totalDocs,
      });
      //
    } catch (error) {
      next(error);
    }
  }
  async deleteRecordBlockUser(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: RESPONSE_STATUS.FAILED,
          message: `Thiếu dữ liệu`,
        });
      }

      const data = await historyBlockAccountModel.deleteOne({ _id: id });

      return res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        message: `Xóa record thành công`,
        data: data,
      });
      //
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();

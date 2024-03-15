
//@ts-nocheck
import { NextFunction, Request, Response } from 'express';
import postModel from '../models/post.model';

import Joi from 'joi';

import useragent from 'useragent';
import { AuthRequest } from '../interfaces';
import {
  default as postReportedModel,
  default as reportPost,
} from '../models/postReported.model';
import userModel from '../models/user.model';
import { RESPONSE_STATUS } from '../utils';
import pointLogModel from '../models/pointLog.model';

import actionHistory from '../models/log.model';
import moment from 'moment';
import Message from '../models/message.model';
import {
  TEMPLATE_ACCEPT_POST,
  TEMPLATE_REJECT_POST,
  senLogToUser,
  sendLog,
  sendLogAcceptPost,
  sendLogCompletedPost,
  sendLogCompletedPostToUser,
  sendLogRejectPost,
} from '../helper/Bottelegram';
import { ObjectId } from 'mongodb';
import roleModel from '../models/role.model';
import brandModel from '../models/brand.model';
const addIndexPayment = async () => {
  const listPayment = await postModel.find();
  listPayment?.map(async (item, index) => {
    await postModel.updateOne({ _id: item?._id }, { stt: index + 1 });
  });
};
// addIndexPayment();
const addDays = (days: number): Date => {
  const result = moment();
  result.add(days, 'days');
  result.set({ hours: 23, minutes: 59, seconds: 59, milliseconds: 999 });
  return result;
};

class PostController {
  async createPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object({
        content: Joi.string().required().max(500).messages({
          'string.empty': 'Nội dung không được để trống',
          'string.max': 'Nội dung tối đa là 500 chữ',
        }),
        brand: Joi.string().required(),
      }).unknown(true);
      const validate = schema.validate(req.body);
      if (validate.error) {
        throw new Error(validate.error.message);
      }
      const agent = useragent.parse(req.headers['user-agent']);
      const browser = agent.toAgent();

      const {
        content,
        quantity,
        repeat,
        brand,
        dateCompleted,
        team,
        quantityTotal,
        quantityEveryDay,
      } = req.body;
      const user: any = await userModel
        .findById(req?.user?._id)
        .populate('roleOfUser');
      if (!user?.acceptPost && user?.roleOfUser?.name === 'user')
        return res.json({
          message: 'Người dùng không có quyền đăng bài!',
          status: RESPONSE_STATUS.FAILED,
          data: {},
        });

      if (
        !user?.telegramId &&
        !user?.telegram &&
        (req.get('host') === 'localhost:3000' ||
          req.get('host') === 'trafficseo.online')
      ) {
        return res.json({
          status: 0,
          message:
            'Bạn chưa cập nhật telegram. Vui lòng cập nhật telegram trong hồ sơ!',
        });
      }
      if (quantityTotal % quantityEveryDay !== 0) {
        return res.json({
          status: 0,
          message: 'Số lượng tổng phải chia hết cho số lượng mỗi ngày!',
        });
      }
      const count = await postModel
        .findOne({})
        .sort({ stt: -1 })
        .select('stt')
        .limit(1);
      let totalDay = parseInt(quantityTotal) / parseInt(quantityEveryDay);
      totalDay = Math.round(totalDay)-1;
      const endDate = addDays(totalDay);

      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const post: any = await postModel.create({
        content: content?.replace(/[D&\/\\,+()$~%'":*?<>{}]/g, ''),
        quantity,
        stt: (count?.stt || 0) + 1,
        browser: browser,
        userId: req?.user?._id,
        status: user?.roleOfUser?.name === 'leader' ? 1 : 0,
        brand,
        repeat,
        team: team || req?.user?.team,
        dateCompleted: new Date(dateCompleted),
        startDate: startDate,
        endDate: endDate,
        quantityTotalRemain: quantityTotal,
        quantityTotal,
        quantityEveryDay,
      });
      await post.populate('userId');
      const response = {
        message: 'Tạo bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: post,
      };
      //@ts-ignore
      _io.emit('createPost');
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async editPost(req: AuthRequest, res: Response, next: NextFunction) {
    const postId = req.params.id;
    const { quantityTotal, quantityEveryDay } = req.body;
    try {
      const schema = Joi.object({
        content: Joi.string().required().max(500).messages({
          'string.empty': 'Nội dung không được để trống',
          'string.max': 'Nội dung tối đa là 500 chữ',
        }),
        quantityTotal: Joi.number(),
        quantityEveryDay: Joi.number(),
        status: Joi.number(),
        dateCompleted: Joi.date(),
        brand: Joi.string().required(),
        team: Joi.string(),
      }).unknown(true);
      if (req.body?.content) {
        req.body.content = req?.body?.content?.replace(
          /[D&\/\\,+()$~%'":*?<>{}]/g,
          ''
        );
      }
      const validate = schema.validate(req.body);
      if (validate.error) {
        throw new Error(validate.error.message);
      }

      if (quantityTotal % quantityEveryDay !== 0) {
        return res.json({
          status: 0,
          message: 'Số lượng tổng phải chia hết cho số lượng mỗi ngày!',
        });
      }

      const UpdatePost = await postModel.findByIdAndUpdate(postId, req.body);
      const response = {
        message: 'Sửa bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: UpdatePost,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async editPostUser(req: AuthRequest, res: Response, next: NextFunction) {
    const postId = req.params.id;
    try {
      const schema = Joi.object({
        status: Joi.boolean(),
        brand: Joi.string().required(),
      }).unknown(true);
      const validate = schema.validate(req.body);
      if (validate.error) {
        throw new Error(validate.error.message);
      }
      const bodyUpdate = { ...req.body };

      if (
        parseInt(bodyUpdate.quantityTotal) %
          parseInt(bodyUpdate.quantityEveryDay) !==
        0
      ) {
        return res.json({
          status: 0,
          message: 'Số lượng tổng phải chia hết cho số lượng mỗi ngày!',
        });
      }

      const checkStatus = await postModel.findById(postId);
      if (
        checkStatus?.status === 2 ||
        checkStatus?.status === 3 ||
        checkStatus?.status === 6
      ) {
        if (bodyUpdate.status === true) {
          if (
            checkStatus?.userCompleted?.length >= checkStatus?.quantityEveryDay
          ) {
            bodyUpdate.status = 6;
          } else {
            bodyUpdate.status = 2;
          }
        } else {
          bodyUpdate.status = 3;
        }
      } else {
        delete bodyUpdate.status;
      }

      const UpdatePost = await postModel.findOneAndUpdate(
        { _id: postId, userId: req.user?._id },
        bodyUpdate
      );
      const response = {
        message: 'Sửa bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: UpdatePost,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async activeListPost(req: AuthRequest, res: Response, next: NextFunction) {
    const { ids } = req.body;
    try {
      const UpdatePost = await postModel.updateMany(
        { _id: { $in: ids } },
        { status: 2 }
      );
      const response = {
        message: 'Bật bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: UpdatePost,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async activeAllPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const UpdatePost = await postModel.updateMany(
        {},
        {
          status: 2,
        }
      );
      const response = {
        message: 'Bật tất cả các bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: UpdatePost,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async deletePostAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    const postId = req.params.id;
    try {
      const checkLog = await pointLogModel.countDocuments({ post: postId });
      if (checkLog !== 0)
        return res.json({
          status: -1,
          message:
            'Bài viết này đã có CTV hoàn thành nên không thể xóa. Hãy đổi trạng thái bài viết.',
        });
      const deletePost = await postModel.findByIdAndDelete(postId);
      const deletePostReport = await postReportedModel.findOneAndDelete({
        postId: postId,
      });
      const response = {
        message: 'Xóa bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: null,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async deleteMultiPostAdmin(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    const { postIds } = req.body;

    try {
      // const deletePost = await postModel.deleteMany({ _id: { $in: postIds } });
      // const deletePostReport = await postReportedModel.deleteMany({
      //   _id: { $in: postIds },
      // });
      const response = {
        message: 'Chức năng này không còn khả dụng.',
        status: RESPONSE_STATUS.SUCCESS,
        data: null,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async deletePost(req: AuthRequest, res: Response, next: NextFunction) {
    const postId = req.params.id;
    try {
      const checkLog = await pointLogModel.countDocuments({ post: postId });
      if (checkLog !== 0)
        return res.json({
          status: -1,
          message:
            'Bài viết này đã có CTV hoàn thành nên không thể xóa. Hãy đổi trạng thái bài viết.',
        });
      const deletePost = await postModel.findOneAndDelete({
        _id: postId,
        userId: req?.user?._id,
      });
      const deletePostReport = await postReportedModel.findOneAndDelete({
        postId: postId,
      });
      if (!deletePost) {
        const response = {
          message: 'Xóa bài viết thất bại',
          status: RESPONSE_STATUS.FAILED,
          data: null,
        };
        return res.status(400).json(response);
      }
      const response = {
        message: 'Xóa bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: null,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async getPagingPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      let pageSize: any = req.query.pageSize || 10;
      let pageIndex: any = req.query.pageIndex || 1;
      const searchPost: any = req.query.search || '';
      const agent = useragent.parse(req.headers['user-agent']);
      const findPostBlock = await userModel
        .findById(req?.user?._id)
        .populate('postIdBlock');

      if (pageSize === 'undefined') {
        pageSize = 10;
      }
      if (pageIndex === 'undefined') {
        pageIndex = 1;
      }
      const searchObj: any = {};
      if (searchPost) {
        searchObj.content = { $regex: searchPost, $options: 'i' };
      }
      //chỉ lấy các post có quantity >0
      // searchObj.quantity = { $gt: 0 };

      searchObj.createdAt = {
        $gt: new Date(2023, 9, 10, 0, 0, 0),
      };
      const skip = Number(pageSize) * Number(pageIndex) - Number(pageSize);
      const limit = pageSize;
      const postIdBlock: any = [];
      findPostBlock?.postIdBlock.forEach((item: any) => {
        postIdBlock.push(item._id);
      });

      const post = await postModel
        .find({
          _id: { $nin: postIdBlock },
          userCompleted: { $ne: req.user?._id },
          status: 2,
        })
        .find(searchObj)
        .skip(skip)
        .limit(limit)
        .populate('userId')
        .sort({ createdAt: 1 });

      const totalDoc = await postModel
        .find({
          _id: { $nin: postIdBlock },
          userCompleted: { $ne: req.user?._id },
          status: 2,
        })
        .find(searchObj)
        .countDocuments();
      const totalPages = Math.ceil(totalDoc / pageSize);

      const response = {
        message: 'Lấy danh sách bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: post,
        totalPages,
        totalDoc,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async getPagingPostPending(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      let pageSize: any = req.query.pageSize || 10;
      let pageIndex: any = req.query.pageIndex || 1;
      const searchPost: any = req.query.search || '';
      const stt: any = req.query.stt || '';
      const sort: any = req.query.sort || 'createdAt';
      const user: any = req.query.userId || '';
      const brand: any = req.query.brand || '';
      const team: any = req.query.team || '';
      if (pageSize === 'undefined') {
        pageSize = 10;
      }
      if (pageIndex === 'undefined') {
        pageIndex = 1;
      }
      const role = await roleModel.findById(req.user?.roleOfUser);

      const searchObj: any = { status: { $in: [0, 1] } };
      if (searchPost) {
        searchObj.content = { $regex: searchPost, $options: 'i' };
      }
      if (stt) {
        searchObj.stt = stt;
      }
      if (
        role?.name === 'troly' ||
        req.user?.email === 'sala@okvip.com' ||
        req.user?.email === 'yonna@okvip.com'
      ) {
        searchObj.status = 1;
      }
      const listBrand = await brandModel.find({
        name: { $in: ['OKVIP', 'BONGBET', 'MOCBAI'] },
      });
      const listIdBrand = listBrand?.map((item) => item?._id);
      if (role?.name === 'leader') {
        searchObj.status = 0;
        searchObj['$or'] = [{ brand: listIdBrand }, { team: req.user?.team }];
        // searchObj.team = { $in: req.user?.team };
      }
      if (user) {
        searchObj.userId = user;
      }
      if (brand && brand !== 'undefined') {
        searchObj.brand = brand;
      }
      if (team && team !== 'undefined') {
        searchObj.team = team;
      }
      searchObj.createdAt = {
        $gt: new Date(2023, 9, 10, 0, 0, 0),
      };
      const skip = Number(pageSize) * Number(pageIndex) - Number(pageSize);
      const limit = pageSize;

      const post = await postModel

        .find(searchObj)
        .skip(skip)
        .limit(limit)
        .populate('userId')
        .populate('brand')
        .populate('team')
        .sort({ [sort]: -1 });

      const totalDoc = await postModel.find(searchObj).countDocuments();
      const totalPages = Math.ceil(totalDoc / pageSize);

      const response = {
        message: 'Lấy danh sách bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: post,
        totalPages,
        totalDoc,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async getExcelPostPending(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      let pageSize: any = req.query.pageSize || 10;
      let pageIndex: any = req.query.pageIndex || 1;
      const searchPost: any = req.query.search || '';
      const stt: any = req.query.stt || '';
      const sort: any = req.query.sort || 'createdAt';
      const user: any = req.query.userId || '';
      const brand: any = req.query.brand || '';
      const team: any = req.query.team || '';
      if (pageSize === 'undefined') {
        pageSize = 10;
      }
      if (pageIndex === 'undefined') {
        pageIndex = 1;
      }
      const role = await roleModel.findById(req.user?.roleOfUser);

      const searchObj: any = { status: { $in: [0, 1] } };
      if (searchPost) {
        searchObj.content = { $regex: searchPost, $options: 'i' };
      }
      if (stt) {
        searchObj.stt = stt;
      }
      if (role?.name === 'troly') {
        searchObj.status = 1;
      }
      const listBrand = await brandModel.find({
        name: { $in: ['OKVIP', 'BONGBET', 'MOCBAI'] },
      });
      const listIdBrand = listBrand?.map((item) => item?._id);
      if (role?.name === 'leader') {
        searchObj.status = 0;
        searchObj['$or'] = [{ brand: listIdBrand }, { team: req.user?.team }];
        // searchObj.team = { $in: req.user?.team };
      }
      if (user) {
        searchObj.userId = user;
      }
      if (brand && brand !== 'undefined') {
        searchObj.brand = brand;
      }
      if (team && team !== 'undefined') {
        searchObj.team = team;
      }
      searchObj.createdAt = {
        $gt: new Date(2023, 9, 10, 0, 0, 0),
      };

      const post = await postModel

        .find(searchObj)

        .populate('userId')
        .populate('brand')
        .populate('team')
        .sort({ [sort]: -1 });

      const response = {
        message: 'Lấy danh sách bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: post,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async addUserRunning(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user: any = req?.user?._id || '';
      const id: any = req.params.id || '';
      if (!id || !user) {
        return res.json({ status: -1, message: 'id không phù hợp' });
      }
      const checkPost = await postModel.findById(id);
      if (!checkPost) {
        return res.json({ status: -1, message: 'Không có bài viết' });
      }
      if (checkPost?.running?.length >= Math.round(parseInt(checkPost?.quantityEveryDay)/5)) {
        return res.json({ status: -1, message: 'Đủ số lượng người đang chạy' });
      }
      const post = await postModel.updateOne(
        {
          _id: id,
        },
        {
          $addToSet: {
            running: user,
          },
        }
      );
      return res.json({ status: 1, message: 'Thêm vào thành công!' });
    } catch (err) {
      next(err);
    }
  }

  async pullAllPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user: any = req?.user?._id || '';
      if (!user) {
        return res.json({ status: -1, message: 'id không phù hợp' });
      }

      const post = await postModel.updateMany(
        {
          running: user,
        },
        {
          $pull: {
            running: user,
          },
        }
      );
      return res.json({ status: 1, message: 'Xóa thành công!' });
    } catch (err) {
      next(err);
    }
  }

  async getPagingPostForAdmin(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      let pageSize: any = req.query.pageSize || 10;
      let pageIndex: any = req.query.pageIndex || 1;
      const searchPost: any = req.query.search || '';
      const startDate: any = req.query.startDate || '';
      const endDate: any = req.query.endDate || '';
      const sort: string = req.query.sort || 'createdAt';
      let status: any = req.query.status;
      const brand: any = req.query.brand;
      const team: any = req.query.team;
      const stt: any = req.query.stt || '';
      const userId: any = req.query.userId || null;
      if (pageSize === 'undefined') {
        pageSize = 10;
      }
      if (pageIndex === 'undefined') {
        pageIndex = 1;
      }
      const searchObj: any = {};
      if (searchPost) {
        searchObj.content = { $regex: searchPost, $options: 'i' };
      }
      if (brand && brand !== 'undefined') {
        searchObj.brand = new ObjectId(brand);
      }
      if (team && team !== 'undefined') {
        searchObj.team = new ObjectId(team);
      }
      if (stt && stt !== 'undefined') {
        searchObj.stt = parseInt(stt);
      }
      if (userId && userId !== 'undefined')
        searchObj.userId = new ObjectId(userId);
      if (startDate && endDate) {
        const hoursEndDate = new Date(endDate);
        hoursEndDate.setHours(23, 59, 59, 999);
        searchObj.createdAt = {
          $gte: new Date(startDate),
          $lte: hoursEndDate,
        };
      }

      if (status !== '') {
        status = status?.split(',');
        status = status?.map((item) => parseInt(item));
        searchObj.status = { $in: status };
      }
      const role = await roleModel.findById(req.user?.roleOfUser);

      if (role?.name === 'leader') {
        searchObj.team = { $in: req.user?.team };
      }

      const skip = Number(pageSize) * Number(pageIndex) - Number(pageSize);
      const limit = pageSize;

      const [post, allPost] = await Promise.all([
        postModel.aggregate([
          {
            $match: searchObj,
          },
          {
            $project: {
              userCompleted: 1,
              content: 1,
              userId: 1,
              quantity: 1,
              quantityEveryDay: 1,
              quantityCurrent: 1,
              quantityTotal: 1,
              startDate: 1,endDate: 1,
              createdAt: 1,
              team: 1,
              stt: 1,
              dateCompleted: 1,
              repeat: 1,
              status: 1,
              brand: 1,
              note: 1,
              quantityAfterReset: 1,
              sizeUserCompleted: { $size: '$userCompleted' },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userId',
            },
          },
          {
            $lookup: {
              from: 'Brand',
              localField: 'brand',
              foreignField: '_id',
              as: 'brand',
            },
          },
          { $unwind: { path: '$userId', preserveNullAndEmptyArrays: true } },
          { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
          {
            $sort: {
              [sort === 'createdAt' ? 'createdAt' : 'sizeUserCompleted']: -1,
            },
          },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]),
        postModel
          .find(searchObj)
          .populate('userId')
          .sort({ [sort]: sort === 'createdAt' ? -1 : 1 })
          .lean(),
      ]).catch((err) => console.log(err));

      const listIds = allPost?.map((item) => item?._id);
      const [totalPointsPerPost, totalMoneyChi] = await Promise.all([
        pointLogModel.aggregate([
          {
            $match: {
              post: { $in: listIds },
              point: { $gt: 0 },
            },
          },
          {
            $group: {
              _id: '$post',
              totalPoints: { $sum: '$point' },
            },
          },
        ]),
        pointLogModel.aggregate([
          {
            $match: {
              post: { $in: listIds },
              point: { $gt: 0 },
            },
          },
          {
            $group: {
              _id: null,
              totalPoints: { $sum: '$point' },
            },
          },
        ]),
      ]);
      const convertToObj = {};
      totalPointsPerPost?.map(
        (item) => (convertToObj[item?._id?.toString()] = item?.totalPoints)
      );

      const resultPost = post?.map((item) => {
        const temp = { ...item };
        temp['totalMoney'] = convertToObj[item?._id?.toString()] || 0;
        return temp;
      });
      const totalDoc = await postModel.find(searchObj).countDocuments();
      const totalPages = Math.ceil(totalDoc / pageSize);

      const response = {
        message: 'Lấy danh sách bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: resultPost,
        totalMoneyChi: totalMoneyChi?.[0]?.totalPoints || 0,
        totalPages,
        totalDoc,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async getPagingPostForAdminExportExcel(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      let pageSize: any = req.query.pageSize || 10;
      let pageIndex: any = req.query.pageIndex || 1;
      const searchPost: any = req.query.search || '';
      const startDate: any = req.query.startDate || '';
      const endDate: any = req.query.endDate || '';
      const sort: string = req.query.sort || 'createdAt';
      let status: any = req.query.status;
      const brand: any = req.query.brand;
      const team: any = req.query.team;
      const stt: any = req.query.stt || '';
      if (pageSize === 'undefined') {
        pageSize = 10;
      }
      if (pageIndex === 'undefined') {
        pageIndex = 1;
      }
      const searchObj: any = {};
      if (searchPost) {
        searchObj.content = { $regex: searchPost, $options: 'i' };
      }
      if (startDate && endDate) {
        searchObj.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
      if (stt && stt !== 'undefined') {
        searchObj.stt = parseInt(stt);
      }
      if (brand && brand !== 'undefined') {
        searchObj.brand = new ObjectId(brand);
      }
      if (team && team !== 'undefined') {
        searchObj.team = new ObjectId(team);
      }
      if (status !== '') {
        status = status?.split(',');
        status = status?.map((item) => parseInt(item));
        searchObj.status = { $in: status };
      }
      const role = await roleModel.findById(req.user?.roleOfUser);

      if (role?.name === 'leader') {
        searchObj.team = { $in: req.user?.team };
      }

      const [post, allPost] = await Promise.all([
        postModel.aggregate([
          {
            $match: searchObj,
          },
          {
            $project: {
              userCompleted: 1,
              content: 1,
              userId: 1,
              quantity: 1,
              quantityEveryDay: 1,
              quantityCurrent: 1,
              quantityTotal: 1,
              startDate: 1,endDate: 1,
              createdAt: 1,
              team: 1,
              stt: 1,
              dateCompleted: 1,
              repeat: 1,
              quantityAfterReset: 1,
              brand: 1,
              status: 1,
              note: 1,
              sizeUserCompleted: { $size: '$userCompleted' },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userId',
            },
          },
          {
            $lookup: {
              from: 'Brand',
              localField: 'brand',
              foreignField: '_id',
              as: 'brand',
            },
          },
          { $unwind: '$userId' },
          { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
          {
            $sort: {
              [sort === 'createdAt' ? 'createdAt' : 'sizeUserCompleted']: -1,
            },
          },
        ]),
        postModel
          .find(searchObj)
          .populate('userId')

          .lean(),
      ]);

      const listIds = allPost?.map((item) => item?._id);
      const [totalPointsPerPost, totalMoneyChi] = await Promise.all([
        pointLogModel.aggregate([
          {
            $match: {
              post: { $in: listIds },
              point: { $gt: 0 },
            },
          },
          {
            $group: {
              _id: '$post',
              totalPoints: { $sum: '$point' },
            },
          },
        ]),
        pointLogModel.aggregate([
          {
            $match: {
              post: { $in: listIds },
              point: { $gt: 0 },
            },
          },
          {
            $group: {
              _id: null,
              totalPoints: { $sum: '$point' },
            },
          },
        ]),
      ]);
      const convertToObj = {};
      totalPointsPerPost?.map(
        (item) => (convertToObj[item?._id?.toString()] = item?.totalPoints)
      );
      const resultPost = post?.map((item) => {
        const temp = { ...item };
        temp['totalMoney'] = convertToObj[item?._id?.toString()] || 0;
        return temp;
      });

      const response = {
        message: 'Lấy danh sách bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: resultPost,
        totalMoneyChi: totalMoneyChi?.[0]?.totalPoints || 0,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async rejectPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object({
        note: Joi.string().required().messages({
          'string.empty': 'Lý do không được để trống',
        }),
      }).unknown(true);
      const validate = schema.validate(req.body);
      if (validate.error) {
        throw new Error(validate.error.message);
      }
      const { note } = req.body;
      const { id } = req.params;
      const post = await postModel.findById(id).populate('userId');
      if (!post) {
        return res.json({ status: -1, message: 'Bài viết không tồn tại!' });
      }
      const role = await roleModel.findById(req.user?.roleOfUser);
      if (role?.name === 'leader') {
        post.status = 4;
        post.note = note;
        post.save();
        _io.emit('createPost');

        sendLogRejectPost(
          post.content,
          req.user?.username,
          role?.name?.toUpperCase(),
          post.stt
        );
        if (post?.userId?.telegramId) {
          senLogToUser(
            post?.userId?.telegramId,
            TEMPLATE_REJECT_POST({
              stt: post.stt,
              content: post.content,
              user: req.user?.username,
              type: role?.name?.toUpperCase(),
            })
          );
        }
        return res.json({ status: 1, message: 'Từ chối bài viết thành công!' });
      }
      if (role?.name === 'troly') {
        post.status = 5;
        post.note = note;
        post.save();
        _io.emit('createPost');
        sendLogRejectPost(
          post.content,
          req.user?.username,
          'troly'?.toUpperCase(),
          post.stt
        );
        if (post?.userId?.telegramId) {
          senLogToUser(
            post?.userId?.telegramId,
            TEMPLATE_REJECT_POST({
              stt: post.stt,
              content: post.content,
              user: req.user?.username,
              type: 'troly'?.toUpperCase(),
            })
          );
        }
        return res.json({ status: 1, message: 'Từ chối bài viết thành công!' });
      }
      if (role?.name === 'superAdmin') {
        post.status = post.status === 0 ? 4 : 5;
        post.note = note;
        post.save();
        _io.emit('createPost');
        sendLogRejectPost(
          post.content,
          req.user?.username,
          role?.name?.toUpperCase(),
          post.stt
        );
        if (post?.userId?.telegramId) {
          senLogToUser(
            post?.userId?.telegramId,
            TEMPLATE_REJECT_POST({
              stt: post.stt,
              content: post.content,
              user: req.user?.username,
              type: role?.name?.toUpperCase(),
            })
          );
        }
        return res.json({ status: 1, message: 'Từ chối bài viết thành công!' });
      }
      return res.json({ status: -1, message: 'Bạn không có thẩm quyền!' });
    } catch (err) {
      next(err);
    }
  }
 async acceptPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const role = await roleModel.findById(req.user?.roleOfUser);
      const post = await postModel.findById(id);
      if (!post) {
        return res.json({ status: -1, message: 'Bài viết không tồn tại!' });
      }

      if (role?.name === 'leader') {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        let totalDay =
          parseInt(post.quantityTotal) / parseInt(post.quantityEveryDay);
        totalDay = Math.round(totalDay)-1;
        const endDate = addDays(totalDay);
        post.startDate = startDate;
        post.endDate = endDate;
        post.status = 1;
        post.save();
        _io.emit('createPost');
        sendLogAcceptPost(
          post.content,
          req.user?.username,
          role?.name?.toUpperCase(),
          post.stt
        );
        if (post?.userId?.telegramId) {
          senLogToUser(
            post?.userId?.telegramId,
            TEMPLATE_ACCEPT_POST({
              stt: post.stt,
              content: post.content,
              user: req.user?.username,
              type: role?.name?.toUpperCase(),
            })
          );
        }
        return res.json({ status: 1, message: 'Duyệt bài viết thành công!' });
      }
      if (role?.name === 'troly') {
            const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        let totalDay =
          parseInt(post.quantityTotal) / parseInt(post.quantityEveryDay);
        totalDay = Math.round(totalDay)-1;
        const endDate = addDays(totalDay);
        post.startDate = startDate;
        post.endDate = endDate;
        post.status = 2;
        post.save();
        _io.emit('createPost');
        sendLogAcceptPost(
          post.content,
          req.user?.username,
          'troly'?.toUpperCase(),
          post.stt
        );
        if (post?.userId?.telegramId) {
          senLogToUser(
            post?.userId?.telegramId,
            TEMPLATE_ACCEPT_POST({
              stt: post.stt,
              content: post.content,
              user: req.user?.username,
              type: 'troly'?.toUpperCase(),
            })
          );
        }
        return res.json({ status: 1, message: 'Duyệt bài viết thành công!' });
      }
      if (role?.name === 'superAdmin') {
        post.status = post.status === 0 ? 1 : 2;
        post.save();
        _io.emit('createPost');
        sendLogAcceptPost(
          post.content,
          req.user?.username,
          role?.name?.toUpperCase(),
          post.stt
        );
        if (post?.userId?.telegramId) {
          senLogToUser(
            post?.userId?.telegramId,
            TEMPLATE_ACCEPT_POST({
              stt: post.stt,
              content: post.content,
              user: req.user?.username,
              type: role?.name?.toUpperCase(),
            })
          );
        }
        return res.json({ status: 1, message: 'Duyệt bài viết thành công!' });
      }
    } catch (err) {
      next(err);
    }
  }
  async reportPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object({
        postId: Joi.required().messages({
          'string.empty': 'postId không được để trống',
        }),
        reason: Joi.string().required().messages({
          'string.empty': 'Lý do không được để trống',
        }),
      }).unknown(true);
      const validate = schema.validate(req.body);
      if (validate.error) {
        throw new Error(validate.error.message);
      }
      const { postId, reason } = req.body;
      const updateUserReport = await userModel.findByIdAndUpdate(
        req?.user?._id,
        {
          $addToSet: {
            postIdBlock: postId,
          },
        }
      );
      let post;
      const checkPostExisted = await reportPost.findOne({ postId: postId });
      if (!checkPostExisted) {
        post = await reportPost.create({
          postId,
          reason,
          userId: req?.user?._id,
          details: [
            {
              userId: req?.user?._id,
              reason: reason,
            },
          ],
        });
      } else {
        const findPostDetail = await reportPost.findById(checkPostExisted._id);
        let flag = true;
        findPostDetail?.details.forEach((item: any) => {
          if (item.userId.equals(req?.user?._id)) {
            flag = false;
          }
        });
        if (flag) {
          post = await reportPost.findByIdAndUpdate(checkPostExisted._id, {
            $addToSet: {
              details: {
                userId: req?.user?._id,
                reason: reason,
              },
            },
          });
        }
      }
      //@ts-nocheck
      // const recheckPost = await reportPost.findOne({ postId: postId });
      const [recheckPost, postcheck] = await Promise.all([
        reportPost.findOne({ postId: postId }),
        postModel.findById(postId),
      ]);
      if (recheckPost?.details?.length >= 3 && postcheck?.status === 2) {
        // await postModel.updateOne(
        //   { _id: postId },
        //   {
        //     isActive: false,
        //   }
        // );
      }
      //@ts-ignore
      _io.emit('createPost');
      const response = {
        message: 'Báo cáo bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: post,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async getReportPost(req: Request, res: Response, next: NextFunction) {
    try {
      const pageIndex = req.query.pageIndex || 1;
      const pageSize = req.query.pageSize || 10;
      const findReportPost = await reportPost

        .find({ createdAt: { $gte: new Date('2023/10/09') } })
        .skip(Number(pageSize) * Number(pageIndex) - Number(pageSize))
        .limit(Number(pageSize))
        .populate('postId')
        .populate('details.userId')
        .sort({ createdAt: -1 });
      const totalDoc = await reportPost
        .find({ createdAt: { $gte: new Date('2023/10/09') } })
        .countDocuments();
      const totalPages = Math.ceil(Number(totalDoc) / Number(pageSize));
      const response = {
        message: 'Lấy danh sách bài viết bị báo cáo thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: findReportPost,
        totalPages,
        totalDoc,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async getReportPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id || '';

      const [findReportPost, reportExtension] = await Promise.all([
        reportPost
          .find({ createdAt: { $gte: new Date('2023/10/09') } })
          .find({ postId: id })
          .populate('postId')
          .populate('details.userId')
          .sort({ createdAt: -1 }),
        postModel.findById(id).populate('reportExtensionUser', 'username'),
      ]);

      const response = {
        message: 'Lấy danh sách bài viết bị báo cáo thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: findReportPost,
        dataExtension: reportExtension.reportExtensionUser,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async reportExtension(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object({
        postId: Joi.required().messages({
          'string.empty': 'postId không được để trống',
        }),
      }).unknown(true);
      const validate = schema.validate(req.body);
      if (validate.error) {
        throw new Error(validate.error.message);
      }
      const { postId } = req.body;
      const updatePost = await postModel.findByIdAndUpdate(
        postId,
        { $addToSet: { reportExtensionUser: req.user?._id } },
        { new: true }
      );
      if (updatePost && updatePost?.reportExtensionUser?.length >= 20) {
        await postModel.findByIdAndUpdate(
          updatePost?._id,
          {
            status: 3,
          },
          {}
        );
        //@ts-ignore
        _io.emit('createPost');
      }
      const response = {
        message: 'Báo cáo bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: updatePost,
      };
      // await session.commitTransaction();
      // session.endSession();
      return res.status(200).json(response);
    } catch (err) {
      // await session.abortTransaction();
      // session.endSession();
      return next(err);
    }
  }
  async completedPost(req: AuthRequest, res: Response, next: NextFunction) {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
        const ipBlack=[]
        const blackEmail=["hoangluunghiayx97@gmail.com","hoangquangdanel87@gmail.com","nguyenthiensangah58@gmail.com","nguyenhoanvietth28@gmail.com","dangquangtuongae66@gmail.com","keoliet@gmail.com","k7860030@gmail.com","yonglee02121@gmail.com"]
        const ipUser=req.headers['x-forwarded-for']
        const firstIp=ipUser?.split(",")
        if(ipBlack?.includes(firstIp?.[0]?.trim())||blackEmail?.includes(req.user?.email))
         return res.json({
          status: RESPONSE_STATUS.FAILED,
          message: 'Trình duyệt không hợp lệ',
        });
      const toDay = moment().format('DD-MM-YYYY').toString();
      // xử lý chỉ cho call từ extention tránh call từ bên ngoài
      const user = await userModel.findOne({
        _id: req.user?._id,
        isActivated: true,
      });
      if (!user) {
        return res.status(200).json({
          message: 'Tài khoản đã bị khóa',
          status: RESPONSE_STATUS.FAILED,
        });
      }
      const userReferral = await userModel.findOne({
        referralCode: user?.refernalUser || 'khongcohemai',
      });
      const agent = useragent.parse(req.headers['user-agent']);

      const browser = agent.family;
      if (browser === 'Other') {
        return res.json({
          status: RESPONSE_STATUS.FAILED,
          message: 'Trình duyệt không hợp lệ',
        });
      }
      const { postId } = req.body;
      const checkRunning = await postModel.findOne({ running: req.user?._id,_id:postId });
      if (!checkRunning)
        return res.json({
          status: RESPONSE_STATUS.FAILED,
          message: 'Bạn chưa chạy nhiệm vụ',
        });
      const pullId = await postModel.updateOne(
        { _id: postId },
        {
          $pull: {
            running: req.user?._id,
          },
        }
      );
      const checkExist = await postModel.findOne({
        _id: postId,
        userCompleted: req.user?._id,
      });
      if (checkExist) {
        const response = {
          message: 'Người dùng này đã hoàn thành nhiệm vụ này trước đó.',
          status: RESPONSE_STATUS.FAILED,
        };
        res.status(400).json(response);
      } else {
        const updateUserCompleted = await postModel
          .findOne({ _id: postId })
          .populate('userId');

        if (updateUserCompleted) {
          if (
            updateUserCompleted?.userCompleted?.length +
              parseInt(updateUserCompleted?.quantityAfterReset) >=
            parseInt(updateUserCompleted?.quantityEveryDay) - 1
          ) {
            updateUserCompleted.status = 6;

            await updateUserCompleted.save();
            //@ts-ignore
            // _io.emit('createPost');
          }
          if (
            updateUserCompleted?.userCompleted?.length +
              parseInt(updateUserCompleted?.quantityAfterReset) ===
            parseInt(updateUserCompleted?.quantityEveryDay) - 1
          ) {
            sendLogCompletedPostToUser(
              updateUserCompleted?.content,
              updateUserCompleted?.userId?.telegramId,
              updateUserCompleted?.stt
            );
            sendLogCompletedPost(
              updateUserCompleted?.content,
              updateUserCompleted?.userId?.username,
              updateUserCompleted?.stt
            );
          }

        //   const author = await userModel
        //     .findOneAndUpdate(
        //       { _id: updateUserCompleted.userId._id },
        //       { $inc: { point: -500 } },
        //       {
        //         new: true,
        //       }
        //     )
        //     .populate('roleOfUser');

        //   await pointLogModel.create({
        //     user: author?._id,
        //     post: updateUserCompleted,
        //     userAgent: req.headers['user-agent'],
        //     origin: req.get('Origin'),
        //     point: -500,
        //     ip: req.headers['x-forwarded-for'] || '::1',
        //   });

          await userModel.findOneAndUpdate(
            { _id: req.user?._id },
            { $inc: { point: 500 } },
            {}
          );

          const recentPoint = await pointLogModel.findOne(
            { user: req.user?._id, point: 500 },
            {},
            { sort: { createdAt: -1 } }
          );

          const dateNow = moment().unix();

          const lastestPointFormNow =
            dateNow - moment(recentPoint?.createdAt).unix();

          sendLog(
            `Người dùng ${
              user.username
            } hoàn thành nhiệm vụ. Cách lần hoàn thành trước đó ${lastestPointFormNow} giây. IP: ${
              req.headers['x-forwarded-for'] || '::1'
            } `
          );

          await pointLogModel.create({
            user: req.user?._id,
            post: updateUserCompleted,
            userAgent: req.headers['user-agent'],
            origin: req.get('Origin'),
            point: 500,
            ip: req.headers['x-forwarded-for'] || '::1',
          });
          await postModel.findOneAndUpdate(
            { _id: postId },
            {
              $addToSet: {
                userCompleted: req.user?._id,
              },
            }
          );
          const quantityObject = updateUserCompleted?.quantityCurrent || {};
          quantityObject[toDay] = (quantityObject?.[toDay] || 0) + 1;
          await postModel.findOneAndUpdate(
            { _id: postId },
            {
              quantityCurrent: quantityObject,
              $inc: { quantityTotalRemain: -1 },
            }
          );
          sendLog(
            `Cộng điểm cho người dùng hoàn thành nhiệm vụ\n ${JSON.stringify(
              req.user
            )}`
          );
          await actionHistory.create({
            actionName: `Người dùng hoàn thành nhiệm vụ.`,
            requestDetail: `Người dùng ${user.username} hoàn thành nhiệm vụ. Cách lần hoàn thành trước đó ${lastestPointFormNow} giây`,
            ip: req.headers['x-forwarded-for'] || '::1',
            user: user._id,
          });

          if (!recentPoint || lastestPointFormNow >= 60) {
            if (userReferral) {
              // cộng 5 %
              await Promise.all([
                userModel.findOneAndUpdate(
                  { _id: userReferral?._id },
                  { $inc: { point: 25 } },
                  {}
                ),
                pointLogModel.create({
                  user: userReferral?._id,
                  post: updateUserCompleted,
                  userAgent: req.headers['user-agent'],
                  point: 25,
                  ip: req.headers['x-forwarded-for'] || '::1',
                }),
              ]);
              sendLog(
                `Cộng điểm cho người giới thiệu: 25đ \n${JSON.stringify(
                  userReferral
                )}`
              );
            }
          } else {
            user.isActivated = false;
            await user.save();

            await actionHistory.create({
              actionName: `Hệ thống tự động khóa tài khoản`,
              requestDetail: `Hệ thống tự động khóa tài khoản ${user?.username} do có hoạt động cộng điểm bất thường trong ${lastestPointFormNow} giây`,
              ip: req.headers['x-forwarded-for'] || '::1',
              user: user._id,
            });
            sendLog(
              `Hệ thống tự động khóa tài khoản ${user?.username} do phát hiện hành vi bất thường`
            );
            await Message.create({
              from: '648bea5ba0a124d3af0d83cc',
              content: `Hệ thống tự động khóa tài khoản <b>@${user?.username}</b> do phát hiện hành vi bất thường`,
            });
            return res.status(200).json({
              message: 'Tài khoản đã bị khóa ',
              status: RESPONSE_STATUS.FAILED,
            });
          }
        }
        const response = {
          message: 'Cộng điểm thành công cho người dùng',
          status: RESPONSE_STATUS.SUCCESS,
        };
        //@ts-ignore
        _io.emit('createPost');

        res.status(200).json(response);
      }
    } catch (err) {
      next(err);
    }
  }

  async getPagingPostForUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      let pageSize: any = req.query.pageSize || 10;
      let pageIndex: any = req.query.pageIndex || 1;
      const searchPost: any = req.query.search || '';
      let status: any = req.query.status || '';
      const startDate: any = req.query.startDate || '';
      const endDate: any = req.query.endDate || '';
      const sort: string = req.query.sort || 'createdAt';
      if (pageSize === 'undefined') {
        pageSize = 10;
      }
      if (pageIndex === 'undefined') {
        pageIndex = 1;
      }

      const searchObj: any = {
        userId: req.user?._id,
      };
      if (startDate && endDate) {
        const setStartDate = new Date(startDate);
        setStartDate.setHours(0, 0, 0, 0);
        const hoursEndDate = new Date(endDate);
        hoursEndDate.setHours(23, 59, 59, 999);
        searchObj.createdAt = {
          $gte: setStartDate,
          $lte: hoursEndDate,
        };
      }
      const setStartDate = new Date(startDate);
      setStartDate.setHours(0, 0, 0, 0);
      const hoursEndDate = new Date(endDate);
      hoursEndDate.setHours(23, 59, 59, 999);

      if (status !== '') {
        status = status?.split(',');
        status = status?.map((item) => parseInt(item));
        searchObj.status = { $in: status };
      }
      if (searchPost) {
        searchObj.content = { $regex: searchPost, $options: 'i' };
      }
      console.log(searchObj);
      const skip = Number(pageSize) * Number(pageIndex) - Number(pageSize);
      const limit = Number(pageSize);
      const [post, allPost, allPostNoCondition] = await Promise.all([
        postModel.aggregate([
          {
            $match: searchObj,
          },
          {
            $project: {
              userCompleted: 1,
              content: 1,
              userId: 1,
              quantityAfterReset: 1,
              quantity: 1,
              quantityEveryDay: 1,
              quantityCurrent: 1,
              quantityTotal: 1,
              startDate: 1,endDate: 1,
              createdAt: 1,
              team: 1,
              stt: 1,
              dateCompleted: 1,
              repeat: 1,
              status: 1,
              note: 1,
              brand: 1,
              sizeUserCompleted: { $size: '$userCompleted' },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userId',
            },
          },
          { $unwind: '$userId' },

          {
            $sort: {
              [sort === 'createdAt' ? 'createdAt' : 'sizeUserCompleted']: -1,
            },
          },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]),
        postModel.find(searchObj).select('_id').lean(),
        postModel.find({ userId: req.user?._id }).select('_id').lean(),
      ]);

      const listIds = allPost?.map((item) => item?._id);
      const listIdNoCondition = allPostNoCondition?.map((item) => item?._id);
      const [totalPointsPerPost, totalMoneyChi, totalMoneyByDay] =
        await Promise.all([
          pointLogModel.aggregate([
            {
              $match: {
                post: { $in: listIds },
                point: { $gt: 0 },
              },
            },
            {
              $group: {
                _id: '$post',
                totalPoints: { $sum: '$point' },
              },
            },
          ]),
          pointLogModel.aggregate([
            {
              $match: {
                post: { $in: listIds },
                point: { $gt: 0 },
              },
            },
            {
              $group: {
                _id: null,
                totalPoints: { $sum: '$point' },
              },
            },
          ]),
          pointLogModel.aggregate([
            {
              $match: {
                post: { $in: listIdNoCondition },
                point: { $gt: 0 },
                createdAt: {
                  $gte: setStartDate,
                  $lte: hoursEndDate,
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
        ]);
      const convertToObj = {};
      totalPointsPerPost?.map(
        (item) => (convertToObj[item?._id?.toString()] = item?.totalPoints)
      );
      const resultPost = post?.map((item) => {
        const temp = { ...item };
        temp['totalMoney'] = convertToObj[item?._id?.toString()] || 0;
        return temp;
      });
      const totalDoc = await postModel.find(searchObj).countDocuments();
      const totalPages = Math.ceil(totalDoc / pageSize);

      const response = {
        message: 'Lấy danh sách bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: resultPost,
        totalPages,
        totalDoc,
        totalMoneyChi: totalMoneyChi?.[0]?.totalPoints || 0,
        totalMoneyByDay: totalMoneyByDay?.[0]?.totalPoints || 0,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async getPagingPostForUserById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      let pageSize: any = req.query.pageSize || 10;
      let pageIndex: any = req.query.pageIndex || 1;
      const searchPost: any = req.query.search || '';
      let status: any = req.query.status || '';
      const startDate: any = req.query.startDate || '';
      const endDate: any = req.query.endDate || '';
      const id: any = req.params.id || '';
      const sort: string = req.query.sort || 'createdAt';
      const brand: any = req.query.brand || '';
      if (pageSize === 'undefined') {
        pageSize = 10;
      }
      if (pageIndex === 'undefined') {
        pageIndex = 1;
      }

      const searchObj: any = {
        userId: new ObjectId(id),
      };
      if (startDate && endDate) {
        searchObj.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      if (status !== '') {
        status = status?.split(',');
        status = status?.map((item) => parseInt(item));
        searchObj.status = { $in: status };
      }
      if (searchPost) {
        searchObj.content = { $regex: searchPost, $options: 'i' };
      }
      if (brand && brand !== 'undefined') {
        searchObj.brand = new ObjectId(brand);
      }

      const skip = Number(pageSize) * Number(pageIndex) - Number(pageSize);
      const limit = pageSize;

      const [post, allPost] = await Promise.all([
        postModel.aggregate([
          {
            $match: searchObj,
          },
          {
            $project: {
              userCompleted: 1,
              content: 1,
              userId: 1,
              quantityAfterReset: 1,
              quantity: 1,
              quantityEveryDay: 1,
              quantityCurrent: 1,
              quantityTotal: 1,
              startDate: 1,endDate: 1,
              createdAt: 1,
              team: 1,
              stt: 1,
              dateCompleted: 1,
              repeat: 1,
              status: 1,
              note: 1,
              brand: 1,
              sizeUserCompleted: { $size: '$userCompleted' },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userId',
            },
          },
          {
            $lookup: {
              from: 'Brand',
              localField: 'brand',
              foreignField: '_id',
              as: 'brand',
            },
          },
          { $unwind: '$userId' },
          { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },

          {
            $sort: {
              [sort === 'createdAt' ? 'createdAt' : 'sizeUserCompleted']: -1,
            },
          },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]),
        postModel
          .find(searchObj)
          .populate('userId')
          // .sort({ [sort]: sort === 'createdAt' ? -1 : 1 })
          .lean(),
      ]);

      const listIds = allPost?.map((item) => item?._id);
      const [totalPointsPerPost, totalMoneyChi] = await Promise.all([
        pointLogModel.aggregate([
          {
            $match: {
              post: { $in: listIds },
              point: { $gt: 0 },
            },
          },
          {
            $group: {
              _id: '$post',
              totalPoints: { $sum: '$point' },
            },
          },
        ]),
        pointLogModel.aggregate([
          {
            $match: {
              post: { $in: listIds },
              point: { $gt: 0 },
            },
          },
          {
            $group: {
              _id: null,
              totalPoints: { $sum: '$point' },
            },
          },
        ]),
      ]);
      const convertToObj = {};
      totalPointsPerPost?.map(
        (item) => (convertToObj[item?._id?.toString()] = item?.totalPoints)
      );
      const resultPost = post?.map((item) => {
        const temp = { ...item };
        temp['totalMoney'] = convertToObj[item?._id?.toString()] || 0;
        return temp;
      });
      const totalDoc = await postModel.find(searchObj).countDocuments();
      const totalPages = Math.ceil(totalDoc / pageSize);

      const response = {
        message: 'Lấy danh sách bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: resultPost,
        totalPages,
        totalDoc,
        totalMoneyChi: totalMoneyChi?.[0]?.totalPoints || 0,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async getPagingPostForUserExportExcel(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const searchPost: any = req.query.search || '';
      let status: any = req.query.status || '';
      const startDate: any = req.query.startDate || '';
      const endDate: any = req.query.endDate || '';
      const sort: string = req.query.sort || 'createdAt';
      const searchObj: any = {
        userId: req.user?._id,
      };
      if (startDate && endDate) {
        const setHourStartDate = new Date(startDate);
        setHourStartDate.setHours(0, 0, 0, 0);
        const setHourEndDate = new Date(endDate);
        setHourEndDate.setHours(23, 59, 59, 999);
        searchObj.createdAt = {
          $gte: setHourStartDate,
          $lte: setHourEndDate,
        };
      }
      if (status !== '') {
        status = status?.split(',');
        status = status?.map((item) => parseInt(item));
        searchObj.status = { $in: status };
      }
      if (searchPost) {
        searchObj.content = { $regex: searchPost, $options: 'i' };
      }

      const [post, allPost] = await Promise.all([
        postModel.aggregate([
          {
            $match: searchObj,
          },
          {
            $project: {
              userCompleted: 1,
              content: 1,
              userId: 1,
              quantity: 1,
              quantityEveryDay: 1,
              quantityCurrent: 1,
              quantityTotal: 1,
              startDate: 1,endDate: 1,
              createdAt: 1,
              team: 1,
              stt: 1,
              dateCompleted: 1,
              repeat: 1,
              quantityAfterReset: 1,
              status: 1,
              note: 1,
              sizeUserCompleted: { $size: '$userCompleted' },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userId',
            },
          },
          { $unwind: '$userId' },
          {
            $sort: {
              [sort === 'createdAt' ? 'createdAt' : 'sizeUserCompleted']: -1,
            },
          },
        ]),
        postModel
          .find(searchObj)
          .populate('userId')
          .sort({ [sort]: sort === 'createdAt' ? -1 : 1 })
          .lean(),
      ]);

      const listIds = allPost?.map((item) => item?._id);
      const totalPointsPerPost = await pointLogModel.aggregate([
        {
          $match: {
            post: { $in: listIds },
            point: { $gt: 0 },
          },
        },
        {
          $group: {
            _id: '$post',
            totalPoints: { $sum: '$point' },
          },
        },
      ]);
      const convertToObj = {};
      totalPointsPerPost?.map(
        (item) => (convertToObj[item?._id?.toString()] = item?.totalPoints)
      );
      const resultPost = post?.map((item) => {
        const temp = { ...item };
        temp['totalMoney'] = convertToObj[item?._id?.toString()] || 0;
        return temp;
      });

      const response = {
        message: 'Lấy danh sách bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: resultPost,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
async turnOffAllPost(req: AuthRequest, res: Response, next: NextFunction) {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
      const toDay = moment().format('DD-MM-YYYY').toString();
      // xử lý chỉ cho call từ extention tránh call từ bên ngoài
      const user = await userModel.findOne({
        _id: req.user?._id,
        isActivated: true,
      });
      if (!user) {
        return res.status(200).json({
          message: 'Tài khoản đã bị khóa',
          status: RESPONSE_STATUS.FAILED,
        });
      }
      const userReferral = await userModel.findOne({
        referralCode: user?.refernalUser || 'khongcohemai',
      });
      const agent = useragent.parse(req.headers['user-agent']);

      const browser = agent.family;
      if (browser === 'Other') {
        return res.json({
          status: RESPONSE_STATUS.FAILED,
          message: 'Trình duyệt không hợp lệ',
        });
      }
      const { postId } = req.body;
      const checkRunning = await postModel.findOne({ running: req.user?._id,_id:postId });
    
      const pullId = await postModel.updateOne(
        { _id: postId },
        {
          $pull: {
            running: req.user?._id,
          },
        }
      );
      const checkExist = await postModel.findOne({
        _id: postId,
        userCompleted: req.user?._id,
      });
      if (checkExist) {
        const response = {
          message: 'Người dùng này đã hoàn thành nhiệm vụ này trước đó.',
          status: RESPONSE_STATUS.FAILED,
        };
        res.status(400).json(response);
      } else {
        const updateUserCompleted = await postModel
          .findOne({ _id: postId })
          .populate('userId');

        if (updateUserCompleted) {
          if (
            updateUserCompleted?.userCompleted?.length +
              parseInt(updateUserCompleted?.quantityAfterReset) >=
            parseInt(updateUserCompleted?.quantityEveryDay) - 1
          ) {
            updateUserCompleted.status = 6;

            await updateUserCompleted.save();
            //@ts-ignore
            _io.emit('createPost');
          }
          if (
            updateUserCompleted?.userCompleted?.length +
              parseInt(updateUserCompleted?.quantityAfterReset) ===
            parseInt(updateUserCompleted?.quantityEveryDay) - 1
          ) {
            sendLogCompletedPostToUser(
              updateUserCompleted?.content,
              updateUserCompleted?.userId?.telegramId,
              updateUserCompleted?.stt
            );
            sendLogCompletedPost(
              updateUserCompleted?.content,
              updateUserCompleted?.userId?.username,
              updateUserCompleted?.stt
            );
          }

          const author = await userModel
            .findOneAndUpdate(
              { _id: updateUserCompleted.userId._id },
              { $inc: { point: -500 } },
              {
                new: true,
              }
            )
            .populate('roleOfUser');

          await pointLogModel.create({
            user: author?._id,
            post: updateUserCompleted,
            userAgent: req.headers['user-agent'],
            origin: req.get('Origin'),
            point: -500,
            ip: req.headers['x-forwarded-for'] || '::1',
          });

          await userModel.findOneAndUpdate(
            { _id: req.user?._id },
            { $inc: { point: 500 } },
            {}
          );

          const recentPoint = await pointLogModel.findOne(
            { user: req.user?._id, point: 500 },
            {},
            { sort: { createdAt: -1 } }
          );

          const dateNow = moment().unix();

          const lastestPointFormNow =
            dateNow - moment(recentPoint?.createdAt).unix();

          sendLog(
            `Người dùng ${
              user.username
            } hoàn thành nhiệm vụ. Cách lần hoàn thành trước đó ${lastestPointFormNow} giây. IP: ${
              req.headers['x-forwarded-for'] || '::1'
            } `
          );

          await pointLogModel.create({
            user: req.user?._id,
            post: updateUserCompleted,
            userAgent: req.headers['user-agent'],
            origin: req.get('Origin'),
            point: 500,
            ip: req.headers['x-forwarded-for'] || '::1',
          });
          await postModel.findOneAndUpdate(
            { _id: postId },
            {
              $addToSet: {
                userCompleted: req.user?._id,
              },
            }
          );
          const quantityObject = updateUserCompleted?.quantityCurrent || {};
          quantityObject[toDay] = (quantityObject?.[toDay] || 0) + 1;
          await postModel.findOneAndUpdate(
            { _id: postId },
            {
              quantityCurrent: quantityObject,
              $inc: { quantityTotalRemain: -1 },
            }
          );
          sendLog(
            `Cộng điểm cho người dùng hoàn thành nhiệm vụ\n ${JSON.stringify(
              req.user
            )}`
          );
          await actionHistory.create({
            actionName: `Người dùng hoàn thành nhiệm vụ.`,
            requestDetail: `Người dùng ${user.username} hoàn thành nhiệm vụ. Cách lần hoàn thành trước đó ${lastestPointFormNow} giây`,
            ip: req.headers['x-forwarded-for'] || '::1',
            user: user._id,
          });

          if (!recentPoint || lastestPointFormNow >= 60) {
            if (userReferral) {
              // cộng 5 %
              await Promise.all([
                userModel.findOneAndUpdate(
                  { _id: userReferral?._id },
                  { $inc: { point: 25 } },
                  {}
                ),
                pointLogModel.create({
                  user: userReferral?._id,
                  post: updateUserCompleted,
                  userAgent: req.headers['user-agent'],
                  point: 25,
                  ip: req.headers['x-forwarded-for'] || '::1',
                }),
              ]);
              sendLog(
                `Cộng điểm cho người giới thiệu: 25đ \n${JSON.stringify(
                  userReferral
                )}`
              );
            }
          } else {
            user.isActivated = false;
            await user.save();

            await actionHistory.create({
              actionName: `Hệ thống tự động khóa tài khoản`,
              requestDetail: `Hệ thống tự động khóa tài khoản ${user?.username} do có hoạt động cộng điểm bất thường trong ${lastestPointFormNow} giây`,
              ip: req.headers['x-forwarded-for'] || '::1',
              user: user._id,
            });
            sendLog(
              `Hệ thống tự động khóa tài khoản ${user?.username} do phát hiện hành vi bất thường`
            );
            await Message.create({
              from: '648bea5ba0a124d3af0d83cc',
              content: `Hệ thống tự động khóa tài khoản <b>@${user?.username}</b> do phát hiện hành vi bất thường`,
            });
            return res.status(200).json({
              message: 'Tài khoản đã bị khóa ',
              status: RESPONSE_STATUS.FAILED,
            });
          }
        }
        const response = {
          message: 'Cộng điểm thành công cho người dùng',
          status: RESPONSE_STATUS.SUCCESS,
        };
        //@ts-ignore
        _io.emit('createPost');

        res.status(200).json(response);
      }
    } catch (err) {
      next(err);
    }
  }
  async getPagingPostForUserExportExcelById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id: any = req.params.id || '';
      const searchPost: any = req.query.search || '';
      let status: any = req.query.status || '';
      const startDate: any = req.query.startDate || '';
      const endDate: any = req.query.endDate || '';
      const sort: string = req.query.sort || 'createdAt';
      const brand: any = req.query.brand || '';
      const searchObj: any = {
        userId: new ObjectId(id),
      };
      if (!id)
        return res.status(400).json({ status: -1, message: 'Không có id' });
      if (startDate && endDate) {
        searchObj.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
      if (status !== '') {
        status = status?.split(',');
        status = status?.map((item) => parseInt(item));
        searchObj.status = { $in: status };
      }
      if (searchPost) {
        searchObj.content = { $regex: searchPost, $options: 'i' };
      }
      if (brand && brand !== 'undefined') {
        searchObj.brand = new ObjectId(brand);
      }

      const [post, allPost] = await Promise.all([
        postModel.aggregate([
          {
            $match: searchObj,
          },
          {
            $project: {
              userCompleted: 1,
              content: 1,
              userId: 1,
              quantity: 1,
              quantityEveryDay: 1,
              quantityCurrent: 1,
              quantityTotal: 1,
              startDate: 1,endDate: 1,
              createdAt: 1,
              team: 1,
              stt: 1,
              dateCompleted: 1,
              repeat: 1,
              quantityAfterReset: 1,
              status: 1,
              note: 1,
              brand: 1,
              sizeUserCompleted: { $size: '$userCompleted' },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userId',
            },
          },
          {
            $lookup: {
              from: 'Brand',
              localField: 'brand',
              foreignField: '_id',
              as: 'brand',
            },
          },
          { $unwind: '$userId' },
          { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
          {
            $sort: {
              [sort === 'createdAt' ? 'createdAt' : 'sizeUserCompleted']: -1,
            },
          },
        ]),
        postModel
          .find(searchObj)
          .populate('userId')
          .sort({ [sort]: sort === 'createdAt' ? -1 : 1 })
          .lean(),
      ]);

      const listIds = allPost?.map((item) => item?._id);
      const totalPointsPerPost = await pointLogModel.aggregate([
        {
          $match: {
            post: { $in: listIds },
            point: { $gt: 0 },
          },
        },
        {
          $group: {
            _id: '$post',
            totalPoints: { $sum: '$point' },
          },
        },
      ]);
      const convertToObj = {};
      totalPointsPerPost?.map(
        (item) => (convertToObj[item?._id?.toString()] = item?.totalPoints)
      );
      const resultPost = post?.map((item) => {
        const temp = { ...item };
        temp['totalMoney'] = convertToObj[item?._id?.toString()] || 0;
        return temp;
      });

      const response = {
        message: 'Lấy danh sách bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: resultPost,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  async deleteMultiPostUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    const { postIds } = req.body;

    try {
      const deletePost = await postModel.deleteMany({
        _id: { $in: postIds },
        userId: req.user?._id,
      });
      const deletePostReport = await postReportedModel.deleteMany({
        _id: { $in: postIds },
      });
      const response = {
        message: 'Xóa bài viết thành công',
        status: RESPONSE_STATUS.SUCCESS,
        data: null,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async exportTrafficByPostId(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;

    try {
      const data = await pointLogModel
        .find({ post: id, point: { $gte: 200 } })
        .populate('user', 'username');
      return res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
}
export default new PostController();


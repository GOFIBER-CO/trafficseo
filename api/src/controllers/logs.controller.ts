//@ts-nocheck
import { NextFunction, Request, Response } from 'express';
import actionHistoryModel from '../models/log.model';
import { responseModel } from '../helper/responseModel';
import { RESPONSE_STATUS } from '../utils';
import userModel from '../models/user.model';
import roleModel from '../models/role.model';
import { AuthRequest } from '../interfaces';
import pointLogModel from '../models/pointLog.model';
import PaymentModel from '../models/payment.model';
import { ObjectId } from 'mongodb';
import teamModel from '../models/team.model';

class LogController {
  async getPagingLog(req: Request, res: Response, next: NextFunction) {
    try {
      // const { startTime, endTime } = req.query
      const { user }: any = req.query;
      let date: any = req.query?.date;
      date = date?.split(',') || [];

      const pageSize = Number(req.query.pageSize) || 10;
      const pageIndex = Number(req.query.pageIndex) || 1;
      // eslint-disable-next-line prefer-const
      let searchModel: any = {};
      // const date = []
      // date.push(startTime)
      // date.push(endTime)

      if (
        date?.[0] &&
        date?.[1] &&
        date?.[0] != 'undefined' &&
        date?.[1] != 'undefined'
      ) {
        const dateFrom = new Date(date[0] as any);

        const startDate = new Date(
          dateFrom.getFullYear(),
          dateFrom.getMonth(),
          dateFrom.getDate(),
          0,
          0,
          0
        );

        const dateTo = new Date(date[1] as any);
        const endDate = new Date(
          dateTo.getFullYear(),
          dateTo.getMonth(),
          dateTo.getDate(),
          23,
          59,
          59
        );
        searchModel['createdAt'] = { $gte: startDate, $lte: endDate };
      }

      const getAdminRole = await roleModel.findOne({ name: 'admin' });

      const admin = await userModel.findOne({
        role: getAdminRole?._id || getAdminRole?.id,
      });
      if (user) {
        searchModel['user'] = user;
      }

      const result = await actionHistoryModel
        .find(searchModel)
        .populate('user')
        .skip(pageSize * pageIndex - pageSize)
        .limit(pageSize)
        .sort({ createdAt: 'descending' });
      const totalDoc = await actionHistoryModel
        .find(searchModel)
        .countDocuments();

      const totalPages = Math.ceil(totalDoc / pageSize);
      const response = responseModel({
        message: 'Lấy thông tin lịch sử thành công',
        status: RESPONSE_STATUS.SUCCESS,
        result: {
          totalDoc: totalDoc,
          totalPages: totalPages,
          data: result,
        },
      });

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getPagingPointLog(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // const { startTime, endTime } = req.query
      const { user }: any = req;

      const searchModel: any = {};
      if (req.get('origin') === 'https://trafficseo.online') {
        searchModel['createdAt'] = { $gte: new Date(2023, 9, 9, 0, 0, 0) };
      }
      let date: any = req.query?.date;
      date = date?.split(',') || [];

      const pageSize = Number(req.query.pageSize) || 10;
      const pageIndex = Number(req.query.pageIndex) || 1;
      // eslint-disable-next-line prefer-const

      // const date = []
      // date.push(startTime)
      // date.push(endTime)

      if (
        date?.[0] &&
        date?.[1] &&
        date?.[0] != 'undefined' &&
        date?.[1] != 'undefined'
      ) {
        const dateFrom = new Date(date[0] as any);

        const startDate = new Date(
          dateFrom.getFullYear(),
          dateFrom.getMonth(),
          dateFrom.getDate(),
          0,
          0,
          0
        );

        const dateTo = new Date(date[1] as any);
        const endDate = new Date(
          dateTo.getFullYear(),
          dateTo.getMonth(),
          dateTo.getDate(),
          23,
          59,
          59
        );
        searchModel['createdAt'] = { $gte: startDate, $lte: endDate };
      }

      if (user) {
        searchModel['user'] = user;
      }

      const result = await pointLogModel
        .find(searchModel)
        .populate('user')
        .populate('post')
        .skip(pageSize * pageIndex - pageSize)
        .limit(pageSize)
        .sort({ createdAt: 'descending' });
      const totalDoc = await pointLogModel.find(searchModel).countDocuments();

      const totalPages = Math.ceil(totalDoc / pageSize);
      const response = {
        message: 'Lấy thông tin lịch sử điểm thành công',
        status: RESPONSE_STATUS.SUCCESS,
        totalDoc: totalDoc,
        totalPages: totalPages,
        data: result,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async getPagingPointLogAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { user }: any = req.query;
      let date: any = req.query?.date;
      date = date?.split(',') || [];
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
      const pageSize = Number(req.query.pageSize) || 10;
      const pageIndex = Number(req.query.pageIndex) || 1;
      // eslint-disable-next-line prefer-const
      let searchModel: any = {};
      // const date = []
      // date.push(startTime)
      // date.push(endTime)

      if (
        date?.[0] &&
        date?.[1] &&
        date?.[0] != 'undefined' &&
        date?.[1] != 'undefined'
      ) {
        const dateFrom = new Date(date[0] as any);

        const startDate = new Date(
          dateFrom.getFullYear(),
          dateFrom.getMonth(),
          dateFrom.getDate(),
          0,
          0,
          0
        );

        const dateTo = new Date(date[1] as any);
        const endDate = new Date(
          dateTo.getFullYear(),
          dateTo.getMonth(),
          dateTo.getDate(),
          23,
          59,
          59
        );
        searchModel['createdAt'] = { $gte: startDate, $lte: endDate };
      }

      if (user) {
        searchModel['user'] = new ObjectId(user);
      }
      if (
        startDate &&
        endDate &&
        endDate !== 'undefined' &&
        startDate !== 'undefined'
      ) {
        searchModel['createdAt'] = { $gte: startDate, $lte: endDate };
      }

      const [result, totalDoc, allTeam] = await Promise.all([
        pointLogModel.aggregate([
          {
            $match: { ...searchModel },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: {
              path: '$user',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'posts',
              localField: 'post',
              foreignField: '_id',
              as: 'post',
              pipeline: [
                {
                  $lookup: {
                    from: 'Brand',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brand',
                  },
                },
                {
                  $unwind: {
                    path: '$brand',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                  },
                },
                {
                  $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$post',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              point: 1,
              ip: 1,
              'user.username': 1,
              'post.content': 1,
              'post.brand': 1,
              'post.user': 1,
              createdAt: 1,
              'post.team': 1,
            },
          },
          {
            $skip: parseInt(pageSize * pageIndex - pageSize),
          },
          { $limit: parseInt(pageSize) },
        ]),
        pointLogModel.find(searchModel).countDocuments(),
        teamModel.find(),
      ]);
      const teamObject = {};
      allTeam?.map((item) => (teamObject[item?._id] = item.name));

      const resultTemp = result?.map((item) => {
        item.post?.user?.team =
          teamObject[
          item.post?.user?.team?.length>=2
                 
              ? item.post?.team
              : item.post?.user?.team
          ];
        return item;
      });
      const totalPages = Math.ceil(totalDoc / pageSize);
      const response = {
        message: 'Lấy thông tin lịch sử điểm thành công',
        status: RESPONSE_STATUS.SUCCESS,
        totalDoc: totalDoc,
        totalPages: totalPages,
        data: resultTemp,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getPagingPointLogAdminMiddle2Payment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { user }: any = req.query;

      const pageSize = Number(req.query.pageSize) || 10;
      const pageIndex = Number(req.query.pageIndex) || 1;
      const id: any = req.query.id;
      const paymentCheck = await PaymentModel.findById(id);

      // eslint-disable-next-line prefer-const
      let searchModel: any = {};

      if (user) {
        searchModel['user'] = new ObjectId(user);
      }
      const twoPayment = await PaymentModel.find({
        user: user,
        status: { $in: ['completed', 'pending'] },
        createdAt: { $lte: paymentCheck?.createdAt },
      })
        .sort({ createdAt: -1 })
        .limit(2);
      if (twoPayment && twoPayment?.length === 1) {
        //@ts-ignore
        searchModel['createdAt'] = {
          $lte: new Date(twoPayment?.[0]?.createdAt),
        };
      } else if (twoPayment && twoPayment?.length === 2) {
        searchModel['createdAt'] = {
          //@ts-ignore
          $gte: new Date(twoPayment?.[1]?.createdAt),
          //@ts-ignore
          $lte: new Date(twoPayment?.[0]?.createdAt),
        };
      }

      const [dataPoint, result, totalDoc, allTeam] = await Promise.all([
        pointLogModel.aggregate([
          {
            $match: {
              ...searchModel,
              point: { $gte: 0 },
            },
          },
          {
            $group: {
              _id: '$post',
              totalPoint: { $sum: '$point' },
            },
          },
          {
            $lookup: {
              from: 'posts',
              localField: '_id',
              foreignField: '_id',
              as: 'post',
              pipeline: [
                {
                  $lookup: {
                    from: 'Brand',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brand',
                  },
                },
                {
                  $unwind: {
                    path: '$brand',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                  },
                },
                {
                  $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$post',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              totalPoint: 1,
              'post.brand': 1,
              'post.user': 1,
              'post.team': 1,
            },
          },
        ]),
        pointLogModel.aggregate([
          {
            $match: { ...searchModel },
          },
          {
            $lookup: {
              from: 'posts',
              localField: 'post',
              foreignField: '_id',
              as: 'post',
              pipeline: [
                {
                  $lookup: {
                    from: 'Brand',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brand',
                  },
                },
                {
                  $unwind: {
                    path: '$brand',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                  },
                },
                {
                  $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$post',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              point: 1,
              ip: 1,
              'post.content': 1,
              'post.brand': 1,
              'post.user': 1,
              'post.team': 1,
              createdAt: 1,
            },
          },
        ]),

        // pointLogModel
        //   .find(searchModel)
        //   .populate('user', 'username')
        //   .populate('post', 'content userId')
        //   .skip(pageSize * pageIndex - pageSize)
        //   .limit(pageSize)
        //   .sort({ createdAt: 'descending' }),
        pointLogModel.find(searchModel).countDocuments(),
        teamModel.find(),
      ]);

      const teamObject = {};
      allTeam?.map((item) => (teamObject[item?._id] = item.name));
      const moneyByUserBrand = {};
      const moneyByTeam = {};
      dataPoint?.map((item) => {
        moneyByUserBrand[
          teamObject[
            item.post?.user?.team?.length>=2
              ? item.post?.team
              : item.post?.user?.team
          ]
        ] = {
          ...moneyByUserBrand[
            teamObject[
              item.post?.user?.team?.length>=2
                ? item.post?.team
                : item.post?.user?.team
            ]
          ],
          [item?.post?.brand?.name]:
            (moneyByUserBrand[
              teamObject[
               item.post?.user?.team?.length>=2
                  ? item.post?.team
                  : item.post?.user?.team
              ]
            ]?.[item?.post?.brand?.name] || 0) + item?.totalPoint,
        };
      });
      const resultTemp = result?.map((item) => {
        item.post?.user?.team = teamObject[item.post?.user?.team?.length>=2
                  ? item.post?.team
                  : item.post?.user?.team];
        return item;
      });
      const totalPages = Math.ceil(totalDoc / pageSize);
      const response = {
        message: 'Lấy thông tin lịch sử điểm thành công',
        status: RESPONSE_STATUS.SUCCESS,
        totalDoc: totalDoc,
        totalPages: totalPages,
        data: resultTemp,
        payment: twoPayment,
        moneyByUserBrand,
        moneyByTeam,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getPagingPointLogAdminMiddle2PaymentExcel(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { user }: any = req.query;
      const id: any = req.query.id;
      const paymentCheck = await PaymentModel.findById(id);
      // eslint-disable-next-line prefer-const
      let searchModel: any = {};

      if (user) {
        searchModel['user'] = new ObjectId(user);
      }
      const twoPayment = await PaymentModel.find({
        user: user,
        status: { $in: ['completed', 'pending'] },
        createdAt: { $lte: paymentCheck?.createdAt },
      })
        .sort({ createdAt: -1 })
        .limit(2);
      if (twoPayment && twoPayment?.length === 1) {
        //@ts-ignore
        searchModel['createdAt'] = {
          $lte: new Date(twoPayment?.[0]?.createdAt),
        };
      } else if (twoPayment && twoPayment?.length === 2) {
        searchModel['createdAt'] = {
          //@ts-ignore
          $gte: new Date(twoPayment?.[1]?.createdAt),
          //@ts-ignore
          $lte: new Date(twoPayment?.[0]?.createdAt),
        };
      }

      const [result, totalDoc, allTeam] = await Promise.all([
        pointLogModel.aggregate([
          {
            $match: { ...searchModel },
          },
          {
            $lookup: {
              from: 'posts',
              localField: 'post',
              foreignField: '_id',
              as: 'post',
              pipeline: [
                {
                  $lookup: {
                    from: 'Brand',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brand',
                  },
                },
                {
                  $unwind: {
                    path: '$brand',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                  },
                },
                {
                  $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$post',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              point: 1,
              ip: 1,
              'post.content': 1,
              'post.brand': 1,
              'post.user': 1,
              'post.team': 1,
              createdAt: 1,
            },
          },
        ]),
        pointLogModel.find(searchModel).countDocuments(),
        teamModel.find(),
      ]);
      const teamObject = {};
      allTeam?.map((item) => (teamObject[item?._id] = item.name));
      const resultTemp = result?.map((item) => {
        item.post?.user?.team =
          teamObject[
            item.post?.user?.team?.length>=2
                 
              ? item.post?.team
              : item.post?.user?.team
          ];
        return item;
      });
      const response = {
        message: 'Lấy thông tin lịch sử điểm thành công',
        status: RESPONSE_STATUS.SUCCESS,
        totalDoc: totalDoc,

        data: resultTemp,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getTopUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      const tempStartDate = new Date(startDate);
      tempStartDate.setHours(0, 0, 0, 0);

      const tempEndDate = new Date(endDate);
      tempEndDate.setHours(23, 59, 59, 999);
      const pipeline = [
        {
          $match: {
            createdAt: {
              $gte: tempStartDate,
              $lte: tempEndDate,
            },
            point: {
              $gte: 100,
            },
          },
        },
        {
          $group: {
            _id: '$user',
            totalPosts: { $sum: 1 }, // Đếm số bài viết
          },
        },
        {
          $sort: { totalPosts: -1 },
        },
        {
          $limit: 10,
        },
        {
          $lookup: {
            from: 'users', // Tên bảng (collection) người dùng
            localField: '_id', // Trường trong tài liệu PointLog
            foreignField: '_id', // Trường trong tài liệu người dùng
            as: 'user',
          },
        },
        {
          $project: {
            totalPosts: 1,
            username: { $arrayElemAt: ['$user.username', 0] }, // Lấy trường 'username' từ mảng 'user'
            email: { $arrayElemAt: ['$user.email', 0] },
          },
        },
      ];
      const data = await pointLogModel.aggregate(pipeline);

      return res.json({ data: data });
    } catch (error) {
      next(error);
    }
  }
}

export default new LogController();

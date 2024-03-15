//@ts-nocheck
import { ChatRequest } from './../interfaces/index';
import { Request, Response } from 'express';
import Payment from '../models/payment.model';
import InfoPayment from '../models/infoPayment.model';
import { RESPONSE_STATUS } from '../utils';
import mongoose from 'mongoose';
import userModel from '../models/user.model';
import moment from 'moment';
import quantityMaxPaymentModel from '../models/quantityMaxPayment.model';
import {
  TEMPLATE_REJECT_PAYMENT,
  TEMPLATE_SUCCESS_PAYMENT,
  senLogToUser,
  sendLogPayment,
} from '../helper/Bottelegram';
import pointLogModel from '../models/pointLog.model';
import { ObjectId } from 'mongodb';
import postModel from '../models/post.model';
import teamModel from '../models/team.model';
const addIndexPayment = async () => {
  const listPayment = await Payment.find().sort({ createdAt: 1 });
  listPayment?.map(async (item, index) => {
    await Payment.updateOne({ _id: item?._id }, { stt: index + 1 });
  });
};
// addIndexPayment();

export const createPayment = async (req: ChatRequest, res: Response) => {
  try {
    const { points, amount, infoPaymentId } = req.body;
    if (points < 100000) {
      return res.json({
        status: 0,
        message: 'Chưa đạt số tiền tối thiểu 100,000!',
      });
    }
    const infoPayment = await InfoPayment.findOne({
      _id: infoPaymentId,
      user: req.user?._id,
    });
    if (!infoPayment) {
      return res
        .status(404)
        .json({ status: 0, message: 'InfoPayment not found' });
    }
    const startWeek = moment().startOf('isoWeek').toISOString();
    const endWeek = moment().endOf('isoWeek').toISOString();
    const getMaxPayment = await quantityMaxPaymentModel.findOne({});
    const checkPaymentIsWeek = await Payment.countDocuments({
      user: req.user?._id,
      createdAt: { $gte: startWeek, $lte: endWeek },
    });

    if (getMaxPayment && checkPaymentIsWeek >= (getMaxPayment.quantity || 1)) {
      return res.json({ message: 'Tuần này bạn đã tạo thanh toán!' });
    }
    const countPaymentPending = await Payment.countDocuments({
      user: req.user?._id,
      status: 'pending',
    });
    if (countPaymentPending > 0) {
      return res.json({ status: -1, message: 'Còn yêu cầu đang được xử lý!' });
    }
    const userPoint = await userModel.findById(req.user?._id);
    if (!userPoint?.telegram) {
      return res.json({
        status: 0,
        message:
          'Bạn chưa cập nhật telegram. Vui lòng cập nhật telegram trong hồ sơ!',
      });
    }
    if (!userPoint?.telegramId) {
      return res.json({
        status: 0,
        message:
          'Bạn chưa cập nhật telegramId. Vui lòng cập nhật telegramId trong hồ sơ!',
      });
    }
    const getMaxIndex = await Payment.findOne().sort({ stt: -1 }).select('stt');
    const payment = new Payment({
      stt: (getMaxIndex?.stt || 0) + 1,
      user: req.user?._id,
      points: userPoint?.point,
      amount: userPoint?.point,
      infoPayment: infoPayment,
      status: 'pending',
    });
    await payment.save();
    await userModel.findByIdAndUpdate(req.user?._id, {
      $inc: { point: -Number(userPoint?.point) },
    });

    //@ts-ignore
    _io.emit('newPayment');
    res
      .status(201)
      .json({ status: 1, message: 'Payment created successfully', payment });
    sendLogPayment(
      `Người dùng ${
        req.user?.username
      } vừa tạo yêu cầu thanh toán với số tiền ${new Intl.NumberFormat().format(
        amount
      )} VNĐ`
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' ,error});
  }
};

// Lấy danh sách các giao dịch thanh toán
export const getPayments = async (req: ChatRequest, res: Response) => {
  try {
    const pageSize = req.query.pageSize || 10;
    const pageIndex = req.query.pageIndex || 1;
    const status = req.query.status;

    const searchCondition: any = {};
    if (status) {
      searchCondition.status = status;
    }
    searchCondition.user = req.user?._id;
    // if (req?.user) {
    //   searchCondition;
    // }
    const payments = await Payment.find(searchCondition)
      .limit(Number(pageSize))
      .skip((Number(pageIndex) - 1) * Number(pageSize))

      .sort({
        createdAt: -1,
      });
    const countDocuments = await Payment.countDocuments(searchCondition);
    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: payments,
      totalDocs: countDocuments,
      totalPages: Math.ceil(countDocuments / Number(pageSize)),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPaymentsAdmin = async (req: ChatRequest, res: Response) => {
  try {
    const {
      pageSize = 10,
      pageIndex = 1,
      sort = 'createdAt',
      status = null,
      startDate,
      endDate,
      stt,
    } = req.query;
    const searchCondition: any = {};
    if (status) searchCondition.status = status;
    if (startDate && endDate) {
      searchCondition.createdAt = { $gte: startDate, $lte: endDate };
    }
    if (req.query?.user) {
      searchCondition.user = req.query?.user;
    }
    if (stt) {
      searchCondition.stt = stt;
    }
    const payments = await Payment.find(searchCondition)
      .limit(Number(pageSize))
      .skip((Number(pageIndex) - 1) * Number(pageSize))
      .populate('user')
      .sort({
        //@ts-ignore
        [sort]: -1,
      });
    const countDocuments = await Payment.countDocuments(searchCondition);
    res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: payments,
      totalDocs: countDocuments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPaymentsExportExcel = async (
  req: ChatRequest,
  res: Response
) => {
  try {
    const {
      sort = 'createdAt',
      status = null,
      startDate,
      endDate,
      stt = '',
    } = req.query;
    const searchCondition: any = {};
    if (status) searchCondition.status = status;
    if (stt) {
      searchCondition.stt = stt;
    }
    if (startDate && endDate) {
      searchCondition.createdAt = { $gte: startDate, $lte: endDate };
    }
    if (req.query?.user) {
      searchCondition.user = req.query?.user;
    }

    const payments = await Payment.find(searchCondition)

      .populate('user')
      .sort({
        //@ts-ignore
        [sort]: -1,
      });

    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: payments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPaymentsNotificationUser = async (
  req: ChatRequest,
  res: Response
) => {
  try {
    const searchCondition: any = {
      $inc: { status: ['pending', 'completed'] },
    };
    const payments = await Payment.find(searchCondition)

      .select('-_id user points amount status')

      .populate('user', 'username -_id ')
      .sort({
        createdAt: -1,
      });
    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: payments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Lấy thông tin một giao dịch thanh toán
export const getPayment = async (req: ChatRequest, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOne({
      _id: id,
      user: req.user?._id,
    });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cập nhật thông tin giao dịch thanh toán
export const updatePayment = async (req: ChatRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, image } = req.body;

    const updatedPayment = await Payment.findById(id).populate('user');
    //   { _id: id },
    //   { status, image },
    //   { new: true }
    // ).populate('user');

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (updatedPayment.status !== status && status === 'completed') {
      sendLogPayment(
        `Hệ thống thanh toán thành công cho yêu cầu thanh toán của ${updatedPayment.user?.username} với số tiền ${updatedPayment.amount}`
      );
      if (updatedPayment?.user?.telegramId) {
        senLogToUser(
          updatedPayment?.user?.telegramId,
          TEMPLATE_SUCCESS_PAYMENT(updatedPayment.amount)
        );
      }
    }
    await Payment.findByIdAndUpdate(id, { status, image });
    updatedPayment.status === status;
    updatedPayment.image = image;
    // await updatePayment.save();
    return res.status(200).json({
      message: 'Payment updated successfully',
      payment: updatedPayment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error});
  }
};

export const rejectPayment = async (req: ChatRequest, res: Response) => {
  // const session = await mongoose.startSession();
  // session.startTransaction({
  //   readConcern: { level: 'snapshot' },
  //   writeConcern: { w: 'majority' },
  // });

  try {
    const { id } = req.params;
    const { reason } = req.body;
    const checkPayment = await Payment.findOne({
      _id: id,
      status: 'pending',
    }).populate('user');
    if (!checkPayment) {
      return res.status(400).json({
        message: 'Yêu cầu thanh toán không còn tồn tại',
      });
    }
    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: id },
      { reason: reason, status: 'rejected' },
      { new: true }
    );

    await userModel.findByIdAndUpdate(updatedPayment?.user, {
      $inc: { point: Number(updatedPayment?.points) },
    });

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    if (checkPayment?.status !== -1) {
      sendLogPayment(
        `Hệ thống từ chối thanh toán cho yêu cầu thang toán của ${updatedPayment.user?.username} với số tiền ${updatedPayment.amount}`
      );
      if (checkPayment?.user?.telegramId) {
        senLogToUser(
          checkPayment?.user?.telegramId,
          TEMPLATE_REJECT_PAYMENT(updatedPayment.amount)
        );
      }
    }
    return res.status(200).json({
      message: 'Payment updated successfully',
      payment: updatedPayment,
    });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Xóa một giao dịch thanh toán
export const deletePayment = async (req: ChatRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deletedPayment = await Payment.findOneAndDelete(
      {
        _id: id,
        status: 'pending',
      },
      { new: true }
    );

    if (!deletedPayment) {
      return res.status(400).json({ status: 0, message: 'Payment not found' });
    }
    await userModel.updateOne(
      { _id: deletedPayment?.user },
      { $inc: { point: deletedPayment?.points } }
    );

    return res
      .status(200)
      .json({ status: 1, message: 'Payment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, message: 'Server error' });
  }
};

export const countMoneyPayment = async (req: ChatRequest, res: Response) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const searchCondition: any = {
      status: 'completed',
    };
    if (
      startDate &&
      startDate !== 'undefined' &&
      startDate !== 'null' &&
      endDate &&
      endDate !== 'undefined' &&
      endDate !== 'null'
    ) {
      searchCondition.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const [countMoneyPayment, countMoneyPending] = await Promise.all([
      Payment.aggregate([
        {
          $match: searchCondition,
        },
        {
          $group: {
            _id: null,
            totalPoints: { $sum: '$points' },
          },
        },
      ]),
      Payment.aggregate([
        {
          $match: {
            status: 'pending',
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$points' },
          },
        },
      ]),
    ]);
    return res.status(200).json({
      status: 1,
      message: 'Lấy danh sách thanh toán thành công!',
      data: {
        countMoneyPayment: countMoneyPayment?.[0]?.totalPoints || 0,
        countMoneyPending: countMoneyPending?.[0]?.totalAmount || 0,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, message: 'Server error' });
  }
};

export const reportPayment = async (req: ChatRequest, res: Response) => {
  try {
    const user = req.query?.user;
    const userGetData = await userModel
      .findById(req.user?._id)
      .populate('roleOfUser')
      .populate('team');
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const searchCondition: any = {
      status: 'completed',
    };
    if (
      startDate &&
      startDate !== 'undefined' &&
      startDate !== 'null' &&
      endDate &&
      endDate !== 'undefined' &&
      endDate !== 'null'
    ) {
      searchCondition.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const conditionPost = {};
    if (user && user !== 'undefined') {
      const getAllPostUser = await postModel
        .find({ userId: user })
        .select('_id');
      const listIdPost = getAllPostUser?.map((item) => new ObjectId(item?._id));
      conditionPost.post = { $in: listIdPost };
    }
    const payment = await Payment.aggregate([
      {
        $match: searchCondition,
      },
      {
        $sort: { stt: -1 },
      },
      {
        $group: {
          _id: '$user',
          latestPayment: { $first: '$$ROOT' },
          lastPayment: { $last: '$$ROOT' },
        },
      },
    ]);
    const paymentPre = await Promise.all(
      payment?.map(async (item) => {
        const prePayment = await Payment.findOne({
          user: item?._id,
          createdAt: { $lt: item?.lastPayment?.createdAt },
        }).sort({ stt: -1 });

        return { ...item, prePayment };
      })
    );
    // console.log(paymentPre);

    const listLogPoint = await Promise.all(
      paymentPre?.map(async (item) => {
        if (item?.prePayment !== null) {
          return await pointLogModel.aggregate([
            {
              $match: {
                createdAt: {
                  $lte: new Date(item?.latestPayment?.createdAt),
                  $gte: new Date(item?.prePayment?.createdAt),
                },
                user: new ObjectId(item?._id),
                point: { $gte: 0 },
                ...conditionPost,
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
                'post.brand': 1,
                'post.user': 1,
                'post.team': 1,
              },
            },
          ]);
        } else {
          return await pointLogModel.aggregate([
            {
              $match: {
                createdAt: {
                  $lte: new Date(item?.latestPayment?.createdAt),
                },
                user: new ObjectId(item?._id),
                point: { $gte: 0 },
                ...conditionPost,
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
                'post.brand': 1,
                'post.user': 1,
                'post.team': 1,
              },
            },
          ]);
        }
      })
    );

    const allTeam = await teamModel.find();
    const teamObject = {};
    allTeam?.map((item) => (teamObject[item?._id] = item.name));
    const moneyByUserBrand = {};
    listLogPoint?.map((dataPoint) => {
      dataPoint?.map((item) => {
        moneyByUserBrand[teamObject[item.post?.user?.team?.length>=2
                  ? item.post?.team
                  : item.post?.user?.team]] = {
          ...moneyByUserBrand[teamObject[item.post?.user?.team?.length>=2
                  ? item.post?.team
                  : item.post?.user?.team]],
          [item?.post?.user?.username]: {
            ...moneyByUserBrand?.[teamObject[item.post?.user?.team?.length>=2
                  ? item.post?.team
                  : item.post?.user?.team]]?.[
              item?.post?.user?.username
            ],
            [item?.post?.brand?.name]:
              (moneyByUserBrand?.[teamObject[item.post?.user?.team?.length>=2
                  ? item.post?.team
                  : item.post?.user?.team]]?.[
                item?.post?.user?.username
              ]?.[item?.post?.brand?.name] || 0) + item?.point,
          },
        };
      });
    });

    const handleObject = (obj) => {
      const data = Object.keys(obj).map((item) => {
        let total = 0;
        Object.keys(obj[item])?.map((brand) => (total += obj[item][brand]));
        return {
          key: item,
          label: item,
          total,
          details: obj[item],
        };
      });
      return data;
    };
    const dataArray = Object.keys(moneyByUserBrand).map((item) => {
      const data = handleObject(moneyByUserBrand[item]);

      let total = 0;
      data?.map((brand) => (total += brand?.total));
      return {
        key: item,
        label: item,
        total,
        details: data,
      };
    });

    const listTeam = userGetData?.team?.map((item) => item?.name);

    if (userGetData?.roleOfUser?.name === 'leader') {
      const resultFilter = dataArray?.filter((item) => {
        return listTeam?.includes(item?.key);
      });

      return res.json({ data: resultFilter });
    } else {
      return res.json({ data: dataArray });
    }

    // }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lỗi server!' });
  }
};

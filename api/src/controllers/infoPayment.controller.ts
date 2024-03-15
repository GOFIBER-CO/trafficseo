import { Request, Response } from 'express';
import InfoPaymentModel from '../models/infoPayment.model';
import { RESPONSE_STATUS } from '../utils';
import { AuthRequest } from '../interfaces';

export const getAllInfoPayments = async (req: AuthRequest, res: Response) => {
  try {
    const pageSize = req.query.pageSize || 10;
    const pageIndex = req.query.pageIndex || 1;
    const infoPayments = await InfoPaymentModel.find({ user: req.user?._id })
      .limit(Number(pageSize))
      .skip((Number(pageIndex) - 1) * Number(pageSize))
      .exec();
    res
      .status(200)
      .json({ status: RESPONSE_STATUS.SUCCESS, data: infoPayments });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getInfoPaymentById = async (req: Request, res: Response) => {
  try {
    const infoPayment = await InfoPaymentModel.findById(req.params.id).exec();
    if (!infoPayment) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy thông tin thanh toán' });
    }
    res
      .status(200)
      .json({ status: RESPONSE_STATUS.SUCCESS, data: infoPayment });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createInfoPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, stk, bank, code } = req.body;
    const user = req.user;
    const checkExist = await InfoPaymentModel.findOne({ stk: stk });
    if (checkExist) {
      return res
        .status(201)
        .json({
          status: RESPONSE_STATUS.FAILED,
          data: checkExist,
          message: 'STK đã tồn tại trên hệ thống!',
        });
    }
    const infoPayment = await InfoPaymentModel.create({
      user,
      fullName,
      stk,
      bank,
      code,
    });
    return res
      .status(201)
      .json({ status: RESPONSE_STATUS.SUCCESS, data: infoPayment });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const updateInfoPayment = async (req: Request, res: Response) => {
  try {
    const { user, fullName, stk, bank, code } = req.body;
    const infoPayment = await InfoPaymentModel.findByIdAndUpdate(
      req.params.id,
      { user, fullName, stk, bank, code },
      { new: true }
    ).exec();
    if (!infoPayment) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy thông tin thanh toán' });
    }
    res
      .status(200)
      .json({ status: RESPONSE_STATUS.SUCCESS, data: infoPayment });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteInfoPayment = async (req: Request, res: Response) => {
  try {
    const infoPayment = await InfoPaymentModel.findByIdAndDelete(
      req.params.id
    ).exec();
    if (!infoPayment) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy thông tin thanh toán' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

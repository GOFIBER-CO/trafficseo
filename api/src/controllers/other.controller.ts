import { Response } from 'express';
import { ChatRequest } from '../interfaces';
import quantityMaxPaymentModel from '../models/quantityMaxPayment.model';
import { RESPONSE_STATUS } from '../utils';
import quantityResetPost from '../models/quantityResetPost';
import { cronPost } from '../helper/cronPost';
import missionModel from '../models/mission.model';
import numberSearchModel from '../models/numberSearch.model';
import accountMaxIpModel from '../models/accountMaxIp.model';
import configYoutube from '../models/configYoutube';

export const getQuantityMaxPayment = async (
  req: ChatRequest,
  res: Response
) => {
  try {
    const maxPayment = await quantityMaxPaymentModel.findOne({});

    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: maxPayment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateQuantityMaxPayment = async (
  req: ChatRequest,
  res: Response
) => {
  try {
    const { quantity } = req.body;
    const maxPayment = await quantityMaxPaymentModel.updateOne(
      {},
      { quantity: quantity },
      { upsert: true }
    );

    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: maxPayment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getLinkHelp = async (req: ChatRequest, res: Response) => {
  try {
    const maxPayment = await configYoutube.findOne({});

    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: maxPayment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateLinkHelp = async (req: ChatRequest, res: Response) => {
  try {
    const { link } = req.body;
    const maxPayment = await configYoutube.updateOne(
      {},
      { link: link },
      { upsert: true }
    );

    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: maxPayment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getQuantityResetPost = async (req: ChatRequest, res: Response) => {
  try {
    const maxPayment = await quantityResetPost.findOne({});

    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: maxPayment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateQuantityResetPost = async (
  req: ChatRequest,
  res: Response
) => {
  try {
    const { quantity } = req.body;
    const maxPayment = await quantityResetPost.updateOne(
      {},
      { quantity: quantity },
      { upsert: true }
    );
    cronPost(quantity);

    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: maxPayment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// config mission

export const getConfigMission = async (req: ChatRequest, res: Response) => {
  try {
    const status = await missionModel.findOne({});

    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: status,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateConfigMission = async (req: ChatRequest, res: Response) => {
  try {
    const { status } = req.body;
    const data = await missionModel.updateOne({}, { status }, { upsert: true });
    //@ts-ignore
    _io.emit('updateMission');
    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

//config index search

export const getIndexSearch = async (req: ChatRequest, res: Response) => {
  try {
    const status = await numberSearchModel.findOne({});

    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: status,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateIndexSearch = async (req: ChatRequest, res: Response) => {
  try {
    const { index } = req.body;
    if (typeof index !== 'number' && !isNaN(index))
      return res.json({
        status: RESPONSE_STATUS.FAILED,
        message: 'Không đúng kiểu dữ liệu',
      });
    if (index <= 0)
      return res.json({
        status: RESPONSE_STATUS.FAILED,
        message: 'Vui lòng nhập số lớn hơn 0',
      });
    const data = await numberSearchModel.updateOne(
      {},
      { index },
      { upsert: true }
    );

    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// setting max account by ip

export const getMaxAccountByIP = async (req: ChatRequest, res: Response) => {
  try {
    const status = await accountMaxIpModel.findOne({});

    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: status,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateAccountByIP = async (req: ChatRequest, res: Response) => {
  try {
    const { index } = req.body;

    if (typeof index !== 'number' && !isNaN(index))
      return res.json({
        status: RESPONSE_STATUS.FAILED,
        message: 'Không đúng kiểu dữ liệu',
      });
    if (index <= 0)
      return res.json({
        status: RESPONSE_STATUS.FAILED,
        message: 'Vui lòng nhập số lớn hơn 0',
      });
    const data = await accountMaxIpModel.updateOne(
      {},
      { quantity: index },
      { upsert: true }
    );

    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

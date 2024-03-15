import { AuthRequest } from '../interfaces';
import IpAdmin from '../models/ipLoginAdmin.model';
import { Response } from 'express';
import { RESPONSE_STATUS } from '../utils';
// GET /posthome
export const getIpLoginAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await IpAdmin.findOne();
    const response = {
      message: 'Lấy dữ liệu thành công',
      status: RESPONSE_STATUS.SUCCESS,
      data: posts,
    };
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /posthome/:id
export const updateIpLoginAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { ip } = req.body;
    const post = await IpAdmin.findOneAndUpdate(
      {},
      { ip },
      { new: true, upsert: true }
    );
    if (!post) {
      return res.status(404).json({ error: 'IP not found' });
    }
    const response = {
      message: 'Cập nhật thành công',
      status: RESPONSE_STATUS.SUCCESS,
      data: post,
    };
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

import { AuthRequest } from '../interfaces';
import PostHomeModel from '../models/postHome.model';
import { NextFunction, Request, Response } from 'express';
import { RESPONSE_STATUS } from '../utils';
// GET /posthome
export const getAllPosts = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await PostHomeModel.findOne();
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
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, description } = req.body;
    const post = await PostHomeModel.findOneAndUpdate(
      {},
      { title, content, description },
      { new: true, upsert: true }
    );
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
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

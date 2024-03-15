import { Request, Response } from 'express';
import CommentModel from '../models/comment.model';
import { AuthRequest, CommentType } from '../interfaces';
import postModel from '../models/post.model';
// Lấy danh sách tất cả các comment
export const getAllComments = async (req: AuthRequest, res: Response) => {
  try {
    const comments = await CommentModel.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Tạo một comment mới
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content, postId } = req.body;
    const comment = new CommentModel({
      content,
      userId: req.user?._id,
      postId,
    });
    const savedComment = await comment.save();
    const updatePost = await postModel.findByIdAndUpdate(postId, {
      $addToSet: {
        comment: savedComment?._id,
      },
    });
    //@ts-ignore
    _io.emit(`new comment`, savedComment);
    return res.json(savedComment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Lỗi server' });
  }
};

// Lấy thông tin của một comment theo ID
export const getCommentById = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment không tồn tại' });
      return;
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Lấy thông tin của một comment theo ID
export const getCommentByPostId = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const comment = await CommentModel.find({ postId: id })
      .populate('userId')
      .sort({ createdAt: -1 });
    if (!comment) {
      res.status(404).json({ error: 'Comment không tồn tại' });
      return;
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Xóa một comment theo ID
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deletedComment = await CommentModel.findOneAndDelete({
      _id: id,
      userId: req?.user?._id,
    });

    await postModel?.findByIdAndUpdate(deletedComment?.postId, {
      $pull: {
        comment: deletedComment?._id,
      },
    });
    if (!deletedComment) {
      res.status(404).json({ error: 'Comment không tồn tại' });
      return;
    }
    //@ts-ignore
    _io.emit(`new comment`, {});
    return res.json({ message: 'Comment đã bị xóa' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

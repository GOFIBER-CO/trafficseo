import { Router } from 'express';
import { authenticate } from '../middleware';
import {
  getAllComments,
  getCommentByPostId,
  createComment,
  deleteComment,
} from '../controllers/comment.controller';
const router = Router();

router.get('/getByPost/:id', authenticate, getCommentByPostId);
router.post('/create', authenticate, createComment);
router.delete('/deleteComment/:id', authenticate, deleteComment);
export default router;

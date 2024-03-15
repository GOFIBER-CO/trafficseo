import express from 'express';
import { getAllPosts, updatePost } from '../controllers/dieukhoan.controller';

const router = express.Router();

router.get('/', getAllPosts);

router.put('/', updatePost);

export default router;

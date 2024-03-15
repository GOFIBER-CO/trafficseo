import express from 'express';
import { getAllPosts, updatePost } from '../controllers/postHome.controller';
import { authenticateForSuperAdmin } from '../middleware';

const router = express.Router();

router.get('/', getAllPosts);

router.put('/', updatePost);

export default router;

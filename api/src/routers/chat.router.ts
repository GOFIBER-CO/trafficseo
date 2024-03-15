import { Router } from 'express';

import { action } from '../helper/action';
import { subject } from '../helper/subject';
import { authenticate } from '../middleware';
import chatController from '../controllers/chat.controller';
const router = Router();

router.get('/getMessages', authenticate, chatController.getMessage);
router.post('/sendMessage', authenticate, chatController.sendMessage);
router.post('/sendImage', authenticate, chatController.sendImage);
router.delete('/deleteMessage/:id', authenticate, chatController.deleteMessage);
export default router;

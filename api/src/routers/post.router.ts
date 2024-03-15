import { Router } from 'express';

import { action } from '../helper/action';
import { subject } from '../helper/subject';
import {
  authenticate,
  authenticateForSuperAdmin,
  authorize,
  checkOriginExtension,
  createActionMiddleWare,
  checkHost
} from '../middleware';
import postController from '../controllers/post.controller';
import { permissionFieldName, permissionFunction } from '../helper/permission';

const router = Router();
router.post(
  '/createPost',
  authenticate,
  createActionMiddleWare('Thêm bài viết'),
  postController.createPost
);
router.get('/getPosts', authenticate,checkHost, postController.getPagingPost);
router.get(
  '/admin',
  authenticate,
  authorize(permissionFunction.POST, permissionFieldName.GET),
  postController.getPagingPostForAdmin
);
router.get(
  '/getPagingPostForAdminExportExcel',

  authenticate,
  authorize(permissionFunction.POST, permissionFieldName.GET),
  postController.getPagingPostForAdminExportExcel
);
router.put(
  '/editPostUser/:id',
  authenticate,
  createActionMiddleWare('Chỉnh sửa bài viết'),
  postController.editPostUser
);
router.post(
  '/reportPost',
  authenticate,
  createActionMiddleWare('Báo cáo bài viết'),
  postController.reportPost
);
router.post(
  '/editPost/:id',
  authenticate,
  authorize(permissionFunction.POST, permissionFieldName.EDIT),
  createActionMiddleWare('Chỉnh sửa bài viết'),
  postController.editPost
);
router.post(
  '/deleteMultiPost',
  authenticate,
  createActionMiddleWare('Người dùng xóa bài viết'),
  postController.deleteMultiPostUser
);
router.delete(
  '/deletePost/:id',
  authenticate,
  authorize(permissionFunction.POST, permissionFieldName.DELETE),
  createActionMiddleWare('Xóa bài viết'),
  postController.deletePostAdmin
);

router.post(
  '/updateActiveAll',
  authenticateForSuperAdmin,
  createActionMiddleWare('Bật tất cả các bài viết'),
  postController.activeAllPost
);

router.post(
  '/updateListPostActive',
  authenticateForSuperAdmin,
  createActionMiddleWare('Bật danh sách các bài viết'),
  postController.activeListPost
);

router.post(
  '/deleteMultiPost',
  authenticateForSuperAdmin,
  createActionMiddleWare('Xóa bài viết'),
  postController.deleteMultiPostAdmin
);
router.delete(
  '/:id',
  authenticate,
  createActionMiddleWare('Người dùng xóa bài viết'),
  postController.deletePost
);
router.get(
  '/getReportedPost',
  authenticateForSuperAdmin,
  postController.getReportPost
);

router.get(
  '/getReportedPost/:id',
  authenticate,
  postController.getReportPostById
);

router.get('/getPagingUser', authenticate, postController.getPagingPostForUser);
router.get('/accept/:id', authenticate, postController.acceptPost);
router.put('/reject/:id', authenticate, postController.rejectPost);
router.get(
  '/getPagingPostPending',
  authenticate,
  postController.getPagingPostPending
);

router.get(
  '/getExcelPostPending',
  authenticate,
  postController.getExcelPostPending
);
router.put('/pullAllPost', authenticate, postController.pullAllPost);
router.get(
  '/getPagingUser/:id',
  authenticateForSuperAdmin,
  postController.getPagingPostForUserById
);
router.put('/addUserRun/:id', authenticate, postController.addUserRunning);
router.post(
  '/turnOffAllPost',
  authenticate,
  checkOriginExtension,
  postController.turnOffAllPost
);
router.get(
  '/getPagingPostForUserExportExcel',
  authenticate,
  postController.getPagingPostForUserExportExcel
);
router.get(
  '/getPagingPostForUserExportExcel/:id',
  authenticate,
  postController.getPagingPostForUserExportExcelById
);
router.get(
  '/getTrafficExcel/:id',
  authenticate,
  postController.exportTrafficByPostId
);
router.post(
  '/completedPost',
  authenticate,
  // createActionMiddleWare('Người dùng hoàn thành nhiệm vụ'),
  checkOriginExtension,
  postController.completedPost
);

router.post(
  '/reportPostExtension',
  authenticate,
  createActionMiddleWare('Extension báo cáo nhiệm vụ'),
  checkOriginExtension,
  postController.reportExtension
);
export default router;

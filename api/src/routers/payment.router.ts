import express, { Router } from 'express';
import {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  getPaymentsAdmin,
  deletePayment,
  countMoneyPayment,
  rejectPayment,
  getPaymentsNotificationUser,
  getPaymentsExportExcel,
  reportPayment,
} from '../controllers/payment.controller';
import {
  authenticate,
  authenticateForSuperAdmin,
  authorize,
  createActionMiddleWare,
} from '../middleware';
import { permissionFieldName, permissionFunction } from '../helper/permission';

const router: Router = express.Router();

router.post(
  '/',
  authenticate,
  createActionMiddleWare('Người dùng tạo yêu cầu thanh toán'),
  createPayment
);
router.get('/', authenticate, getPayments);
router.get('/admin', getPaymentsAdmin);
router.put(
  '/rejectPayment/:id',
  authenticate,
  authorize(permissionFunction.PAYMENT, permissionFieldName.EDIT),
  rejectPayment
);
router.get('/countMoneyPayment', authenticate, countMoneyPayment);
router.get('/reportPayment', authenticate, reportPayment);
router.get('/getPaymentsExportExcel', authenticate, getPaymentsExportExcel);
router.get(
  '/getPaymentsNotificationUser',
  authenticate,
  getPaymentsNotificationUser
);
router.get('/:id', getPayment);
router.put(
  '/:id',
  authenticate,
  authorize(permissionFunction.PAYMENT, permissionFieldName.EDIT),
  createActionMiddleWare('Người dùng cập nhật yêu cầu thanh toán'),
  updatePayment
);
router.delete(
  '/:id',
  authenticate,
  authorize(permissionFunction.PAYMENT, permissionFieldName.DELETE),
  createActionMiddleWare('Người dùng xóa yêu cầu thanh toán'),
  deletePayment
);

export default router;

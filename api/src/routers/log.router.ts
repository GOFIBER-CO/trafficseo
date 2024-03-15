import { Router } from 'express';
import {
  authenticate,
  authenticateForSuperAdmin,
  authorize,
} from '../middleware';

import logController from '../controllers/logs.controller';
import { permissionFieldName, permissionFunction } from '../helper/permission';

const router = Router();

router.get(
  '/get-log',
  authenticate,
  authorize(permissionFunction.LOG, permissionFieldName.GET),
  logController.getPagingLog
);
router.get(
  '/getPointLog',
  authenticate,
  authorize(permissionFunction.LOG, permissionFieldName.GET),
  logController.getPagingPointLog
);
router.get(
  '/getPointLogAdmin',
  authenticate,
  authorize(permissionFunction.LOG, permissionFieldName.GET),
  logController.getPagingPointLogAdmin
);

router.get(
  '/getPointLogAdminMiddlePayment',
  authenticate,
  authorize(permissionFunction.LOG, permissionFieldName.GET),
  logController.getPagingPointLogAdminMiddle2Payment
);

router.get(
  '/getPagingPointLogAdminMiddle2PaymentExcel',
  authenticate,
  authorize(permissionFunction.LOG, permissionFieldName.GET),
  logController.getPagingPointLogAdminMiddle2PaymentExcel
);

router.get(
  '/getTopUser',
  authenticate,
  authorize(permissionFunction.LOG, permissionFieldName.GET),
  logController.getTopUser
);

export default router;

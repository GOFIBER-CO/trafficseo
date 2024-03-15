import { Router } from 'express';

import {
  authenticate,
  authenticateForSuperAdmin,
  authorize,
  createActionMiddleWare,
} from '../middleware';
import roleController from '../controllers/role.controller';
import { permissionFieldName, permissionFunction } from '../helper/permission';

const router = Router();

router.get(
  '/getAllRole',
  authenticate,
  authorize(permissionFunction.ROLES, permissionFieldName.GET),
  roleController.getAllRole
);
router.post(
  '/createRole',
  authenticate,
  authorize(permissionFunction.ROLES, permissionFieldName.ADD),
  roleController.createRole
);
router.post(
  '/updateRole/:id',
  authenticate,
  authorize(permissionFunction.ROLES, permissionFieldName.EDIT),
  roleController.updateRole
);
router.delete(
  '/:id',
  authenticate,
  authorize(permissionFunction.ROLES, permissionFieldName.DELETE),
  roleController.deleteRole
);
export default router;

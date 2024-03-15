import express from 'express';
const router = express.Router();

import { permissionFunction, permissionFieldName } from '../helper/permission';
import { authenticate, authorize } from '../middleware';
import {
  createPermission,
  deletePermission,
  getAllPermission,
  getMyPermission,
  getPermissionByRole,
  updatePermission,
} from '../controllers/permission.controller';

router.get(
  '/',
  authenticate,
  authorize(permissionFunction.PERMISSION, permissionFieldName.GET),
  getAllPermission
);

router.get('/getByRole', authorize(), getPermissionByRole);
router.get('/getMyPermission', authorize(), getMyPermission);
router.post(
  '/',
  authenticate,
  authorize(permissionFunction.PERMISSION, permissionFieldName.ADD),
  createPermission
);
router.put(
  '/:id',
  authenticate,
  authorize(permissionFunction.PERMISSION, permissionFieldName.EDIT),
  updatePermission
);
router.delete(
  '/:id',
  authenticate,
  authorize(permissionFunction.PERMISSION, permissionFieldName.DELETE),
  deletePermission
);

export default router;

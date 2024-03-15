import { Router } from 'express';
import {
  authenticate,
  authenticateForSuperAdmin,
  authorize,
} from '../middleware';
import {
  createBrand,
  deleteBrandById,
  getAllBrands,
  updateBrandById,
} from '../controllers/brand.controller';
import { permissionFieldName, permissionFunction } from '../helper/permission';
const router = Router();

router.get(
  '/',
  authenticate,
  authorize(permissionFunction.BRAND, permissionFieldName.GET),
  getAllBrands
);
router.post(
  '/',
  authenticateForSuperAdmin,
  authorize(permissionFunction.BRAND, permissionFieldName.ADD),
  createBrand
);
router.put(
  '/:id',
  authenticateForSuperAdmin,
  authorize(permissionFunction.BRAND, permissionFieldName.EDIT),
  updateBrandById
);
router.delete(
  '/:id',
  authenticateForSuperAdmin,
  authorize(permissionFunction.BRAND, permissionFieldName.DELETE),
  deleteBrandById
);
export default router;

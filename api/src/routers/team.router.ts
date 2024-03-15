import { Router } from 'express';
import {
  authenticate,
  authenticateForSuperAdmin,
  authorize,
} from '../middleware';
import {
  createTeam,
  deleteTeamById,
  getAllTeams,
  getTeamById,
  updateTeamById,
} from '../controllers/team.controller';
import { permissionFieldName, permissionFunction } from '../helper/permission';
const router = Router();

router.get(
  '/',
  // authenticate,
  // authorize(permissionFunction.BRAND, permissionFieldName.GET),
  getAllTeams
);
router.post(
  '/',
  authenticateForSuperAdmin,
  authorize(permissionFunction.BRAND, permissionFieldName.ADD),
  createTeam
);
router.put(
  '/:id',
  authenticateForSuperAdmin,
  authorize(permissionFunction.BRAND, permissionFieldName.EDIT),
  updateTeamById
);
router.delete(
  '/:id',
  authenticateForSuperAdmin,
  authorize(permissionFunction.BRAND, permissionFieldName.DELETE),
  deleteTeamById
);
export default router;

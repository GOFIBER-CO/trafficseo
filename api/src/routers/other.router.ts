import express, { Router } from 'express';

import {
  authenticate,
  authenticateForSuperAdmin,
  createActionMiddleWare,
} from '../middleware';
import {
  getConfigMission,
  getIndexSearch,
  getLinkHelp,
  getMaxAccountByIP,
  getQuantityMaxPayment,
  getQuantityResetPost,
  updateAccountByIP,
  updateConfigMission,
  updateIndexSearch,
  updateLinkHelp,
  updateQuantityMaxPayment,
  updateQuantityResetPost,
} from '../controllers/other.controller';
import {
  getIpLoginAdmin,
  updateIpLoginAdmin,
} from '../controllers/ipAdmin.controller';

const router: Router = express.Router();

router.get('/getMaxPayment', authenticateForSuperAdmin, getQuantityMaxPayment);
router.put(
  '/updateMaxPayment',
  authenticateForSuperAdmin,
  updateQuantityMaxPayment
);

router.get('/getQuantityResetPost', getQuantityResetPost);
router.put(
  '/updateQuantityResetPost',
  authenticateForSuperAdmin,
  updateQuantityResetPost
);

router.get('/ipLogin', authenticateForSuperAdmin, getIpLoginAdmin);
router.put('/ipLogin', authenticateForSuperAdmin, updateIpLoginAdmin);

router.get('/mission', authenticate, getConfigMission);
router.put('/mission', authenticateForSuperAdmin, updateConfigMission);

router.get('/indexSearch', authenticate, getIndexSearch);
router.put('/indexSearch', authenticateForSuperAdmin, updateIndexSearch);

router.get('/maxAccountIP', authenticate, getMaxAccountByIP);
router.put('/maxAccountIP', authenticateForSuperAdmin, updateAccountByIP);

router.get('/linkHelp', getLinkHelp);
router.put('/linkHelp', authenticateForSuperAdmin, updateLinkHelp);
export default router;

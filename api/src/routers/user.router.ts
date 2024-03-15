//@ts-ignore
import { Router } from 'express';

import userController, {
  disabled2Fa,
  getQrCode,
  verify2FaToken,
  verify2FaTokenLogin,
} from '../controllers/user.controller';

import {
  authenticate,
  authenticateForSuperAdmin,
  authorize,
} from '../middleware';
import { permissionFieldName, permissionFunction } from '../helper/permission';

const router = Router();

router.post('/sign-up', userController.signUp);
router.get('/logout', userController.logout);
router.get('/2fa/:id', getQrCode);
router.put('/2fa/:id/verify', verify2FaToken);
router.put('/2fa/:id/verifyLogin', verify2FaTokenLogin);
router.put('/2fa/:id/disable', disabled2Fa);
router.post('/login', userController.login);
router.post('/loginWithGoogle', userController.loginWithGoogle);
router.put('/updateFP', authenticate, userController.updateFP);
router.get(
  '/getUserBlockByFP',
  authenticateForSuperAdmin,
  userController.getUserBlockByFP
);
router.get(
  '/getUsers',
  authenticate,
  authorize(permissionFunction.USER, permissionFieldName.GET),
  userController.getPagingUser
);
router.post(
  '/editUser/:id',
  authenticate,
  // authorize(permissionFunction.USER, permissionFieldName.EDIT),
  userController.editUser
);
router.post(
  '/upgradePoint/:id',
  authenticateForSuperAdmin,
  userController.upgradePoint
);
router.delete(
  '/deleteRecordBlockUser/:id',
  authenticateForSuperAdmin,
  userController.deleteRecordBlockUser
);
router.post('/changePassword', authenticate, userController.changePassword);
router.post('/addUser', authenticateForSuperAdmin, userController.addUser);
router.delete(
  '/deleteUser/:id',
  authenticateForSuperAdmin,
  userController.deleteUser
);
router.get('/authStatus', authenticate, userController.checkAuth);
router.put('/startMission', authenticate, userController.startMission);
router.put('/stopMission', authenticate, userController.stopMission);
// lấy danh sách user theo mã mời
router.get('/refernal', authenticate, userController.getPagingUserByRefernal);
// Hoa hồng nhận được từ mã giới thiệu
router.get('/commission', authenticate, userController.getCommissionReceived);
router.get(
  '/commission/total',
  authenticate,
  userController.getCommissionReceivedTotal
);
router.patch(
  '/add/referralCode',
  userController.insertReferralCodeForUserMissing
);
router.get(
  '/checkReferralCodeDuplicate',
  userController.checkReferralCodeDuplicate
);
router.get(
  '/getTotalCommissionAndMoney',
  authenticate,
  userController.getTotalCommissionAndMoney
);
router.put(
  '/enableUpPostUser',
  authenticateForSuperAdmin,
  userController.enableUpPostUser
);

router.put(
  '/disableUpPostUser',
  authenticateForSuperAdmin,
  userController.disableUpPostUser
);
export default router;

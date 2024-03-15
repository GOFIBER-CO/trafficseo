import express from 'express';
import {
  getAllInfoPayments,
  getInfoPaymentById,
  createInfoPayment,
  updateInfoPayment,
  deleteInfoPayment,
} from '../controllers/infoPayment.controller';
import { authenticate, createActionMiddleWare } from '../middleware';

// Định nghĩa router
const router = express.Router();

// GET /infoPayment - Lấy thông tin tất cả các thanh toán
router.get('/', authenticate, getAllInfoPayments);

// GET /infoPayment/:id - Lấy thông tin một thanh toán theo ID
router.get('/:id', getInfoPaymentById);

// POST /infoPayment - Tạo mới một thanh toán
router.post('/', authenticate, createActionMiddleWare("Người dùng thêm thông tin thanh toán"), createInfoPayment);

// PUT /infoPayment/:id - Cập nhật thông tin một thanh toán theo ID
router.put('/:id', authenticate, createActionMiddleWare("Người dùng cập nhật thông tin thanh toán"), updateInfoPayment);

// DELETE /infoPayment/:id - Xóa một thanh toán theo ID
router.delete('/:id', authenticate, createActionMiddleWare("Người dùng xóa thông tin thanh toán"), deleteInfoPayment);

// Xuất router
export default router;

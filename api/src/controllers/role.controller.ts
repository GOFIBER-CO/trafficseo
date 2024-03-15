import { genSaltSync, hashSync } from 'bcryptjs';
//@ts-ignore
import { NextFunction, Request, Response } from 'express';
//@ts-ignore
import Joi from 'joi';
import userModel from '../models/user.model';
import { responseModel } from '../helper/responseModel';
import { RESPONSE_STATUS } from '../utils';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { compareSync } from 'bcrypt';
import path from 'path';
import { AuthRequest } from '../interfaces';
import axios from 'axios';
import roleModel from '../models/role.model';

class RoleController {
  async getAllRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await roleModel.find();
      const response = {
        message: 'Lấy Role thành công',
        status: RESPONSE_STATUS.SUCCESS,
        role: roles,
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const role = await roleModel.create({
        name,
        slug: name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, ''),
      });
      const response = {
        message: 'Tạo Role thành công',
        status: RESPONSE_STATUS.SUCCESS,
        role,
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const { id } = req.params;
      const role = await roleModel.findByIdAndUpdate(id, {
        name,
        slug: name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, ''),
      });
      const response = {
        message: 'Cập nhật Role thành công',
        status: RESPONSE_STATUS.SUCCESS,
        role,
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const role = await roleModel.deleteOne({ _id: id });
      const response = {
        message: 'Xóa role thành công',
        status: RESPONSE_STATUS.SUCCESS,
        role,
      };
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new RoleController();

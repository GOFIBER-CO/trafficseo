//@ts-ignore
import { NextFunction, Request, Response } from 'express';
import config from '../config/config';
import { AuthRequest } from '../interfaces';
import { verifyToken } from '../utils/auth';
import userModel from '../models/user.model';
import actionHistoryModel from '../models/log.model';
import roleModel from '../models/role.model';
import Permission from '../models/permission.model';

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    return res.status(401).send({ message: 'No token provided' });
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return res.status(401).send({ message: 'Invalid token format' });
  }

  verifyToken(
    token,
    config.auth.jwtSecretKey,
    null,
    async (error: any, decoded: any) => {
      if (error) {
        return res.status(401).send({ message: 'Invalid token' });
      }

      if (
        !decoded?.exp ||
        !decoded.iat ||
        decoded?.exp - decoded?.iat !== 86400
      )
        return res.status(401).send({ message: 'Invalid token' });
      const user = await userModel.findOne({
        _id: decoded.id,
        isActivated: true,
      });
      if (!user) {
        return res.status(401).send({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    }
  );
};

export const checkHost = (req: any, res: Response, next: NextFunction) => {
  const origin = req.get('origin');
  if (!origin?.includes('trafficsseo.com')) {
    console.log(req?.user);
    return res.status(401).send({ message: 'No token provided' });
  }

  next();
};

export const authenticateForSuperAdmin = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    return res.status(401).send({ message: 'No token provided' });
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return res.status(401).send({ message: 'Invalid token format' });
  }

  verifyToken(
    token,
    config.auth.jwtSecretKey,
    null,
    async (error: any, decoded: any) => {
      if (error) {
        console.log(error);
        return res.status(401).send({ message: 'Invalid token' });
      }
      const user = await userModel.findById(decoded.id).populate('roleOfUser');
      if (user?.roleOfUser?.name === 'superAdmin') {
        req.user = user;
        next();
      } else {
        return res.status(401).send({ message: `You Don't have Permission` });
      }
    }
  );
};

export const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(`error ${error.message}`);
  const status = error.status || 400;
  return response.status(status).send(error.message);
};

export function authorize(func = '', permission = '') {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const roles = await roleModel.findOne({
        _id: req.user?.roleOfUser,
      });

      if (roles?.name === 'superAdmin') return next();
      if (func && permission) {
        const permissionField = await Permission.findOne({
          name: func,
          role: req?.user?.roleOfUser,
        });

        if (!permissionField) {
          return res.status(403).json({ message: 'Can not access ' + func });
        }
        //@ts-ignore
        const checkFlag = permissionField?.[permission] || false;

        if (!checkFlag) {
          return res
            .status(403)
            .json({ message: `Can not access ${func} by ${permission}` });
        }
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'No Token' });
    }
  };
}

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `[INFO] [SERVER] [${new Date().toUTCString()}] - - ${
      req.headers['x-forwarded-for'] || '::1'
    } - - ${req.originalUrl}`
  );
  next();
};

export const createActionMiddleWare = (actionName: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await actionHistoryModel.create({
        actionName: `${actionName}`,
        requestDetail: `query: ${JSON.stringify(
          req.query
        )}, params: ${JSON.stringify(req.params)}, body:  ${JSON.stringify(
          req.body
        )}`,
        ip: req.headers['x-forwarded-for'] || '::1',
        user: req?.user?._id,
      });
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };
};

export const checkOriginExtension = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const origin = req.get('Origin');
  if (origin && origin.startsWith('chrome-extension://')) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
};

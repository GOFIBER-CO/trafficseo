//@ts-nocheck
import { genSaltSync, hashSync } from 'bcryptjs';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import expressFileupload from 'express-fileupload';
import { createServer } from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { socket } from './socket';
import config from './config/config';
import logging from './config/logging';
import { Server } from 'socket.io';
import { errorHandler, logger } from './middleware';
import userModel from './models/user.model';

import useRoutes from './routers';
import roleModel from './models/role.model';
import session from 'express-session';
import { InitTele } from './helper/Bottelegram';
import {  sendLog } from './helper/Bottelegram';
import { cronPostEveryDay } from './helper/cronPost';


const NAMESPACE = 'SERVER';

dotenv.config();

const app = express();

const allowOrigin = [
  'https://trafficsseo.com',
  'https://admin.trafficsseo.com',
  'http://localhost:3001',
];

const corsOption: CorsOptions = {
  credentials: true,
  origin: allowOrigin,
  allowedHeaders: [
    'Origin',
    'Content-Type',
    'Accept',
    'x-access-token',
    'authorization',
    'x-signature',
  ],
  methods: 'GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE',
  preflightContinue: false,
};

app.use(cors(corsOption));

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    console.log('connected database');
  })
  .catch((err: any) => console.log(err));
app.use(
  session({ secret: 'truong-pro', resave: true, saveUninitialized: true })
);
// app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, `public`)));
app.use(expressFileupload());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
// app.use(ipWhiteListHandler)

useRoutes(app);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
//@ts-ignore
global._io = io;
socket(io);
// InitTele();
// Create socket

// Add your API routes here
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(errorHandler);
const initRoleForUser = async () => {
  try {
    const checkRole = await roleModel.find();
    if (checkRole.length === 0) {
      const roleSuperAdmin = Promise.all([
        roleModel.create({
          name: 'superAdmin',
        }),
        roleModel.create({
          name: 'admin',
        }),
        roleModel.create({
          name: 'user',
        }),
      ]);
    }
    const checkUser = await userModel.find({});

    if (checkUser.length == 0) {
      const getAdminId = await roleModel.findOne({
        name: 'superAdmin',
      });

      const saltAdmin = genSaltSync(Number(process.env.SALT_ROUND || 10));
      const passwordAdmin = hashSync('123123@', saltAdmin);
      const userAdmin = await userModel.create({
        username: 'Admin',
        email: 'admin@gmail.com',
        password: passwordAdmin,
        roleOfUser: getAdminId?.id ? getAdminId.id : getAdminId?._id,
      });

      console.log('Create admin success');
    }
  } catch (err) {
    console.log(err);
  }
};

// initRoleForUser();
cronPostEveryDay();
// const insertReferralCodeForUserMissing = () => {
//   try {
//     const updateReferralCode = async () => {
//       const userMissingReferralCodeList = await userModel
//         .find({ referralCode: { $in: [null, undefined] } })
//         .select('_id');
//       for (let i = 0; i < userMissingReferralCodeList.length; i++) {
//         const code: any = generateUserCode();
//         const checkReferralCodeExist = await userModel.findOne({
//           referralCode: code,
//         });
//         if (checkReferralCodeExist) {
//           updateReferralCode();
//         }
//         const id = userMissingReferralCodeList[i]._id.toString();
//         await userModel.findByIdAndUpdate(id, {
//           $set: { referralCode: code },
//         });
//       }
//     };
//     updateReferralCode();
//   } catch (error) {}
// };
// insertReferralCodeForUserMissing();
server.listen(config.server.port, () => {
  logging.info(
    NAMESPACE,
    `Server is running on ${config.server.hostname}:${config.server.port}`
  );
});

const sendLogTaoLao = async () => {
  try {
    const user = await userModel.findOne({
      email: 'lequantrung1892@gmail.com',
    });
    sendLog(
      `Người dùng ${
        user.username
      } hoàn thành nhiệm vụ. Cách lần hoàn thành trước đó ${167} giây. IP: ${
        '102.12.34.11' || '::1'
      } `
    );
    sendLog(
      `Cộng điểm cho người dùng hoàn thành nhiệm vụ\n ${JSON.stringify(user)}`
    );
  } catch (error) {}
};

// setInterval(() => {
//   sendLogTaoLao();
// }, 90000);

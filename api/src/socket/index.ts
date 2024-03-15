import { NextFunction } from "express";
import config from "../config/config";
import jwt from 'jsonwebtoken'
import { socketService } from "./SocketService";
import userModel from "../models/user.model";

export const socket = (io: any) => {
  io.use((socket: any, next: NextFunction) => {


    const secretKey = config.auth.jwtSecretKey
    const token = socket.handshake.auth.token;
    jwt.verify(token, secretKey, async (err: any, authorizedData: any) => {
      if (err) {
        next(new Error('Authentication error'));
      } else {

        if (authorizedData.id) {
          socket.userId = authorizedData.id
          next()
        }
      }
       
    });
     //@ts-ignore'
     global._io = io
  })
  io.on("connection", socketService)

}
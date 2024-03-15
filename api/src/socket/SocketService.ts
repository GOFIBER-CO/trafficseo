import { Socket } from 'socket.io';
import userModel from '../models/user.model';

export const socketService = async (socket: any) => {
//   console.log('socket connected');
  // const [updateSocketId, updateUserStatus] = await Promise.all([
  //   userModel.findOneAndUpdate(
  //     { _id: socket.userId },
  //     {
  //       $addToSet: {
  //         socketId: socket.id,
  //       },
  //     }
  //   ),
  //   userModel.findOneAndUpdate(
  //     { _id: socket.userId },
  //     {
  //       online: true,
  //     }
  //   ),
  // ]);

  socket.on('disconnect', async () => {
    // console.log('user disconnect');
    // const [updateSocketId, updateUserStatus] = await Promise.all([
    //   userModel.findOneAndUpdate(
    //     { _id: socket.userId },
    //     {
    //       $pull: {
    //         socketId: socket.id,
    //       },
    //     }
    //   ),
    //   userModel.findOneAndUpdate(
    //     { _id: socket.userId },
    //     {
    //       online: false,
    //     }
    //   ),
    // ]);
  });
};

import pointLogModel from '../models/pointLog.model';
import userModel from '../models/user.model';

export const ResetPoint = async () => {
  // const dateEnd = new Date(2023, 9, 10, 0, 0, 0);
  // // console.log(dateEnd);
  // const listUser = await pointLogModel.deleteMany({
  //   createdAt: {
  //     $lte: dateEnd,
  //   },
  // });
  // console.log(listUser);
  // listUser?.forEach(async (item) => {
  //   const user = await userModel.findByIdAndUpdate(item?._id, {
  //     $inc: { point: -parseInt(item?.totalPoints) },
  //   });
  //   console.log(user);
  // });
};

export const Des50KPoint = async () => {
  const listUser = await userModel.find({ refernalUser: { $ne: null } });
  listUser?.map(async (item, index) => {
    const data = await userModel.updateOne(
      { _id: item?._id },
      { $inc: { point: -50000 } }
    );
    console.log(`đã xong ${index}`);
  });
  // console.log(listUser);
};

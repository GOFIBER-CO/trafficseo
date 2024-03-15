//@ts-nocheck
import cron from 'node-schedule';
import moment from 'moment';
import postModel from '../models/post.model';
const RUN_TIME = {
  '1': ['12:00:00'],
  '2': ['08:00:00', '16:00:00'],
  '3': ['06:00:00', '12:00:00', '18:00:00'],
  '5': ['04:00:00', '08:00:00', '12:00:00', '16:00:00', '20:00:00'],
};
const handlePost = async (index: number) => {
  try {

    // const startDate = moment()
    //   .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    //   .toISOString();
    // const endDate = moment()
    //   .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
    //   .toISOString();


    const posts = await postModel.find({
      repeat: index,
      status:2
    });

    posts?.forEach(async (item) => {
      if (
        item?.quantityEveryDay >
        parseInt(item?.userCompleted?.length || 0) +
          parseInt(item?.quantityAfterReset || 0)
      )
        await postModel.updateOne(
          { _id: item?._id },

          {
            userCompleted: [],
            $inc: {
              //@ts-ignore
              quantityAfterReset: item?.userCompleted?.length,
            },
          }
        );
    });
  } catch (error) {
    console.log(error);
  }
};

const handlePostOther = async (index: number) => {
  try {
    const posts = await postModel.find({
      repeat: { $gte: index },
      status:2
      // createdAt: { $gte: startDate, $lte: endDate },
    });
    posts?.forEach(async (item) => {
      if (
        item?.quantityEveryDay >
        parseInt(item?.userCompleted?.length || 0) +
          parseInt(item?.quantityAfterReset || 0)
      )
        await postModel.updateOne(
          { _id: item?._id },
          //@ts-ignore
          {
            userCompleted: [],
            $inc: {
              //@ts-ignore
              quantityAfterReset: item?.userCompleted?.length,
            },
          }
        );
    });
  } catch (error) {
    console.log(error);
  }
};
export const cronPost = (quantity: number) => {
  moment.locale('vi');

  //cancel các job cũ
  const jobNames = Object.keys(cron.scheduledJobs);

  for (const name of jobNames) cron.cancelJob(name);

  cron.scheduleJob(`* */1 * * *`, () => {
    const hourVN = moment().format('HH:mm:ss');
    Object.keys(RUN_TIME)?.map((item: string, index: number) => {
      console.log(' co chay nhas');
      if (parseInt(item) <= quantity) {
        if (Object.values(RUN_TIME)[index]?.includes(hourVN)) {
          handlePost(parseInt(item));
        }
      } else {
        if (Object.values(RUN_TIME)[quantity]?.includes(hourVN)) {
          handlePostOther(parseInt(item));
        }
      }
    });
    console.log(hourVN);
    console.log(`running a task every 2`);
  });
};

export const cronPostEveryDay = () => {
  cron.scheduleJob(`0 3 * * *`, async () => {
    const toDay = moment().toISOString();
    const posts = await postModel.find({
      startDate: { $lte: toDay },
      endDate: { $gte: toDay },
      status: { $in: [6, 2] },
    });
  
     const postsOff = await postModel.find({
      endDate: { $lt: toDay },
      status: { $in: [6, 2] },
    });
  
    await Promise.all(
      posts?.map(async (element, index) => {
        await postModel.updateOne(
          { _id: element?._id },
          {
            status: 2,
            userCompleted: [],
            reportExtension:0,
            reportExtensionUser:[],
            quantityAfterReset: 0,
          }
        );
        console.log("da xong " ,index)
      })
    );
     await Promise.all(
      postsOff?.map(async (element, index) => {
        await postModel.updateOne(
          { _id: element?._id },
          {
            status: 3,
        
          }
        );
        console.log("da xong " ,index)
      })
    );
  });
};


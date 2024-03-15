import userRouter from './user.router';
import postRouter from './post.router';
import chatRouter from './chat.router';
import commentRouter from './comment.router';
import logRouter from './log.router';
import infoPaymentRouter from './infoPayment.router';
import paymentRouter from './payment.router';
import uploadRouter from './upload.router';
import postHomeRouter from './postHome.router';
import notificationHome from './notificationHome.router';
import dieuKhoanRouter from './dieukhoan.router';
import dieuKienRouter from './dieukien.router';
import otherRouter from './other.router';
import roleRouter from './role.router';
import permissionRouter from './permission.router';
import notificationReferralRoute from './notificationReferral.router';
import brandRouter from './brand.router';
import teamRouter from './team.router';
const version = {
  v1: '/api/v1',
};
const useRoutes = (app: any) => {
  //   app.use((req: Request, res: Response, next: NextFunction) => {
  //     res.header('Access-Control-Allow-Origin', '*');
  //     next();
  //   });
  app.use(`${version.v1}/log`, logRouter);
  app.use(`${version.v1}/users`, userRouter);
  app.use(`${version.v1}/posts`, postRouter);
  app.use(`${version.v1}/role`, roleRouter);
  app.use(`${version.v1}/permission`, permissionRouter);
  app.use(`${version.v1}/chat`, chatRouter);
  app.use(`${version.v1}/comment`, commentRouter);
  app.use(`${version.v1}/infoPayment`, infoPaymentRouter);
  app.use(`${version.v1}/payment`, paymentRouter);
  app.use(`${version.v1}/upload`, uploadRouter);
  app.use(`${version.v1}/postHome`, postHomeRouter);
  app.use(`${version.v1}/notificationHome`, notificationHome);
  app.use(`${version.v1}/dieukhoan`, dieuKhoanRouter);
  app.use(`${version.v1}/notificationReferral`, notificationReferralRoute);
  app.use(`${version.v1}/dieukien`, dieuKienRouter);
  app.use(`${version.v1}/other`, otherRouter);
  app.use(`${version.v1}/brand`, brandRouter);
  app.use(`${version.v1}/team`, teamRouter);
};

export default useRoutes;

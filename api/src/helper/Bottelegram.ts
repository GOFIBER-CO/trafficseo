
import { Telegraf } from 'telegraf';
import ipLoginAdminModel from '../models/ipLoginAdmin.model';
import moment from 'moment';
const bot = new Telegraf('6607026372:AAEmE728GTMrSx6NuGJQCYpKemZhGJvAWPQ');
const botSecurity = new Telegraf(
  '6343816991:AAEM7Bj8FBx_D8O9GmQgporp7BN291vxCJ8'
);
const botPayment = new Telegraf(
  '6156215117:AAGeC9cOxpcxskzAN14pOBr8nL0B__0CtuA'
);
export const sendLog = async (message: string) => {
  try {
    await bot.telegram.sendMessage(-1001795630211, message);
  } catch (error) {

  }
};

export const sendLogPayment = async (message: string) => {
  try {
    await botPayment.telegram.sendMessage(-4065581631, message);
  } catch (error) {
 
  }
};

export const sendLogAcceptPost = async (
  content: string,
  user: string,
  type: string,
  stt: number
) => {
  try {
    const message =
      `Bài viết có STT ${stt} nội dung <b>${content}</b> ✅\n` +
      `Vừa được <b>${type}</b> <b>${user}</b> duyệt vào lúc <b>${moment().format(
        'HH:mm DD-MM-YYYY'
      )}</b>✅`;
    await bot.telegram.sendMessage(-1001795630211, message, {
      parse_mode: 'HTML',
    });
  } catch (error) {
  
  }
};

export const sendLogRejectPost = async (
  content: string,
  user: string,
  type: string,
  stt: number
) => {
  try {
    const message =
      `Bài viết có STT ${stt} nội dung <b>${content}</b> ✅\n` +
      `Vừa bị <b>${type}</b> <b>${user}</b> từ chối duyệt vào lúc <b>${moment().format(
        'HH:mm DD-MM-YYYY'
      )}</b>❌`;
    await bot.telegram.sendMessage(-1001795630211, message, {
      parse_mode: 'HTML',
    });
  } catch (error) {

  }
};

export const sendLogCompletedPost = async (
  content: string,
  user: string,
  stt: any
) => {
  try {
    const message =
      `Bài viết có STT ${stt} nội dung <b>${content}</b> ✅\n` +
      `Thuộc người dùng <b>${user}</b> đã hoàn thành đủ số lượng vào lúc <b>${moment().format(
        'HH:mm DD-MM-YYYY'
      )}</b>✅`;
    await bot.telegram.sendMessage(-4093043532, message, {
      parse_mode: 'HTML',
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendLogCompletedPostToUser = async (
  content: string,
  user: string,
  stt: number
) => {
  try {
    const message =
      `Bài viết có STT ${stt} nội dung <b>${content}</b> ✅\n` +
      `Đã hoàn thành đủ số lượng vào lúc <b>${moment().format(
        'HH:mm DD-MM-YYYY'
      )}</b>✅`;
    await botPayment.telegram.sendMessage(user, message, {
      parse_mode: 'HTML',
    });
  } catch (error) {
    console.log(error);
  }
};

export const senLogToUser = async (id: string, message: string) => {
  try {
    await bot.telegram.sendMessage(id, message, { parse_mode: 'HTML' });
  } catch (error) {
    console.log(error);
  }
};

export const TEMPLATE_REJECT_POST = ({ stt, content, type, user }: any) => {
  const message =
    `Bài viết có STT ${stt} nội dung <b>${content}</b> ❌\n` +
    `Vừa bị <b>${type}</b> <b>${user}</b> từ chối duyệt vào lúc <b>${moment().format(
      'HH:mm DD-MM-YYYY'
    )}</b>❌`;
  return message;
};

export const TEMPLATE_SUCCESS_POST = ({ stt, content }: any) => {
  const message =
    `Bài viết có STT ${stt} nội dung <b>${content}</b> ✅\n` +
    `Đã hoàn thành đủ số lượng vào lúc <b>${moment().format(
      'HH:mm DD-MM-YYYY'
    )}</b>✅`;
  return message;
};

export const TEMPLATE_SUCCESS_PAYMENT = ({ price }: any) => {
  const message =
    `Hệ thống TRAFFICSEO thanh toán thành số tiền <b>${new Intl.NumberFormat().format(
      price
    )}</b> ✅\n` + `Vào lúc <b>${moment().format('HH:mm DD-MM-YYYY')}</b>✅`;
  return message;
};

export const TEMPLATE_REJECT_PAYMENT = ({ price }: any) => {
  const message =
    `Hệ thống TRAFFICSEO từ chối thanh toán thành số tiền <b>${new Intl.NumberFormat().format(
      price
    )}</b> ❌\n` + `Vào lúc <b>${moment().format('HH:mm DD-MM-YYYY')}</b>❌`;
  return message;
};

export const NOTICE_USER_EXIST_FP = ({ email, users = [], fp }: any) => {
  return (
    `<b>‼️ NGƯỜI DÙNG VỪA ĐĂNG NHẬP BỊ TRÙNG FP ‼️</b> \n` +
    `Người dùng có email <b>${email}</b> vừa đăng nhập có fp là <b>${fp}</b> \n` +
    `Trùng với các người dùng sau: ${users?.toString()}`
  );
};
export const TEMPLATE_ACCEPT_POST = ({ stt, content, type, user }: any) => {
  const message =
    `Bài viết có STT ${stt} nội dung <b>${content}</b> ✅\n` +
    `Vừa được <b>${type}</b> <b>${user}</b> duyệt vào lúc <b>${moment().format(
      'HH:mm DD-MM-YYYY'
    )}</b>✅`;
  return message;
};
export const InitTele = async () => {
  try {
    botSecurity.launch();
    botSecurity.command('reset', async (ctx) => {
      const key = ctx.update.message.text?.split(' ');
      if (key?.[1] === 'okvip') {
        await ipLoginAdminModel.updateOne({}, { ip: key?.[2]?.trim() || '' });
        ctx.reply('Reset IP thành công.');
      }
    });
    bot.launch();
    bot.command(/start/, async (ctx) => {
      const id = ctx.update.message.chat.id;
      //@ts-ignore
      const username = ctx.update.message.chat?.username || 'Chưa đặt username';

      // const key = ctx.update.message.text?.split(' ');
      // if (key?.[1] === 'okvip') {
      //   await ipLoginAdminModel.updateOne({}, { ip: key?.[2]?.trim() || '' });
      //   ctx.reply('Reset IP thành công.');
      // }
      // const chatId = msg.chat.id;

      const message =
        `<b>CHÀO MỪNG ĐẾN VỚI TRAFFICSEO</b>\n` +
        `<b>ID CÚA BẠN: </b><code>${id}</code>\n` +
        `<b>USERNAME CÚA BẠN: </b><code>${username}</code>`;

      ctx.reply(message, { parse_mode: 'HTML' });
    });
  } catch (error) {
    console.log(error);
  }
};


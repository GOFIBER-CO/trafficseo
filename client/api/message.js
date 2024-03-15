import { getInstance } from "../helper/axios";

export const getPaginatedMessage = async (pageSize, pageIndex) => {
  const res = await getInstance().get(
    `/api/v1/chat/getMessages?pageSize=${pageSize}&pageIndex=${pageIndex}`
  );
  return res?.data?.data;
};

export const sendMessage = async (content) => {
  const res = await getInstance().post(`api/v1/chat/sendMessage`, { content });
  return res?.data;
};
export const sendImage = async (formData) => {
  await getInstance().post(`api/v1/chat/sendMessage`, formData);
};

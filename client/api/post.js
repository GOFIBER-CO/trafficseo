import { getInstance } from "../helper/axios";

export const getPaginatedPosts = async (pageSize, pageIndex) => {
  const res = await getInstance().get(
    `api/v1/posts/getPosts?pageSize=${pageSize}&pageIndex=${pageIndex}`
  );
  return res?.data;
};

export const createPost = async (data) => {
  const res = await getInstance().post(`api/v1/posts/createPost`, data);
  return res?.data;
};

export const runningPost = async (id) => {

    const res = await getInstance().put(`api/v1/posts/addUserRun/${id}`);
    return res?.data;

};
export const pullAllPost = async () => {
  const res = await getInstance().put(`api/v1/posts/pullAllPost`);
  return res?.data;
};

export const createReport = async (content) => {
  const res = await getInstance().post(`api/v1/posts/reportPost`, content);
  return res?.data?.data;
};

export const editPostUser = async (id, data) => {
  try {
    const res = await getInstance().put(
      `api/v1/posts/editPostUser/${id}`,
      data
    );
    return res?.data;
  } catch (error) {
    return error;
  }
};
export const getTrafficPost = async (id) => {
  const data = await getInstance().get(`/api/v1/posts/getTrafficExcel/${id}`);
  return data?.data;
};
export const getPagingPostUser = async ({
  search,
  status,
  pageSize,
  pageIndex,
  query = "",
}) => {
  const res = await getInstance().get(
    `api/v1/posts/getPagingUser?search=${search}&status=${status}&pageSize=${pageSize}&pageIndex=${pageIndex}&${query}`
  );
  return res?.data;
};
export const getPagingPostForUserExportExcel = async ({
  search,
  status,
  pageSize,
  pageIndex,
  query = "",
}) => {
  const res = await getInstance().get(
    `api/v1/posts/getPagingPostForUserExportExcel?search=${search}&status=${status}&pageSize=${pageSize}&pageIndex=${pageIndex}&${query}`
  );
  return res?.data;
};

export const deletePost = async (id) => {
  const res = await getInstance().delete(`api/v1/posts/${id}`);
  return res?.data;
};
export const deleteMultiPost = async (postIds) => {
  const res = await getInstance().post(`api/v1/posts/deleteMultiPost`, {
    postIds,
  });
  return res?.data;
};
//comment
export const createComment = async (data) => {
  const res = await getInstance().post(`api/v1/comment/create`, data);
  return res?.data;
};

export const getPostReportedById = async (id = "") => {
  const res = await getInstance().get(`/api/v1/posts/getReportedPost/${id}`);
  return res.data;
};
export const deleteComment = async (id) => {
  const res = await getInstance().delete(`api/v1/comment/deleteComment/${id}`);
  return res?.data;
};
export const getPagingComment = async (id, pageSize = 10, pageIndex = 1) => {
  const res = await getInstance().get(
    `api/v1/comment/getByPost/${id}?pageSize=${pageSize}&pageIndex=${pageIndex}`
  );
  return res?.data;
};

export const getPostHome = async () => {
  const res = await getInstance().get(`api/v1/postHome`);
  return res?.data;
};

export const getNotificationHome = async () => {
  const res = await getInstance().get(`api/v1/notificationHome`);
  return res?.data;
};

export const getDieuKhoan = async () => {
  const res = await getInstance().get(`api/v1/dieukhoan`);
  return res?.data;
};

export const getDieuKien = async () => {
  const res = await getInstance().get(`api/v1/dieukien`);
  return res?.data;
};
export const getNotificationReferral = async () => {
  const res = await getInstance().get(`api/v1/notificationReferral`);
  return res?.data;
};

export const updateFingerPrint = async (data) => {
  return await getInstance().put(`api/v1/users/updateFP`, data);
};

export const getQuantityResetPost = async () => {
  const result = await getInstance().get("api/v1/other/getQuantityResetPost");
  return result.data;
};

export const getIndexSearch = async () => {
  const result = await getInstance().get("api/v1/other/indexSearch");
  return result.data;
};

export const getAllTeam = async () => {
  const result = await getInstance().get(
    "api/v1/team?pageSize=999999999&pageIndex=1"
  );
  return result.data;
};

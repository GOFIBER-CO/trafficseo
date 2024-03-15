const { getInstance } = require("@/helper/axios");

export const getInfoPayments = async (pageSize, pageIndex) => {
  const res = await getInstance().get(
    `/api/v1/infoPayment?pageSize=${pageSize}&pageIndex=${pageIndex}`
  );

  return res?.data;
};

export const createInfoPayment = async (data) => {
  const res = await getInstance().post("/api/v1/infoPayment", data);
  return res?.data;
};
export const updateInfoPayment = async (id, data) => {
  const res = await getInstance().put("/api/v1/infoPayment/" + id, data);
  return res?.data;
};
export const deleteInfoPayment = async (id) => {
  const res = await getInstance().delete("/api/v1/infoPayment/" + id);
  return res?.data;
};

export const getLinkHelp = async () => {
  const res = await getInstance().get("/api/v1/other/linkHelp");
  return res?.data;
};

export const getRequest = async (pageSize, pageIndex, status = 0) => {
  const statusList = ["pending", "completed", "rejected"];
  let link;
  if (status === 0) {
    link = `/api/v1/payment?pageSize=${pageSize}&pageIndex=${pageIndex}`;
  } else {
    link = `/api/v1/payment?pageSize=${pageSize}&pageIndex=${pageIndex}&status=${
      statusList[status - 1]
    }`;
  }
  const res = await getInstance().get(link);

  return res?.data;
};

export const getPaymentsNotificationUser = async () => {
  const res = await getInstance().get(
    "/api/v1/payment/getPaymentsNotificationUser"
  );
  return res?.data;
};
export const createRequest = async (data) => {
  const res = await getInstance().post("/api/v1/payment", data);
  return res?.data;
};
export const deleteRequest = async (id) => {
  const res = await getInstance().delete("/api/v1/payment/" + id);
  return res?.data;
};

export const updateUser = async (id, data) => {
  const res = await getInstance().post("/api/v1/users/editUser/" + id, data);
  return res?.data;
};

export const getPointLogs = async (pageSize, pageIndex) => {
  const res = await getInstance().get(
    `/api/v1/log/getPointLog?pageSize=${pageSize}&pageIndex=${pageIndex}`
  );
  return res?.data;
};
export const getCommission = async (pageSize, pageIndex, month, year) => {
  const res = await getInstance().get(
    `/api/v1/users/commission?pageSize=${pageSize}&&pageIndex=${pageIndex}&&month=${month}&&year=${year}`
  );
  return res?.data;
};
export const getCommissionTotal = async () => {
  const res = await getInstance().get(`/api/v1/users/commission/total`);
  return res?.data;
};
export const getTotalCommissionAndMoney = async (query = "") => {
  const res = await getInstance().get(
    `/api/v1/users/getTotalCommissionAndMoney?${query}`
  );
  return res?.data;
};

export const getReportPayment = async (query = "") => {
  const res = await getInstance().get(`api/v1/payment/reportPayment?${query}`);
  return res.data;
};

export const getPagingBrand = async () => {
  const res = await getInstance().get(`api/v1/brand`);
  return res;
};

export const getStatusMission = async () => {
  const res = await getInstance().get(`api/v1/other/mission`);
  return res.data;
};

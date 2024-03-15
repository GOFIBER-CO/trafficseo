export const exportPermission = (value) => {
  let list = {
    user: "Quản lý user",
    role: "Quản lý phân quyền",
    brand: "Quản lý brand",
    payment: "Quản lý rút tiền",
    message: "Quản lý tin nhắn",
    post: "Quản lý bài viết",
    log: "Quản lý log",
  };

  return list[value];
};

export const listConstanst = {
  user: "Quản lý user",
  role: "Quản lý phân quyền",
  brand: "Quản lý brand",
  payment: "Quản lý rút tiền",
  message: "Quản lý tin nhắn",
  post: "Quản lý bài viết",
  log: "Quản lý log",
};

const extConstanst = {
  stat: {
    "seo-stats": "Đề xuất lên tổ trưởng",
    "leader-stats": "Duyệt đề xuất",
  },
  notification: {
    leader: "Thông báo team",
  },
  domain: {
    searchByUser: "Lọc theo user",
  },
  domainDashboard: {
    exportExcel: "Xuất excel",
  },
  team: {
    disable: "Ẩn team",
  },
};

export const exportExt = (name) => {
  return extConstanst[name];
};

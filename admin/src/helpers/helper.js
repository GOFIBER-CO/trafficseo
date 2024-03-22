import { APIClient } from "./api_helper";
import * as url from "./url_helper";
import axios from "axios";

const api = new APIClient();

export const getLoggedInUser = () => {
  const user = sessionStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};
export const getQR = (id) => api.get(`/api/v1/users/2fa/${id}`);
export const enable2FA = (id, data) =>
  api.update(`/api/v1/users/2fa/${id}/verify`, data);

export const logout = () => api.get(`/api/v1/users/logout`);
export const disable2FA = (id, data) =>
  api.update(`/api/v1/users/2fa/${id}/disable`, data);
export const verify2FA = (id, data) =>
  api.update(`/api/v1/users/2fa/${id}/verify`, data);

export const verify2FALogin = (id, data) =>
  api.update(`/api/v1/users/2fa/${id}/verifyLogin`, data);
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};
//permission\
export const getAllPermissions = () => api.get(url.GET_ALL_PERMISSION);
//roles
export const getAllRole = (pageSize, pageIndex) =>
  api.get(`${url.GET_ALL_ROLES}?pageSize=${pageSize}&pageIndex=${pageIndex}`);
export const editRolePermission = (permission, roleId) =>
  axios.patch(url.EDIT_ROLE_PERMISSION, {
    permission: permission,
    roleId: roleId,
  });
export const addNewRole = (roleName) =>
  axios.post(`${url.ADD_NEW_ROLES}`, { name: roleName });
export const deleteRole = (roleId) =>
  axios.delete(`${url.DELETE_ROLES}/${roleId}`);
//login
export const postLogin = (data) => api.create(url.API_USER_LOGIN, data);

// get all faqs
export const getAllFaqs = () => api.get(url.GET_FAQS);
export const getFaqByID = (id) => api.get(url.GET_FAQS + "/" + id);
export const addFaq = (body) => api.create(`${url.GET_FAQS}`, body);
export const updateFaq = (id, body) =>
  api.update(`${url.GET_FAQS}/${id}`, body);
export const deleteFaqs = (id) => api.delete(`${url.GET_FAQS}/remove/${id}`);
export const searchFAQ = (q) => api.get(`${url.GET_FAQS}/faq/search/?q=${q}`);
export const formatFaqData = (data) => {
  if (data) {
    return data.map((item) => ({ ...item, key: item._id }));
  }
  return [];
};

export const getAllUsers = (data, query = "") => {
  let urlGet = `${url.GET_USERS}?search=${data?.search}&pageSize=${data?.pageSize}&pageIndex=${data?.pageIndex}&${query}`;
  if (data?.status !== undefined) {
    urlGet = urlGet + `&status=${data?.status}`;
  }
  return api.get(urlGet);
};

export const getPagingUserBlock = (data, query = "") => {
  let urlGet = `/api/v1/users/getUserBlockByFP?search=${data?.search}&pageSize=${data?.pageSize}&pageIndex=${data?.pageIndex}&${query}`;

  return api.get(urlGet);
};

export const getUser = (id) => api.get(`${url.GET_USERS}/${id}`);

export const updateUser = (id, body) =>
  api.update(`${url.GET_USERS}/${id}`, body);
export const searchUser = (search) =>
  api.get(`${url.SEARCH_USER}?search=${search}`);

export const createUserPermission = (body) =>
  api.create(url.GET_USER_PERMISSION, body);
export const getUserPermission = (id) =>
  api.get(`${url.GET_USER_PERMISSION}/${id}`);
export const updateUserPermission = (id, body) =>
  api.update(`${url.GET_USER_PERMISSION}/${id}`, body);
export const deleteUserPermission = (id) =>
  api.delete(`${url.GET_USER_PERMISSION}/delete/${id}`);
// schema
export const getAllSchemas = () => api.get(`${url.GET_SCHEMAS}/getAll`);
export const getSchema = (id) => api.get(`${url.GET_SCHEMAS}/${id}`);
export const addSchema = (body) =>
  api.create(`${url.GET_SCHEMAS}/insert`, body);
export const updateSchema = (id, body) =>
  api.update(`${url.GET_SCHEMAS}/update/${id}`, body);
export const deleteSchema = (id) =>
  api.delete(`${url.GET_SCHEMAS}/delete/${id}`);
export const searchSchema = (q) =>
  api.get(`${url.GET_SCHEMAS}/getPaging/search?q=${q}`);

// Taxonomy
export const getAllTaxonomies = () => api.get(url.GET_TAXONOMYS);
export const getTaxonomy = (id) => api.get(`${url.GET_TAXONOMYS}/${id}`);
export const addTaxonomy = (body) =>
  api.createWithFormData(`${url.GET_TAXONOMYS}`, body);
export const updateTaxonomy = (id, body) =>
  api.updateWithFormData(`${url.GET_TAXONOMYS}/${id}`, body);
export const deleteTaxonomy = (slug) =>
  api.delete(`${url.GET_TAXONOMYS}/remove/${slug}`);
export const deleteAllChildTaxonomy = (slug) =>
  api.delete(`${url.GET_TAXONOMYS}/removeTax/${slug}`);
export const searchTaxonomy = (q) =>
  api.get(`${url.GET_TAXONOMYS}/tax/search?q=${q}`);
export const getByType = (type) =>
  api.get(`${url.GET_TAXONOMYS}/getByType/${type}`);
// Tags

export const getPagingTags = (pageSize, pageIndex, filter) =>
  api.get(
    `${url.GET_TAGS}/getPaging?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${filter}`
  );
export const getAllTag = () => api.get(`${url.GET_TAGS}/getAllTag`);

export const getTag = (id) => api.get(`${url.GET_TAGS}/${id}`);
export const addTag = (body) => api.create(`${url.GET_TAGS}/insert`, body);
export const updateTag = (id, body) =>
  api.update(`${url.GET_TAGS}/update/${id}`, body);
export const deleteTag = (slug) => api.delete(`${url.GET_TAGS}/delete/${slug}`);
export const deleteAllChildTag = (slug) =>
  api.delete(`${url.GET_TAGS}/removeTax/${slug}`);
export const searchtag = (q, pageSize = 10, pageIndex = 1) =>
  api.get(
    `${url.GET_TAGS}/getPaging?search=${q}&pageSize=${pageSize}&pageIndex=${pageIndex}`
  );
// Categories
export const getAllCategory = (pageSize = 10, pageIndex = 1) =>
  api.get(`${url.GET_CATES}/getAllCate`);
export const getAllCateParent = () => api.get(`${url.GET_CATES}/getAllCate`);
export const getCategory = (id) => api.get(`${url.GET_CATES}/${id}`);
export const addCategory = (body) =>
  api.create(`${url.GET_CATES}/insert`, body);
export const updateCategory = (id, body) =>
  api.update(`${url.GET_CATES}/update/${id}`, body);
export const deleteCategory = (slug) =>
  api.delete(`${url.GET_CATES}/delete/${slug}`);
export const deleteCategoryChild = (slug) =>
  api.delete(`${url.GET_CATES}/removeTax/${slug}`);
export const searchCategory = (q, pageSize = 10, pageIndex = 1) =>
  api.get(
    `${url.GET_CATES}/getPaging?search=${q}&pageSize=${pageSize}&pageIndex=${pageIndex}`
  );
// posts
export const getAllPosts = (
  pageSize,
  pageIndex,
  search,
  cate = "",
  status = "",
  domainId = "",
  userId = "",
  query = ""
) => {
  return api.get(
    `${url.GET_POSTS}?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}&cate=${cate}&status=${status}&domainId=${domainId}&userId=${userId}&${query}`
  );
};

export const getPostPending = (
  pageSize,
  pageIndex,
  search,
  cate = "",
  status = "",
  domainId = "",
  userId = "",
  query = ""
) => {
  return api.get(
    `/api/v1/posts/getPagingPostPending?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}&cate=${cate}&status=${status}&domainId=${domainId}&userId=${userId}&${query}`
  );
};
export const getExcelPostPending = (
  pageSize,
  pageIndex,
  search,
  cate = "",
  status = "",
  domainId = "",
  userId = "",
  query = ""
) => {
  return api.get(
    `/api/v1/posts/getExcelPostPending?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}&cate=${cate}&status=${status}&domainId=${domainId}&userId=${userId}&${query}`
  );
};

export const acceptPost = (id = "") => {
  return api.get(`/api/v1/posts/accept/${id}`);
};

export const rejectPost = (id = "", note) => {
  return api.update(`/api/v1/posts/reject/${id}`, { note });
};

export const getPagingPostForAdminExportExcel = (
  pageSize,
  pageIndex,
  search,
  cate = "",
  status = "",
  domainId = "",
  userId = "",
  query = ""
) => {
  return api.get(
    `/api/v1/posts/getPagingPostForAdminExportExcel?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}&cate=${cate}&status=${status}&domainId=${domainId}&userId=${userId}&${query}`
  );
};
export const getPostReported = async (
  search = "",
  pageSize = 10,
  pageIndex = 1
) =>
  api.get(
    `/api/v1/posts/getReportedPost?search=${search}&pageSize=${pageSize}&pageIndex=${pageIndex}`
  );

export const getPostReportedById = async (
  id = "",
  search = "",
  pageSize = 10,
  pageIndex = 1
) =>
  api.get(
    `/api/v1/posts/getReportedPost/${id}?search=${search}&pageSize=${pageSize}&pageIndex=${pageIndex}`
  );

export const getTrafficPost = async (id) =>
  api.get(`/api/v1/posts/getTrafficExcel/${id}`);
export const checkAuth = () => api.get(`/api/v1/users/authStatus`);
export const getPostOnlyName = () => api.get(`/api/v1/post/getOnlyName`);
export const getPostById = (id) => api.get(`${url.GET_POST_BY_ID}/${id}`);
export const getPostByStatus = (data) =>
  api.get(`${url.GET_POSTS}/getByStatus`, data);
export const getPostByStatusSlug = (data) =>
  api.get(`${url.GET_POSTS}/getBy/StatusAndSlug`, data);
export const getPostByTax = (data) =>
  api.get(`${url.GET_POSTS}/getPostByTax`, data);
export const getPostBySlug = (slug, data) =>
  api.get(`${url.GET_POST_BY_SLUG}/${slug}`, data);
export const searchPost = (limit, skip, q) =>
  api.get(`${url.GET_POSTS}/post/search?q=${q}&limit=${limit}&skip=${skip}`);
export const getRelatedPosts = () => api.get(`${url.GET_POSTS}/related`);
// export const createPost = (data) => api.create(`${url.API_POST_INSERT}`, data);
export const editPost = (id, data) =>
  api.update(`${url.API_POST_UPDATE}/${id}`, data);
export const deletePost = (id) => api.delete(`${url.API_POST_DELETE}/${id}`);
export const getAllByTax = (id, limit, skip) =>
  api.get(`${url.GET_POSTS}/getAllByTax?limit=${limit}&skip=${skip}&tax=${id}`);
export const getPostXML = () => api.get(`${url.GET_POSTS}/getPosts/sitemap`);
// pages
export const getAllPages = () => api.get(`${url.GET_PAGES}`);
export const searchPages = (data) =>
  api.get(`${url.GET_PAGES}/page/search`, data);
export const getPageById = (id) => api.get(`${url.GET_PAGES}/${id}`);
export const createPage = (data) => api.create(`${url.GET_PAGES}`, data);
export const updatePage = (data) =>
  api.update(`${url.GET_PAGES}/${data.get("id")}`, data);
export const deletePage = (id) => api.delete(`${url.GET_PAGES}/remove/${id}`);

//links
export const getAllLinks = () => api.get(`${url.GET_LINKS}/getAll`);
export const getLinkSearch = (text) =>
  api.get(`${url.GET_LINKS}/search/?q=${text}`);
export const getLinkByName = (name) =>
  api.get(`${url.GET_LINKS}/getByName/${name}`);
export const getLinkById = (id) => api.get(`${url.GET_LINKS}/getById/${id}`);
export const createLink = (data) => api.create(`${url.GET_LINKS}`, data);
export const updateLink = (id, data) =>
  api.update(`${url.GET_LINKS}/${id}`, data);
export const removeLink = (id) => api.delete(`${url.GET_LINKS}/remove/${id}`);

//google index
export const googleIndex = (link) => api.create(`${url.GOOGLEINDEX}/${link}`);
export const googleBatchIndex = (data) =>
  api.create(`${url.GOOGLEBATCHINDEX}`, data);

//banners
export const getAllBanner = (limit, skip, slug) =>
  api.get(`${url.BANNER}?limit=${limit}&skip=${skip}&slug=${slug}`);
export const getById = (id) => api.get(`${url.BANNER}/getById/${id}`);
export const getByPosition = (position) =>
  api.get(`${api.BANNER}/getByPosition/${position}`);
export const createBanner = (data) => api.create(`${url.BANNER}`, data);
export const updateBanner = (id, data) =>
  api.update(`${url.BANNER}/${id}`, data);
export const removeBanner = (id) => api.delete(`${url.BANNER}/remove/${id}`);
export const getByPage = (slug) => api.get(`${url.BANNER}/getByPage/${slug}`);

// bing index
export const bingIndex = (data) => api.create(`${url.BINGINDEX}`, data);

//statistics
export const getAllByTaxDate = (id, start, end) =>
  api.get(
    `${url.GET_POSTS}/getAllByTaxDate?tax=${id}&start=${start}&end=${end}`
  );
export const getAllByDate = (start, end, limit, skip) =>
  api.get(
    `${url.GET_POSTS}/getAllByDate?start=${start}&end=${end}&limit=${limit}&skip=${skip}`
  );
export const getMaxPosts = () => api.get(`${url.GET_POSTS}/getMax`);
export const getMinPosts = () => api.get(`${url.GET_POSTS}/getMin`);
export const getMaxUsers = () => api.get(`${url.GET_POSTS}/getMax/user`);
export const getMinUsers = () => api.get(`${url.GET_POSTS}/getMin/user`);
export const userStatistics = (start, end, limit, skip, q) =>
  api.get(
    `${url.GET_POSTS}/getStatictis/staff?start=${start}&end=${end}&limit=${limit}&skip=${skip}&q=${q}`
  );

//google analytics
export const ggAnalytics = (metrics, startDate, endDate, dimensions) =>
  api.get(
    `${url.GGANALYTICS}?metrics=${metrics}&startDate=${startDate}&endDate=${endDate}&dimensions=${dimensions}`
  );
export const ggAnalyticsGraph = (metric) =>
  api.get(`${url.GGANALYTICS}/graph?metric=${metric}`);

//Category

export const getPagingCate = (data) =>
  api.get(
    `${url.API_CATE}/getPaging?pageSize=${data.pageSize}&pageIndex=${data.pageIndex}&search=${data.search}`
  );
export const getAllCate = () => api.get(`${url.API_CATE}/getAllCate`);

export const getCateParent = () => api.get(`${url.API_CATE}/getCateParent`);
export const getCateById = (id) => {
  api.get(`${url.API_CATE}/getById/${id}`);
};
export const updateCate = (id, data) => {
  api.update(`${url.API_CATE}/update/${id}`, data);
};
export const deleteCate = (id) => {
  api.delete(`${url.API_CATE}/delete/${id}`);
};
export const insertCate = (data) => {
  api.create(`${url.API_CATE}/insert`, data);
};
//Action
//Action
export const insertAction = (data) => api.create(url.API_ACTION_INSERT, data);
export const updateAction = (id, data) =>
  api.update(`${url.API_ACTION_UPDATE}/${id}`, data);
export const deleteAction = (id, data) =>
  api.delete(`${url.API_ACTION_DELETE}/${id}`, data);
export const getAllAction = (data) => api.get(url.API_ACTION_GETALL, data);
export const getPagingAction = (data) =>
  api.get(url.API_ACTION_GET_PAGING, data);
export const getActionById = (id, data) =>
  api.get(`${url.API_ACTION_GET_PAGING_BY_ID}/${id}`, data);

//Redirect
export const insertRedirect = (data) =>
  api.create(`${url.API_REDIRECT}/create`, data);
export const updateRedirect = (id, data) =>
  api.update(`${url.API_REDIRECT}/update/${id}`, data);
export const deleteRedirect = (id, data) =>
  api.delete(`${url.API_REDIRECT}/remove/${id}`, data);
// export const getAllAction = (data) => api.get(url.API_ACTION_GETALL, data);
export const getPagingRedirect = (data) =>
  api.get(
    `${url.API_REDIRECT}/getPaging?pageSize=${data.pageSize}&pageIndex=${data.pageIndex}&search=${data.search}`
  );
//autolink
export const getAutolink = (id) => api.get(`${url.API_AUTOLINK}/${id}`);

export const insertAutolink = (data) => api.create(`${url.API_AUTOLINK}`, data);
export const updateAutolink = (id, data) =>
  api.update(`${url.API_AUTOLINK}/${id}`, data);
export const deleteAutolink = (id) =>
  api.delete(`${url.API_AUTOLINK}/remove/${id}`);
// export const getAllAction = (data) => api.get(url.API_ACTION_GETALL, data);
export const getPagingAutolink = (data) =>
  api.get(
    `${url.API_AUTOLINK}?limit=${data.pageSize}&skip=${data.pageIndex}&search=${data.search}`
  );

//domains
export const insertDomains = (data) => api.create(`${url.API_DOMAINS}`, data);

export const getpagingDomains = (pageSize, pageIndex, filter) =>
  api.get(
    `${url.API_DOMAINS}?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${filter}`
  );

export const deleteDomains = (id) =>
  api.delete(`${url.API_DOMAINS}/remove/${id}`);

export const updateDomains = (id, data) =>
  api.update(`${url.API_DOMAINS}/${id}`, data);
export const getAllDomains = () => {
  return api.get(`${url.API_DOMAINS}`);
};
// export const insertDomains = (data) => api.create(`${url.API_DOMAINS}`, data);

// export const getpagingDomains = () => api.get(`${url.API_DOMAINS}`);

//fp
export const getFP = (id) => api.get(`${url.API_FP}/getById/${id}`);
export const addFP = (body) => api.create(`${url.API_FP}/insert`, body);
export const updateFP = (id, body) =>
  api.update(`${url.API_FP}/update/${id}`, body);
export const deleteFP = (slug) => api.delete(`${url.API_FP}/delete/${slug}`);
export const searchFP = (pageSize = 10, pageIndex = 1, q = "") =>
  api.get(
    `${url.API_FP}/getPaging?search=${q}&pageSize=${pageSize}&pageIndex=${pageIndex}`
  );

//blacklist
export const getBlacklist = (data) =>
  api.get(
    `${url.API_BlackList}?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}&search=${data.search}`
  );
export const addBlacklist = (data) => api.create(`${url.API_BlackList}`, data);
export const editBlacklist = (id, data) =>
  api.update(`${url.API_BlackList}/${id}`, data);
export const removeBlacklist = (id) => api.delete(`${url.API_BlackList}/${id}`);

//whitelist
export const getWhitelist = (data) =>
  api.get(
    `${url.API_WhiteList}?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}&search=${data.search}`
  );
export const addWhitelist = (data) => api.create(`${url.API_WhiteList}`, data);
export const editWhitelist = (id, data) =>
  api.update(`${url.API_WhiteList}/${id}`, data);
export const removeWhitelist = (id) => api.delete(`${url.API_WhiteList}/${id}`);

export const addRecruit = (body) => api.create(`${url.API_RECRUIT}`, body);
export const getRecruitById = (id) =>
  api.get(`${url.API_RECRUIT}/getRecruitById/${id}`);

export const getAllRecruits = (
  pageSize = 10,
  pageIndex = 1,
  search = "",
  domain = "",
  status
) =>
  api.get(
    `${url.API_RECRUIT}/getAllRecruits?search=${search}&pageSize=${pageSize}&pageIndex=${pageIndex}&domain=${domain}&status=${status}`
  );

export const deleteRecruit = (id) => api.delete(`${url.API_RECRUIT}/${id}`);
export const updateRecruit = (id, data) =>
  api.update(`${url.API_RECRUIT}/update/${id}`, data);

//Vps-tab
export const getPagingVpsTabs = (pageSize, pageIndex, filter) =>
  api.get(
    `${url.GET_VPS_TAB}/getPaging?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${filter}`
  );
export const getAllVpsTabs = () => api.get(`${url.GET_VPS_TAB}/getAllVpsTabs`);

export const getVpsTab = (id) => api.get(`${url.GET_VPS_TAB}/${id}`);
export const addVpsTab = (body) =>
  api.create(`${url.GET_VPS_TAB}/insert`, body);
export const updateVpsTab = (id, body) =>
  api.update(`${url.GET_VPS_TAB}/update/${id}`, body);
export const deleteVpsTab = (slug) =>
  api.delete(`${url.GET_VPS_TAB}/delete/${slug}`);

//Vps
export const getPagingVps = (pageSize, pageIndex, filter) =>
  api.get(
    `${url.GET_VPS}/getPaging?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${filter}`
  );
export const getAllVps = () => api.get(`${url.GET_VPS}/getAllVpss`);

export const getVps = (id) => api.get(`${url.GET_VPS}/${id}`);
export const addVps = (body) => api.create(`${url.GET_VPS}/insert`, body);
export const updateVps = (id, body) =>
  api.update(`${url.GET_VPS}/update/${id}`, body);
export const deleteVps = (slug) => api.delete(`${url.GET_VPS}/delete/${slug}`);

//Hosting
export const getPagingHosting = (pageSize, pageIndex, filter) =>
  api.get(
    `${url.GET_HOSTING}/getPaging?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${filter}`
  );
export const getAllHosting = () => api.get(`${url.GET_HOSTING}/getAllHostings`);

export const getHosting = (id) => api.get(`${url.GET_HOSTING}/${id}`);
export const addHosting = (body) =>
  api.create(`${url.GET_HOSTING}/insert`, body);
export const updateHosting = (id, body) =>
  api.update(`${url.GET_HOSTING}/update/${id}`, body);
export const deleteHosting = (slug) =>
  api.delete(`${url.GET_HOSTING}/delete/${slug}`);

//Seo
export const addSeo = (body) => api.create(`${url.API_SEO}`, body);
export const getSeoById = (id) => api.get(`${url.API_RECRUIT}/${id}`);

export const getAllSeo = (
  pageSize = 10,
  pageIndex = 1,
  search = "",
  domain = ""
) =>
  api.get(
    `${url.API_SEO}/getAllSeo?search=${search}&pageSize=${pageSize}&pageIndex=${pageIndex}&domain=${domain}`
  );

export const deleteSeo = (id) => api.delete(`${url.API_SEO}/${id}`);
export const updateSeo = (id, data) =>
  api.update(`${url.API_SEO}/update/${id}`, data);

export const createPost = async (data) => {
  const res = await api.create(`api/v1/posts/createPost`, data);
  return res.data.data;
};
export const deleteMultiPost = async (data) => {
  const res = await api.create(`api/v1/posts/deleteMultiPost`, {
    postIds: data,
  });
  return res.data;
};
export const updatePost = async (id, data) => {
  const res = await api.create(`api/v1/posts/editPost/${id}`, data);
  return res.data;
};

export const updatePostHome = async (data) => {
  const res = await api.update(`api/v1/postHome`, data);
  return res.data;
};

export const getPostHome = async () => {
  const res = await api.get(`api/v1/postHome`);
  return res;
};

export const updateNotification = async (data) => {
  const res = await api.update(`api/v1/notificationHome`, data);
  return res.data;
};

export const getNotification = async () => {
  const res = await api.get(`api/v1/notificationHome`);
  return res;
};

//dieukhoan

export const updateDieuKhoan = async (data) => {
  const res = await api.update(`api/v1/dieukhoan`, data);
  return res.data;
};

export const getDieuKhoan = async () => {
  const res = await api.get(`api/v1/dieukhoan`);
  return res;
};
//end

//dieu kien

export const updateDieuKien = async (data) => {
  const res = await api.update(`api/v1/dieukien`, data);
  return res.data;
};

export const getDieuKien = async () => {
  const res = await api.get(`api/v1/dieukien`);
  return res;
};
export const getNotificationReferral = async () => {
  const res = await api.get(`api/v1/notificationReferral`);
  return res;
};

export const updateNotificationReferral = async (data) => {
  const res = await api.update(`api/v1/notificationReferral`, data);
  return res.data;
};

//end
export const activeAllPost = async () => {
  const res = await api.create(`api/v1/posts/updateActiveAll`);
  return res.data.data;
};

export const activeListPost = async (ids) => {
  const res = await api.create(`api/v1/posts/updateListPostActive`, { ids });
  return res.data.data;
};

export const getAllMessage = async (
  search = "",
  userId = "",
  pageSize = 10,
  pageIndex = 1
) => {
  const res = await api.get(
    `api/v1/chat/getMessages?search=${search}&user=${userId}&pageSize=${pageSize}&pageIndex=${pageIndex}`
  );
  return res?.data;
};
export const deleteMessage = async (id) => {
  const res = await api.delete(`api/v1/chat/deleteMessage/${id}`);
  return res.data;
};

export const getLogs = async (data) => {
  const res = await api.get(
    `api/v1/log/get-log?pageSize=${data?.pageSize}&pageIndex=${data?.pageIndex}&user=${data?.user}&date=${data?.date}`
  );
  return res?.result;
};

export const editUser = async (id, data) => {
  const res = await api.create(`api/v1/users/editUser/${id}`, data);
  return res;
};

export const DeleteRecordBlockUser = async (id) => {
  const res = await api.delete(`api/v1/users/deleteRecordBlockUser/${id}`);
  return res?.result;
};

export const upgradePoint = async (id, data) => {
  const res = await api.create(`api/v1/users/upgradePoint/${id}`, data);
  return res?.result;
};
export const addUser = async (data) => {
  const res = await api.create(`api/v1/users/addUser`, data);
  return res?.data;
};

export const enableUpPostUser = async (data) => {
  const res = await api.update(`api/v1/users/enableUpPostUser`, data);
  return res?.data;
};

export const disableUpPostUser = async (data) => {
  const res = await api.update(`api/v1/users/disableUpPostUser`, data);
  return res?.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`api/v1/users/deleteUser/${id}`);
  return res?.data;
};

/// brand
export const getPagingBrand = async (
  search = "",
  pageSize = 10,
  pageIndex = 1,
  sort = "createdAt"
) => {
  const res = await api.get(
    `api/v1/brand?search=${search}&pageSize=${pageSize}&pageIndex=${pageIndex}&sort=${sort}`
  );
  return res;
};

export const getBrandById = async (id) => {
  const res = await api.get(`api/v1/brand/${id}`);
  return res?.data;
};
export const createdBrand = async (data) => {
  const res = await api.create(`api/v1/brand/`, data);
  return res?.data;
};
export const updateBrandById = async (id, data) => {
  const res = await api.update(`api/v1/brand/${id}`, data);
  return res?.data;
};

export const deleteBrand = async (id) => {
  const res = await api.delete(`api/v1/brand/${id}`);
  return res?.data;
};

//team

export const getPagingTeam = async (
  search = "",
  pageSize = 10,
  pageIndex = 1,
  sort = "createdAt"
) => {
  const res = await api.get(
    `api/v1/team?search=${search}&pageSize=${pageSize}&pageIndex=${pageIndex}&sort=${sort}`
  );
  return res;
};

export const getTeamById = async (id) => {
  const res = await api.get(`api/v1/team/${id}`);
  return res?.data;
};
export const createdTeam = async (data) => {
  const res = await api.create(`api/v1/team/`, data);
  return res?.data;
};
export const updateTeamById = async (id, data) => {
  const res = await api.update(`api/v1/team/${id}`, data);
  return res?.data;
};

export const deleteTeam = async (id) => {
  const res = await api.delete(`api/v1/team/${id}`);
  return res?.data;
};

//payment

export const getPayments = async (
  user = "",
  pageSize = 10,
  pageIndex = 1,
  query = ""
) => {
  const res = await api.get(
    `api/v1/payment/admin?user=${user}&pageSize=${pageSize}&pageIndex=${pageIndex}&${query}`
  );
  return res;
};

export const getReportPayment = async (query = "") => {
  const res = await api.get(`api/v1/payment/reportPayment?${query}`);
  return res;
};

export const getPaymentsExportExcel = async (
  user = "",
  pageSize = 10000000,
  pageIndex = 1,
  query = ""
) => {
  const res = await api.get(
    `api/v1/payment/getPaymentsExportExcel?user=${user}&pageSize=${pageSize}&pageIndex=${pageIndex}&${query}`
  );
  return res;
};

export const getPagingPostUserId = async ({
  id,
  search,
  status,
  pageSize,
  pageIndex,
  query = "",
}) => {
  const res = await api.get(
    `api/v1/posts/getPagingUser/${id}?search=${search}&status=${status}&pageSize=${pageSize}&pageIndex=${pageIndex}&${query}`
  );
  return res;
};

export const getPagingPostForUserExportExcelById = async ({
  id,
  search,
  status,
  pageSize,
  pageIndex,
  query = "",
}) => {
  const res = await api.get(
    `api/v1/posts/getPagingPostForUserExportExcel/${id}?search=${search}&status=${status}&pageSize=${pageSize}&pageIndex=${pageIndex}&${query}`
  );
  return res;
};
export const countMoneyPayment = async (query = "") => {
  const res = await api.get(`api/v1/payment/countMoneyPayment?${query}`);
  return res?.data;
};

export const createPayment = async (data) => {
  const res = await api.create(`api/v1/payment`, data);
  return res?.data;
};

export const updatePayment = async (id, data) => {
  const res = await api.update(`api/v1/payment/${id}`, data);
  return res?.data;
};

export const rejectedPayment = async (id, data) => {
  const res = await api.update(`api/v1/payment/rejectPayment/${id}`, data);
  return res?.data;
};

export const deletePayment = async (id) => {
  const res = await api.delete(`api/v1/payment/${id}`);
  return res?.data;
};

export const getPointLogs = async (data) => {
  const res = await api.get(
    `api/v1/log/getPointLogAdmin?pageSize=${data?.pageSize}&pageIndex=${data?.pageIndex}&user=${data?.user}&date=${data?.date}&startDate=${data?.startDate}&endDate=${data?.endDate}`
  );
  return res;
};

export const getTopUser = async (data) => {
  const res = await api.get(
    `api/v1/log/getTopUser?startDate=${data?.startDate}&endDate=${data?.endDate}`
  );
  return res;
};

export const getPointLogsMiddlePayment = async (data) => {
  const res = await api.get(
    `api/v1/log/getPointLogAdminMiddlePayment?pageSize=${data?.pageSize}&pageIndex=${data?.pageIndex}&user=${data?.user}&date=${data?.date}&startDate=${data?.startDate}&endDate=${data?.endDate}&id=${data?.id}`
  );
  return res;
};

export const getPagingPointLogAdminMiddle2PaymentExcel = async (data) => {
  const res = await api.get(
    `api/v1/log/getPagingPointLogAdminMiddle2PaymentExcel?pageSize=${data?.pageSize}&pageIndex=${data?.pageIndex}&user=${data?.user}&date=${data?.date}&startDate=${data?.startDate}&endDate=${data?.endDate}&id=${data?.id}`
  );
  return res;
};

export const getMaxPayment = async () => {
  const res = await api.get(`api/v1/other/getMaxPayment`);
  return res.data;
};

export const updateMaxPayment = async (data) => {
  const res = await api.update(`api/v1/other/updateMaxPayment`, data);
  return res.data;
};

export const getIpLoginAdmin = async () => {
  const res = await api.get(`api/v1/other/ipLogin`);
  return res.data;
};

export const updateIpLoginAdmin = async (data) => {
  const res = await api.update(`api/v1/other/ipLogin`, data);
  return res.data;
};

export const getStatusMission = async () => {
  const res = await api.get(`api/v1/other/mission`);
  return res.data;
};

export const updateStatusMission = async (data) => {
  const res = await api.update(`api/v1/other/mission`, data);
  return res.data;
};

//config index search

export const getIndexSearch = async () => {
  const res = await api.get(`api/v1/other/indexSearch`);
  return res.data;
};

export const updateIndexSearch = async (data) => {
  const res = await api.update(`api/v1/other/indexSearch`, data);
  return res;
};

//

export const getMaxAccountIP = async () => {
  const res = await api.get(`api/v1/other/maxAccountIP`);
  return res.data;
};

export const updateMaxAccountIP = async (data) => {
  const res = await api.update(`api/v1/other/maxAccountIP`, data);
  return res;
};

export const getLinkHelp = async () => {
  const res = await api.get(`api/v1/other/linkHelp`);
  return res.data;
};

export const updateLinkHelp = async (data) => {
  const res = await api.update(`api/v1/other/linkHelp`, data);
  return res;
};
export const getQuantityResetPost = async () => {
  const res = await api.get(`api/v1/other/getQuantityResetPost`);
  return res.data;
};

export const updateQuantityResetPost = async (data) => {
  const res = await api.update(`api/v1/other/updateQuantityResetPost`, data);
  return res.data;
};

//upload
export const uploadImage = async (data) => {
  const dataJson = sessionStorage?.getItem("authUser");
  const token = JSON.parse(dataJson || "null")
    ? JSON.parse(dataJson || "null")?.accessToken
    : null;
  const res = await axios.post(`api/v1/upload`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

//end upload
const urlPermission = `${process.env.REACT_APP_API_URL}/api/v1/permission`;

export const getPermissionByRole = async (role = "") => {
  return api.get(`${urlPermission}/getByRole?role=${role}`);
};

export const getMyPermission = async () => {
  return api.get(`${urlPermission}/getMyPermission`);
};

export const createPermission = (data) => api.create(`${urlPermission}`, data);
export const deletePermission = (id) => api.delete(`${urlPermission}/${id}`);
export const editPermission = (id, data) =>
  api.update(`${urlPermission}/${id}`, data);

// info payment
export const getInfoPaymentByUserId = async (userId) => {
  const res = await api.get(`api/v1/infoPayment/get-by-user-id/${userId}`);
  return res.data;
};

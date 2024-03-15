//permission

export const GET_ALL_PERMISSION = "/api/v1/permission/getPermissions";

//Roles
export const GET_ALL_ROLES = "/api/v1/role/getAllRole";
export const EDIT_ROLE_PERMISSION = "/api/v1/role/editRolePermission";

export const ADD_NEW_ROLES = "/api/v1/role/createRole";
export const DELETE_ROLES = "/api/v1/role";
export const UPDATE_ROLES = "/api/v1/role/editRole";

//REGISTER
export const POST_FAKE_REGISTER = "/auth/signup";

//LOGIN
export const POST_FAKE_LOGIN = "/auth/signin";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/auth/forgot-password";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";
export const API_USER_LOGIN = "/api/v1/users/login";

//login
export const POST_AUTHENTICATE = "/api/v1/users/authenticate";

//BUNNY
export const URL_IMAGE_BUNNY = "https://agency88.b-cdn.net/";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/api/v1/user";

//user
export const GET_USERS = "/api/v1/users/getUsers";
// export const ADD_USERS = "/signup";
// export const DELETE_USER = "/api/v1/users/delete";
export const SEARCH_USER = "/api/v1/user/searchUser";

export const GET_USER_PERMISSION = "/api/v1/users/user/permission";
// faqs
export const GET_FAQS = "/api/v1/faqs";

export const GET_POSTS = "/api/v1/posts/admin";
export const GET_POST_BY_SLUG = "/api/v1/posts";
export const GET_POST_BY_ID = "/api/v1/posts/getById";
export const GET_SCHEMAS = "/api/v1/schema";
export const GET_TAXONOMYS = "/api/v1/taxonomy";
export const GET_TAGS = "/api/v1/tag";
export const GET_PAGES = "/api/v1/pages";
// export const GET_CATE = "/api/v1/tag";

export const GET_TAXANOMY = "/api/v1/taxanomy";

//Links
export const GET_LINKS = "/api/v1/linkFooters";

//Google index
export const GOOGLEINDEX = "api/google/index"; //param
export const GOOGLEBATCHINDEX = "api/google/batchIndex"; // body

//Banner
export const BANNER = "api/banners";

//Bing index
export const BINGINDEX = "api/bing/index";

//Google Analytics
export const GGANALYTICS = "api/ggAnalytics";

//Action
export const API_ACTION_INSERT = "/api/v1/action/insert";
export const API_ACTION_UPDATE = "/api/v1/action/update";
export const API_ACTION_DELETE = "/api/v1/action/delete";
export const API_ACTION_GETALL = "/api/v1/action/getAll";
export const API_ACTION_GET_PAGING = "/api/v1/action/getPaging";
export const API_ACTION_GET_PAGING_BY_ID = "/api/v1/action/getById";

//POSTS
export const API_POST_INSERT = "/api/v1/posts";
export const API_POST_UPDATE = "/api/v1/posts/update";
export const API_POST_DELETE = "/api/v1/posts/deletePost";

//Category
export const GET_CATES = "/api/v1/category";
export const API_CATE = "/api/v1/category";

//redirect
export const API_REDIRECT = "/api/v1/redirect";
export const API_AUTOLINK = "/api/v1/autolink";

//domains
export const API_DOMAINS = "/api/v1/domains";
//tag
export const API_TAGS = "/api/v1/tag";

//fp
export const API_FP = "/api/v1/fp";

//
export const API_BlackList = "/api/v1/blacklist";
export const API_WhiteList = "/api/v1/whitelist";

//recruit
export const API_RECRUIT = "/api/v1/recruits";

//Vps-tab
export const GET_VPS_TAB = "/api/v1/vpsTab";

//Vps-tab
export const GET_VPS = "/api/v1/vps";

//Hosting
export const GET_HOSTING = "/api/v1/hosting";

//seo
export const API_SEO = "/api/v1/seo";

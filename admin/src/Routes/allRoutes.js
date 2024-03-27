import React from "react";
import { Redirect } from "react-router-dom";

//pages
import DashboardAnalytics from "../pages/DashboardAnalytics";
// import Starter from "../pages/Pages/Starter/Starter";

//login
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";

//users management
import UsersManagement from "../pages/Users/UsersManagement";
import UsersPermission from "../pages/Users/UsersPermission";
import FaqsList from "../pages/Faqs/FaqsList";
import FooterList from "../pages/Footer/index";
import FaqsDetail from "../pages/Faqs/FaqsDetail";
import UserDetail from "../pages/Users/UserDetail";
import SchemaList from "../pages/Schema/SchemaList";
import PageList from "../pages/pagesManagement/PageList";
import PageDetail from "../pages/pagesManagement/PageDetail";
import CreateEditPage from "../pages/pagesManagement/CreateEditPage";
import SchemaDetail from "../pages/Schema/SchemaDetail";
import AddUser from "../pages/Users/AddUser";
import TaxonomyList from "../pages/Taxanomy/TaxonomyList";
import TagsList from "../pages/Taxanomy/TagsList";
import CategoriesList from "../pages/Taxanomy/CategoriesList";
import TaxonomyDetail from "../pages/Taxanomy/TaxonomyDetail";
import AddTaxonomy from "../pages/Taxanomy/AddTaxonomy";
import PostList from "../pages/Posts/PostList";
import CreateEditPost from "../pages/Posts/CreateEditPost";
import PostDetail from "../pages/Posts/PostDetail";
import LinksList from "../pages/Links/LinksList";
import LinksDetail from "../pages/Links/LinksDetail";
import MediaList from "../pages/Media/MediaList";
import BannersList from "../pages/Banners/BannersList";
import PostStatisitcs from "../pages/Statistics/PostStatistics";
import UserStatistics from "../pages/Statistics/UserStatistics";
import UserProfile from "../pages/Authentication/user-profile";
import CategoryController from "../pages/CategoryController";
import Roles from "../pages/Roles/Roles";
import RedirectList from "../pages/Redirects";
import Autolink from "../pages/AutoLink";
import Domains from "../pages/Domains";
import FPList from "../pages/FP/FPList";
import Blacklist from "../pages/Blacklist";
import Whitelist from "../pages/Whitelist";
import Maintenance from "../pages/Maintenance";
import RecruitList from "../pages/Recruit/RecruitList";
import AddRecruit from "../pages/Recruit/AddRecruit";
import VpsList from "../pages/Vps/VpsList";
import VpsTabList from "../pages/Vps/tab/VpsTabList";
import HostingList from "../pages/Hosting/HostingList";
import SeoList from "../pages/Seo/SeoList";
import LogsManager from "../pages/LogPage";
import PointLogs from "../pages/PointLogs";
import MessageManager from "../pages/MessageManager";
import PostReported from "../pages/Posts/PostReported";
import RequirePayment from "../pages/RequirePayment";
import PostHome from "../pages/PostHome";
import NotificationHome from "../pages/NotificationHome";
import DieuKhoanPage from "../pages/DieuKhoanPage";
import DieuKienPage from "../pages/DieuKienPage";
import NotificationReferralPage from "../pages/NotificationReferral";
import ConfigPayment from "../pages/ConfigPayment";
import ConfigPost from "../pages/ConfigPost";
import UserBlock from "../pages/UserBlockByFP";
import BrandManagement from "../pages/Brand";
import Permission from "../pages/Permission";
import ConfigIpAdminLogin from "../pages/ConfigIpAdminLogin";
import { TwoFactor } from "../pages/2FA";
import NotFoundPage from "../pages/NotFound";
import ConfigMission from "../pages/ConfigMission";
import ConfigIndexSearch from "../pages/ConfigIndexSearch";
import ConfigAccountByIP from "../pages/ConfigAccountByIP";
import ReportPayment from "../pages/ReportPayment";
import TeamManagement from "../pages/Team";
import Register from "../pages/Authentication/Register";
import PostPending from "../pages/Posts/PostPending";
import ConfigLink from "../pages/ConfigLink";
const authProtectedRoutes = [
  // { path: "/pages-starter", component: Starter },
  { path: "/dashboard", component: DashboardAnalytics },
  { path: "/users", component: UsersManagement },
  { path: "/brand", component: BrandManagement },
  { path: "/permission", component: Permission },
  { path: "/user/add/:id", component: AddUser },
  { path: "/users/:id", component: UserDetail },
  { path: "/user-block", component: UserBlock },
  { path: "/profile", component: UserProfile },
  { path: "/footer", component: FooterList },
  { path: "/faqs/:id", component: FaqsDetail },
  { path: "/schemas", component: SchemaList },
  { path: "/schemas/:id", component: SchemaDetail },
  { path: "/redirect", component: RedirectList },
  { path: "/autolink", component: Autolink },
  { path: "/fp", component: FPList },
  { path: "/notification-home", component: NotificationHome },
  { path: "/domains", component: Domains },
  { path: "/config-link", component: ConfigLink },
  {
    path: "/cate-management",
    component: CategoryController,
  },
  {
    path: "/roles",
    component: Roles,
  },
  {
    path: "/team",
    component: TeamManagement,
  },
  // {
  //   path: "/pages-management/create",
  //   component: CreateEditPage,
  // },
  // {
  //   path: "/pages-management/:id",
  //   component: PageDetail,
  // },
  // {
  //   path: "/pages-management/edit/:id",
  //   component: CreateEditPage,
  // },
  {
    path: "/posts",
    component: PostList,
  },
  {
    path: "/post-home",
    component: PostHome,
  },
  {
    path: "/posts-resport",
    component: PostReported,
  },
  {
    path: "/configPost",
    component: ConfigPost,
  },
  {
    path: "/posts/create",
    component: CreateEditPost,
  },
  {
    path: "/dieukhoan",
    component: DieuKhoanPage,
  },
  {
    path: "/notificationReferral",
    component: NotificationReferralPage,
  },
  {
    path: "/dieukien",
    component: DieuKienPage,
  },
  {
    path: "/posts/:id",
    component: PostDetail,
  },
  {
    path: "/messages",
    component: MessageManager,
  },
  {
    path: "/posts/edit/:slug",
    component: CreateEditPost,
  },

  {
    path: "/links",
    component: LinksList,
  },
  {
    path: "/links/:id",
    component: LinksDetail,
  },

  {
    path: "/post-statistics",
    component: PostStatisitcs,
  },
  {
    path: "/user-statistics",
    component: UserStatistics,
  },
  {
    path: "/logs",
    component: LogsManager,
  },
  {
    path: "/pointLogs",
    component: PointLogs,
  },
  {
    path: "/tags",
    component: TagsList,
  },
  {
    path: "/blacklist",
    component: Blacklist,
  },
  {
    path: "/whitelist",
    component: Whitelist,
  },
  {
    path: "/categories",
    component: CategoriesList,
  },

  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/dashboard" />,
  },
  {
    path: "/maintenance",
    component: Maintenance,
  },
  {
    path: "/requirePayment",
    component: RequirePayment,
  },
  {
    path: "/configPayment",
    component: ConfigPayment,
  },
  {
    path: "/configIpAdminLogin",
    component: ConfigIpAdminLogin,
  },
  {
    path: "/configMission",
    component: ConfigMission,
  },
  {
    path: "/configIndexSearch",
    component: ConfigIndexSearch,
  },
  {
    path: "/configAccountIP",
    component: ConfigAccountByIP,
  },
  {
    path: "/postPending",
    component: PostPending,
  },
  {
    path: "/reportPayment",
    component: ReportPayment,
  },

  {
    path: "/seo",
    component: SeoList,
  },
  // {
  //   path: "/seo/create",
  //   component: AddRecruit,
  // },
];

const publicRoutes = [
  // Authentication Page
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/logout", component: Logout },
  { path: "/verify2FA", component: TwoFactor },
  // { path: "/*", component: NotFoundPage },
  // {
  //   path: "/pages-management",
  //   component: PageList
  // },
  // {
  //   path: "/pages-management/create",
  //   component: CreateEditPage
  // },
  // {
  //   path: "/pages-management/edit/:id",
  //   component: CreateEditPage
  // },
  // {
  //   path: "/pages-management/:id",
  //   component: PageDetail
  // },
  // Users management
];

export { authProtectedRoutes, publicRoutes };

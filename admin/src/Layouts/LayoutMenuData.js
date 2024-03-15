import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Navdata = () => {
  const history = useHistory();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isUsers, setIsUsers] = useState(false);
  const [isFAQs, setIsFAQs] = useState(false);
  const [isSchemas, setIsSchemas] = useState(false);
  const [isTaxonomy, setIsTaxonomy] = useState(false);
  const [isRoles, setIsRoles] = useState(false);
  const [isLogs, setIsLogs] = useState(false);
  const [isAdmins, setIsAdmins] = useState(false);
  const [isCates, setisCates] = useState(false);
  const [isPosts, setIsPosts] = useState(false);
  const [isLinks, setIsLinks] = useState(false);
  const [isMedia, setIsMedia] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  const [isBanners, setIsBanners] = useState(false);
  const [isStatistics, setIsStatistics] = useState(false);
  const [isDomains, setIsDomains] = useState(false);
  const [iscurrentState, setIscurrentState] = useState("Dashboard");
  const [isAutoLink, setIsAutoLink] = useState(false);
  const [isFP, setIsFP] = useState(false);
  const [isBlacklist, setIsBlackList] = useState(false);
  const [isWhitelist, setIsWhitelist] = useState(false);
  const [isService, setIsService] = useState(false);
  const [isSeo, setIsSeo] = useState(false);
  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }
  //
  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Users") {
      setIsUsers(false);
    }
    if (iscurrentState !== "FAQs") {
      setIsFAQs(false);
    }
    if (iscurrentState !== "Schemas") {
      setIsSchemas(false);
    }
    if (iscurrentState !== "Taxonomy") {
      setIsTaxonomy(false);
    }
    if (iscurrentState !== "Categorys") {
      setisCates(false);
    }
    if (iscurrentState !== "Posts") {
      setIsPosts(false);
    }
    if (iscurrentState !== "Links") {
      setIsLinks(false);
    }
    if (iscurrentState !== "Media") {
      setIsMedia(false);
    }
    if (iscurrentState !== "Banners") {
      setIsBanners(false);
    }
    if (iscurrentState !== "Statistics") {
      setIsStatistics(false);
    }
    if (iscurrentState !== "Redirects") {
      setIsRedirect(false);
    }
    if (iscurrentState !== "Autolinks") {
      setIsAutoLink(false);
    }
    if (iscurrentState !== "Domains") {
      setIsDomains(false);
    }
    if (iscurrentState !== "FP") {
      setIsFP(false);
    }
    if (iscurrentState !== "Blacklist") {
      setIsBlackList(false);
    }
    if (iscurrentState !== "Whitelist") {
      setIsWhitelist(false);
    }
    if (iscurrentState !== "Service") {
      setIsService(false);
    }
    if (iscurrentState !== "Seo") {
      setIsSeo(false);
    }
    if (iscurrentState !== "Logs") {
      setIsLogs(false);
    }
    if (iscurrentState !== "Admins") {
      setIsAdmins(false);
    }
    if (iscurrentState !== "Roles") {
      setIsRoles(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isUsers,
    isFAQs,
    isSchemas,
    isTaxonomy,
    isCates,
    isLinks,
    isMedia,
    isBanners,
    isStatistics,
    isRedirect,
    isAutoLink,
    isDomains,
    isBlacklist,
    isWhitelist,
    isSeo,
    isLogs,
    isRoles,
    isAdmins,
  ]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "BẢNG ĐIỀU KHIỂN",
      icon: "ri-dashboard-2-line",
      link: "/#",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "users",
      label: "QUẢN LÝ THÀNH VIÊN",
      icon: "ri-user-2-line",
      link: "/#",
      permission: "user",
      stateVariables: isUsers,
      click: function (e) {
        e.preventDefault();
        setIsUsers(!isUsers);
        setIscurrentState("Users");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "user-management",
          label: "Thành Viên",
          permission: "admin",
          link: "/users",
          parentId: "users",
        },
        {
          id: "user-block",
          permission: "admin",
          label: "Thành Viên Bị Khóa",
          link: "/user-block",
          parentId: "users",
        },
        {
          id: "permission",
          permission: "admin",
          label: "Phân quyền người dùng",
          link: "/permission",
          parentId: "users",
        },
        {
          id: "roles",
          permission: "admin",
          label: "Danh sách các role",
          link: "/roles",
          parentId: "users",
        },
      ],
    },
    {
      id: "brand",
      label: "TEAM & BRAND",
      icon: "ri-archive-line",
      link: "/#",
      permission: "brand",
      stateVariables: isFP,
      click: function (e) {
        e.preventDefault();
        setIsFP(!isFP);
        setIscurrentState("FP");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "fp-management",
          label: "Danh sách brand",
          link: "/brand",
          parentId: "brand",
        },
        {
          id: "team-management",
          label: "Danh sách team",
          link: "/team",
          parentId: "brand",
        },
      ],
    },
    {
      id: "schema-management",
      label: "QUẢN LÝ RÚT TIỀN",
      permission: "payment",
      icon: "ri-bookmark-line",
      link: "/#",
      stateVariables: isSchemas,
      click: function (e) {
        e.preventDefault();
        setIsSchemas(!isSchemas);
        setIscurrentState("Schemas");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "requirePayment",
          label: "Danh sách yêu cầu rút tiền",
          permission: "admin,troly,superAdmin",
          link: "/requirePayment",
          parentId: "schema-management",
        },
        {
          id: "reportPayment",
          label: "Thống kê thanh toán",
          link: "/reportPayment",
          parentId: "schema-management",
        },
        {
          id: "configPayment",
          permission: "admin",
          label: "Cấu hình số lần rút tiền",
          link: "/configPayment",
          parentId: "schema-management",
        },
      ],
    },
    {
      id: "roles",
      label: "QUẢN LÝ TIN NHẮN",
      permission: "message",
      icon: "ri-user-2-line",
      link: "/#",
      stateVariables: isRoles,
      click: function (e) {
        e.preventDefault();
        setIsRoles(!isRoles);
        setIscurrentState("Roles");
      },
      subItems: [
        {
          id: "roles-management",
          label: "Tin Nhắn",
          link: "/messages",
          parentId: "roles",
        },
      ],
    },

    {
      id: "post-management",
      label: "QUẢN LÝ BÀI VIẾT",
      permission: "post",
      icon: "ri-archive-line",
      link: "/#",
      stateVariables: isPosts,
      click: function (e) {
        e.preventDefault();
        setIsPosts(!isPosts);
        setIscurrentState("Posts");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "posts",
          label: "Tất Cả Bài Viết",
          link: "/posts",
          parentId: "post-management",
        },
        {
          id: "posts",
          label: "Bài viết đang chờ duyệt",
          link: "/postPending",
          parentId: "post-management",
          permission: "leader,troly,admin,superAdmin",
        },
        {
          id: "configPost",
          permission: "admin",
          label: "Cấu hình xoay vòng bài viết",
          link: "/configPost",
          parentId: "post-management",
        },
        {
          id: "posts-resport",
          label: "Bài Viết Cảnh Báo",
          link: "/posts-resport",
          parentId: "post-management",
        },
        {
          id: "post-home",
          label: "Bài Viết Trang Chủ",
          permission: "admin",
          link: "/post-home",
          parentId: "post-management",
        },
        {
          id: "notification-home",
          permission: "admin",
          label: "Thông Báo Trang Chủ",
          link: "/notification-home",
          parentId: "post-management",
        },
        {
          id: "dieukhoan",
          permission: "admin",
          label: "Điều Khoản Rút Tiền",
          link: "/dieukhoan",
          parentId: "post-management",
        },
        {
          id: "dieukien",
          label: "Điều Kiện Rút Tiền",
          permission: "admin",
          link: "/dieukien",
          parentId: "post-management",
        },
        {
          id: "notificationReferral",
          permission: "admin",
          label: "Giới thiệu nhận hoa hồng",
          link: "/notificationReferral",
          parentId: "post-management",
        },
        {
          id: "configYoutube",
          permission: "admin",
          label: "Link hướng dẫn sử dụng",
          link: "/config-link",
          parentId: "post-management",
        },
      ],
    },
    {
      id: "logs",
      label: "QUẢN LÝ LOGS",
      permission: "log",
      icon: "ri-user-2-line",
      link: "/#",
      stateVariables: isLogs,
      click: function (e) {
        e.preventDefault();
        setIsLogs(!isLogs);
        setIscurrentState("Logs");
      },
      subItems: [
        {
          id: "logs-management",
          label: "Logs",
          link: "/logs",
          parentId: "logs",
        },
        {
          id: "point-logs-management",
          label: "Điểm",
          link: "/pointLogs",
          parentId: "logs",
        },
      ],
    },
    {
      id: "admins",
      label: "QUẢN LÝ ADMIN",
      permission: "superAdmin",
      icon: "ri-pages-line",
      link: "/#",
      stateVariables: isAdmins,
      click: function (e) {
        e.preventDefault();
        setIsAdmins(!isAdmins);
        setIscurrentState("Admins");
      },
      subItems: [
        {
          id: "config-ip-admin",
          label: "Cấu hình IP Admin",
          link: "/configIpAdminLogin",
          parentId: "admins",
        },
        {
          id: "config-mission-admin",
          label: "Cấu hình nhiệm vụ",
          link: "/configMission",
          parentId: "admins",
        },
        {
          id: "config-mission-admin",
          label: "Cấu hình index search",
          link: "/configIndexSearch",
          parentId: "admins",
        },
        {
          id: "config-account-ip-admin",
          label: "Cấu hình số account ip",
          link: "/configAccountIP",
          parentId: "admins",
        },
      ],
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;

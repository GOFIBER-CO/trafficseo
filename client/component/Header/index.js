import React, { memo, useContext, useEffect, useState } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import { FaPlay, FaStop } from "react-icons/fa";
import { IoNotifications, IoLogOutOutline, IoPlay } from "react-icons/io5";
import { RiNotification3Fill } from "react-icons/ri";
import { AiFillNotification, AiOutlineExclamationCircle } from "react-icons/ai";
import { AuthContext } from "@/context/AuthContext";
import { convertParamsToQueryString } from "@/helper/tools";
import {
  getIndexSearch,
  getPaginatedPosts,
  pullAllPost,
  runningPost,
} from "@/api/post";
import { Modal } from "antd";
import { startMission, stopMission } from "@/api/auth";
import { toast } from "react-toastify";
import { openUrl } from "@/common/openUrl";
import { getInstance } from "@/helper/axios";
import { MdNotificationsActive } from "react-icons/md";
import { SocketContext } from "@/context/SocketContext";
import {
  getPaymentsNotificationUser,
  getRequest,
  getStatusMission,
} from "@/api/profile";

let timmerId;
export default memo(function Header() {
  const { user, logout, getLoggedinUser } = useContext(AuthContext);
  const [mappedLink, setMappedLink] = useState("");
  const [modal, contextHolder] = Modal.useModal();
  const socket = useContext(SocketContext);
  const [postId, setPostId] = useState("");
  const [indexSearch, setIndexSearch] = useState(40);
  // const [isStart, setIsStart] = useState(user?.isMission);
  const [isStart, setIsStart] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [indexPost, setIndexPost] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [listPost, setListPost] = useState([]);
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState();
  const [checkVersion, setCheckVersion] = useState(false);
  const getPayments = async () => {
    const data = await getPaymentsNotificationUser();
    setPayments(data?.data);
  };
  const getStatusMissionData = async () => {
    const data = await getStatusMission();
    setStatus(data?.data?.status || false);
  };
  useEffect(() => {
    socket?.on("newPayment", (data) => {
      getPayments();
    });
    socket?.on("updateMission", (data) => {
      getStatusMissionData();
    });
    return () => socket?.removeAllListeners();
  }, [socket]);

  const getIndex = async () => {
    const result = await getIndexSearch();
    setIndexSearch(result?.data?.index);
  };
  const pullPost = async () => {
    const result = await pullAllPost();
    return result;
  };
  useEffect(() => {
    const handleEvent = async () => {
      clearTimeout(timmerId);
      timmerId = setTimeout(() => {
        setIndexPost((data) => data + 1);
      }, 2000);
    };
    document.addEventListener("openNewUrl", handleEvent);
    const handleEventVersion = (data) => {
      clearTimeout(timmerId);
      timmerId = setTimeout(() => {
        setCheckVersion(data?.detail?.currentVersion === "10101000");
      }, 500);
    };
    document.addEventListener("versionExtention", handleEventVersion);
    // return () => {
    //   document?.removeEventListener("openNewUrl", handleEvent);
    //   document?.removeEventListener("versionExtention", handleEventVersion);
    // };
  }, []);
  const getInitalPost = async () => {
    const checkTotalPost = await getPaginatedPosts(10, 1);
    setListPost(checkTotalPost?.data);
    setTotalPage(checkTotalPost?.totalPages);
  };
  useEffect(() => {
    getInitalPost();
    getPayments();
    getStatusMissionData();
    getIndex();
  }, []);

  const runPost = async () => {
    console.log(listPost[indexPost]?._id, typeof listPost[indexPost]?._id);
    if (
      listPost[indexPost] &&
      listPost[indexPost]?._id &&
      listPost[indexPost]?._id !== undefined &&
      typeof listPost[indexPost]?._id !== "undefined"
    ) {
      await pullPost();
      const checkPost = await runningPost(listPost[indexPost]?._id);

      if (checkPost?.status === 1) {
        getIndex();
        const getPost = async () => {
          const newPageIndex = pageIndex + 1;
          if (newPageIndex <= totalPage) {
            const checkTotalPost = await getPaginatedPosts(10, newPageIndex);
            setIndexPost((data) => data + 1);
            setPageIndex(newPageIndex);
            setListPost((data) => [...data, ...checkTotalPost.data]);
          } else {
            if (listPost.length === 0) {
              try {
                toast.info("Hôm nay đã hết nhiệm vụ vui lòng quay lại sau");
                setIsStart(false);
                const res = await stopMission();
                if (res.status === 1) {
                  toast.success("Dừng nhiệm vụ thành công");
                }
              } catch (error) {
                toast.error("Dừng nhiệm vụ thất bại");
              }
            } else {
              setIndexPost(0);
              setPageIndex(0);
              getInitalPost();
            }
          }
        };
        var evt = new CustomEvent("checkVersion", {
          bubbles: true,
        });
        document.dispatchEvent(evt);

        if (isStart && checkVersion) {
          if (indexPost < listPost?.length) {
            getLoggedinUser();
            const splitData = listPost[indexPost]?.content
              .toString()
              .split("###");
            const query = convertParamsToQueryString(
              splitData?.[0] || "",
              indexSearch
            );
            openUrl(`https://www.google.com/${query}`);
            var evt = new CustomEvent("infoNewUrl", {
              bubbles: true,
              detail: {
                domain: splitData?.[1]?.trim()?.replace(/\n/g, ""),
                postId: listPost[indexPost]?._id,
              },
            });
            document.dispatchEvent(evt);

            // setListPost((data) => {
            //   data?.shift();
            //   return data;
            // });
          } else if (indexPost !== 0) {
            getPost();
          }
        } else if (isStart && !checkVersion) {
          toast.error(
            "Extension bạn đã cũ. Vui lòng cập nhật extension mới nhât."
          );
        }
      } else {
        setIndexPost((data) => data + 1);
      }
    }
  };
  useEffect(() => {
    var evt = new CustomEvent("checkVersion", {
      bubbles: true,
    });
    document.dispatchEvent(evt);
    if (isStart) runPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexPost, isStart]);
  const handleClickStart = async () => {
    var evt = new CustomEvent("checkVersion", {
      bubbles: true,
    });
    document.dispatchEvent(evt);
    if (checkVersion) {
      setIsStart(true);
      return;
    } else {
      return toast.error(
        "Extension bạn đã cũ. Vui lòng cập nhật extension mới nhât."
      );
    }
  };
  const confirm = async () => {
    modal.confirm({
      title: "Thông Báo",
      content:
        "Hệ thông sẽ sử dụng trình duyệt này để chạy nhiệm vụ. Vui lòng không đóng trình duyệt này và sử dụng trình duyệt khác",
      okText: "Bắt đầu",
      cancelText: "Hủy",
      onOk() {
        handleClickStart();
      },
    });
  };
  const confirmStop = async () => {
    modal.confirm({
      title: "Thông Báo",
      content: "Bạn có chắc chắn muốn dừng nhiệm vụ không?",
      okText: "Dừng nhiệm vụ",
      cancelText: "Hủy",
      onOk() {
        stop();
      },
    });
  };
  const stop = async () => {
    try {
      // var evt = new CustomEvent("stopMission", {
      //   bubbles: true,
      // });
      // document.dispatchEvent(evt);
      setIsStart(false);
      setIndexPost(0);
      // const res = await stopMission();
      // if (res.status === 1) {
      //   toast.success("Dừng nhiệm vụ thành công");
      //   setIsStart(false);
      // }
    } catch (error) {
      toast.error("Dừng nhiệm vụ thất bại");
    }
  };

  return (
    <header id={styles["header"]} className="shadow bg-white">
      <nav className="navbar navbar-expand-lg navbar-light  w-100">
        <div className="container-fluid">
          <div
            className="collapse navbar-collapse d-flex justify-content-between align-items-center"
            id="navbarTogglerDemo01"
          >
            <Link href="/">
              <div className={styles["image-header"]}>
                <img
                  src="https://trafficsseo.com/logo.png"
                  height={150}
                  width={150}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Link>
            <div
              className="container-notification-payment"
              style={{ width: "65%" }}
            >
              <marquee>
                <div className="d-flex" style={{ gap: 40 }}>
                  {payments &&
                    payments?.map((item) =>
                      item?.status === "pending" ? (
                        <label
                          key={item}
                          className="d-flex"
                          style={{
                            alignItems: "center",
                            gap: 5,
                            fontWeight: 500,
                          }}
                        >
                          <MdNotificationsActive size={20} color="red" />
                          <span>
                            Người dùng{" "}
                            <span style={{ fontWeight: 700 }}>
                              {item?.user?.username}
                            </span>{" "}
                            vừa tạo lệnh rút tiền{" "}
                            <span style={{ color: "green", fontWeight: 500 }}>
                              {new Intl.NumberFormat().format(item?.amount)} VNĐ
                            </span>
                          </span>
                        </label>
                      ) : (
                        <label
                          key={item}
                          className="d-flex"
                          style={{
                            alignItems: "center",
                            gap: 5,
                            fontWeight: 500,
                          }}
                        >
                          <MdNotificationsActive size={20} color="red" />
                          <span>
                            Người dùng{" "}
                            <span style={{ fontWeight: 700 }}>
                              {item?.user?.username}
                            </span>{" "}
                            vừa được{" "}
                            <span style={{ color: "green", fontWeight: 500 }}>
                              thanh toán{" "}
                              {new Intl.NumberFormat().format(item?.amount)} VNĐ
                            </span>
                          </span>
                        </label>
                      )
                    )}
                </div>
              </marquee>
            </div>
            <div
              className="d-flex align-items-center mx-4 gap-2"
              style={{ minWidth: "350px" }}
            >
              <div className={`${styles["item-header"]} d-flex p-1`}>
                <Link href={`/profile`} className="d-flex align-items-center">
                  <img
                    src={user?.avatar}
                    alt="Profile picture"
                    className={styles["avatar"]}
                    referrerPolicy="no-referrer"
                  />
                  <span className="mx-2 fw-bolder text-dark">
                    {user?.username}
                  </span>
                </Link>
              </div>

              {status && (
                <div className={` ${styles["item-icon"]} d-flex`}>
                  {isStart ? (
                    <div
                      id="start"
                      className="button-control-game d-flex  bg-gray-200  text-green-400 rounded-full p-075 cursor-pointer  relative"
                      onClick={confirmStop}
                    >
                      <FaStop
                        className={`${styles["icon-play"]} fs-6`}
                        color="red"
                      />
                    </div>
                  ) : (
                    <div
                      id="start"
                      className="button-control-game d-flex  bg-gray-200  text-green-400 rounded-full p-075 cursor-pointer  relative"
                      onClick={confirm}
                    >
                      <FaPlay className={`${styles["icon-play"]} fs-6`} />
                    </div>
                  )}
                </div>
              )}

              <div className={` ${styles["item-icon"]} d-flex`}>
                <div className="button-control-game d-flex  bg-gray-200  rounded-full p-075 cursor-pointer  relative">
                  <RiNotification3Fill
                    className={`${styles["icon-notification"]} fs-6`}
                  />
                </div>
              </div>
              <div className={` ${styles["item-icon"]} d-flex`}>
                <div
                  className="button-control-game d-flex  bg-gray-200  rounded-full p-075 cursor-pointer  relative"
                  onClick={logout}
                >
                  <IoLogOutOutline
                    className={`${styles["icon-notification"]} fs-6`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div>
        <div style={{ display: "none" }}>
          <a
            id="clickThisShit"
            href={`https://${mappedLink}`}
            target="_blank"
            dataPostId={postId}
          >
            <span>{mappedLink}</span>
          </a>
        </div>
      </div>
      {contextHolder}
    </header>
  );
});

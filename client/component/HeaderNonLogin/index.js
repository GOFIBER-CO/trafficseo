import React, { memo, useContext, useEffect, useState } from "react";
import styles from "./style.module.scss";
import Link from "next/link";

import { Modal } from "antd";

import { GoSignIn } from "react-icons/go";
import { TbHelpOctagon } from "react-icons/tb";
import { getLinkHelp } from "@/api/profile";
let timmerId;
export default memo(function HeaderNonLogin() {
  const [indexPost, setIndexPost] = useState(0);
  const [linkHelp, setLinkHelp] = useState("");
  const [checkVersion, setCheckVersion] = useState(false);
  const getData = async () => {
    const result = await getLinkHelp();
    setLinkHelp(result?.data?.link);
  };

  useEffect(() => {
    const handleEvent = () => {
      clearTimeout(timmerId);
      timmerId = setTimeout(() => {
        setIndexPost((data) => data + 1);
      }, 2000);
    };
    document.addEventListener("openNewUrl", handleEvent);
    const handleEventVersion = (data) => {
      clearTimeout(timmerId);
      timmerId = setTimeout(() => {
        setCheckVersion(data?.detail?.currentVersion === "1.3.0");
      }, 500);
    };
    document.addEventListener("versionExtention", handleEventVersion);
    getData();
  }, []);

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

            <div className="d-flex align-items-center mx-4 gap-2">
              <div className={` ${styles["item-icon"]} d-flex`}>
                <Link href={"/login"}>
                  <div
                    id="start"
                    className={`${styles["button-control-game"]} d-flex  bg-gray-200  text-green-400 rounded-full cursor-pointer  relative text-dark align-items-center`}
                  >
                    <GoSignIn className={`${styles["icon-play"]} fs-6`} />
                    <span className="text-success">Đăng nhập</span>
                  </div>
                </Link>
              </div>
              <div className={` ${styles["item-icon"]} d-flex`}>
                <a href={linkHelp} target="_blank" style={{ color: "inherit" }}>
                  <div
                    className={`${styles["button-control-game"]} d-flex  bg-gray-200  rounded-full p-075 cursor-pointer  relativev  relative text-dark align-items-center`}
                  >
                    <TbHelpOctagon
                      className={`${styles["icon-notification"]} fs-6`}
                    />
                    <span>Hướng dẫn</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
});

import React, { useEffect, useState } from "react";
import styles from "./AdSidebar.module.css";
import { getLinkHelp } from "@/api/profile";

const AdvertiseSidebar = ({
  toggleDieuKhoan,
  toggleDieuKien,
  nameDieuKien,
  nameDieuKhoan,
  nameNotificationReferral,
  toggleNotificationReferral,
}) => {
  const [linkHelp, setLinkHelp] = useState("");
  const [isShowHelper, setIsShowHelper] = useState(false);
  const getData = async () => {
    const result = await getLinkHelp();
    setLinkHelp(result?.data?.link);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div
      className="d-none d-lg-flex col col-2 position-fixed"
      style={{ top: 0, right: 0, paddingTop: "4rem" }}
    >
      <div className="p-3 w-100" style={{ height: "90vh" }}>
        <div className={`border-bottom mt-4 ${styles["header-ad"]}`}></div>

        {!isShowHelper && (
          <div>
            <ul className="p-2">

              <a href={linkHelp} target="_blank" style={{ color: "inherit" }}>

                <li style={{ listStyle: "none" }}>
                  <div
                    className={`${styles["help-container"]} d-fex align-items-center p-2 rounded-4`}
                  >
                    <span className="fw-semibold">Hướng dẫn sử dụng</span>
                  </div>
                </li>
              </a>

              <li style={{ listStyle: "none" }} onClick={toggleDieuKhoan}>
                <div
                  className={`${styles["help-container"]} d-fex align-items-center p-2 rounded-4`}
                >
                  <div>
                    <span className="fw-semibold">{nameDieuKhoan}</span>
                  </div>
                </div>
              </li>
              <li style={{ listStyle: "none" }} onClick={toggleDieuKien}>
                <div
                  className={`${styles["help-container"]} d-fex align-items-center p-2 rounded-4`}
                >
                  <div>
                    <span className="fw-semibold">{nameDieuKien}</span>
                  </div>
                </div>
              </li>
              <li
                style={{ listStyle: "none" }}
                onClick={toggleNotificationReferral}
              >
                <div
                  className={`${styles["help-container"]} d-fex align-items-center p-2 rounded-4`}
                >
                  <div>
                    <span className="fw-semibold">
                      {nameNotificationReferral}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        )}

        {/* <div
          id="divAdLeft"
          style={{
            overflow: "hidden",
            right: "3.5%",
            maxWidth: "250px",
          }}
        >
          <a href="https://gofiber.vn/thue-vps" target="_blank">
            <img
              src="https://gofiber.vn/images/banner-quancao.gif"
              width="100%"
              alt=""
              style={{ marginBottom: "10px !important" }}
            />
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default AdvertiseSidebar;

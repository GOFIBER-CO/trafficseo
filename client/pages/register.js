import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "../styles/Login.module.scss";

import { AuthContext } from "@/context/AuthContext";

import { useCheckAuth } from "@/utils/useCheckAuth";

import Link from "next/link";
import { getAllTeam } from "@/api/post";
import { Select, Tooltip } from "antd";
import { BsQuestionCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading } = useCheckAuth();
  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState();
  const [telegram, setTelegram] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [username, setUsername] = useState("");
  const { register } = useContext(AuthContext);

  const handleLogin = useCallback(
    (events) => {
      events.preventDefault();

      if (!team) {
        return toast.warning("Vui lòng chọn team!");
      }
      const formData = {
        email,
        password,
        telegram,
        team,
        username,
        telegramId,
      };
      register(formData);
    },
    [email, password, register, username, team]
  );
  const getTeam = async () => {
    const data = await getAllTeam();
    setTeams(data?.data);
  };
  useEffect(() => {
    getTeam();
  }, []);
  return (
    <div className="container d-flex align-items-center w-100 min-vh-100 justify-content-center">
      {loading || (!loading && user) ? (
        <></>
      ) : (
        <form className={styles["form_container"]}>
          <div className={styles["logo_container"]}></div>
          <div className={styles["title_container"]}>
            <p className={styles["title"]}>Đăng ký</p>
            <span className={styles["subtitle"]}>
              Đây là trang đăng ký dành cho BTV lên nhiệm vụ. Nếu bạn không phải
              là BTV vui lòng không đăng ký.
            </span>
          </div>
          <br />
          <div className={styles["input_container"]}>
            <label className={styles["input_label"]} htmlFor="email_field">
              Email
            </label>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              className={styles["icon"]}
            >
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="1.5"
                stroke="#141B34"
                d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5"
              ></path>
              <path
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="#141B34"
                d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
              ></path>
            </svg>
            <input
              placeholder="name@mail.com"
              title="Inpit title"
              name="input-name"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className={styles["input_field"]}
              id="email_field"
            />
          </div>
          <div className={styles["input_container"]}>
            <label className={styles["input_label"]} htmlFor="password_field">
              Mật khẩu
            </label>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              className={styles["icon"]}
            >
              <path
                strokeLinecap="round"
                strokeWidth="1.5"
                stroke="#141B34"
                d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22"
              ></path>
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="1.5"
                stroke="#141B34"
                d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9"
              ></path>
              <path
                fill="#141B34"
                d="M21.2046 15.1045L20.6242 15.6956V15.6956L21.2046 15.1045ZM21.4196 16.4767C21.7461 16.7972 22.2706 16.7924 22.5911 16.466C22.9116 16.1395 22.9068 15.615 22.5804 15.2945L21.4196 16.4767ZM18.0228 15.1045L17.4424 14.5134V14.5134L18.0228 15.1045ZM18.2379 18.0387C18.5643 18.3593 19.0888 18.3545 19.4094 18.028C19.7299 17.7016 19.7251 17.1771 19.3987 16.8565L18.2379 18.0387ZM14.2603 20.7619C13.7039 21.3082 12.7957 21.3082 12.2394 20.7619L11.0786 21.9441C12.2794 23.1232 14.2202 23.1232 15.4211 21.9441L14.2603 20.7619ZM12.2394 20.7619C11.6914 20.2239 11.6914 19.358 12.2394 18.82L11.0786 17.6378C9.86927 18.8252 9.86927 20.7567 11.0786 21.9441L12.2394 20.7619ZM12.2394 18.82C12.7957 18.2737 13.7039 18.2737 14.2603 18.82L15.4211 17.6378C14.2202 16.4587 12.2794 16.4587 11.0786 17.6378L12.2394 18.82ZM14.2603 18.82C14.8082 19.358 14.8082 20.2239 14.2603 20.7619L15.4211 21.9441C16.6304 20.7567 16.6304 18.8252 15.4211 17.6378L14.2603 18.82ZM20.6242 15.6956L21.4196 16.4767L22.5804 15.2945L21.785 14.5134L20.6242 15.6956ZM15.4211 18.82L17.8078 16.4767L16.647 15.2944L14.2603 17.6377L15.4211 18.82ZM17.8078 16.4767L18.6032 15.6956L17.4424 14.5134L16.647 15.2945L17.8078 16.4767ZM16.647 16.4767L18.2379 18.0387L19.3987 16.8565L17.8078 15.2945L16.647 16.4767ZM21.785 14.5134C21.4266 14.1616 21.0998 13.8383 20.7993 13.6131C20.4791 13.3732 20.096 13.1716 19.6137 13.1716V14.8284C19.6145 14.8284 19.619 14.8273 19.6395 14.8357C19.6663 14.8466 19.7183 14.8735 19.806 14.9391C19.9969 15.0822 20.2326 15.3112 20.6242 15.6956L21.785 14.5134ZM18.6032 15.6956C18.9948 15.3112 19.2305 15.0822 19.4215 14.9391C19.5091 14.8735 19.5611 14.8466 19.5879 14.8357C19.6084 14.8273 19.6129 14.8284 19.6137 14.8284V13.1716C19.1314 13.1716 18.7483 13.3732 18.4281 13.6131C18.1276 13.8383 17.8008 14.1616 17.4424 14.5134L18.6032 15.6956Z"
              ></path>
            </svg>
            <input
              placeholder="Mật khẩu"
              title="Inpit title"
              name="input-name"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles["input_field"]}
              id="password_field"
            />
          </div>
          <div className={styles["input_container"]}>
            <label className={styles["input_label"]}>Tên hiển thị</label>
            <svg
              className={styles["icon"]}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <circle
                  cx="12"
                  cy="6"
                  r="4"
                  stroke="#1C274C"
                  stroke-width="1.5"
                ></circle>{" "}
                <path
                  d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
                  stroke="#1C274C"
                  stroke-width="1.5"
                ></path>{" "}
              </g>
            </svg>
            <input
              placeholder="Tên hiển thị"
              title="Inpit title"
              name="input-name"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles["input_field"]}
            />
          </div>
          <div className={styles["input_container"]}>
            <label className={styles["input_label"]}>Telegram</label>
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles["icon"]}
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="url(#paint0_linear_87_7225)"
                ></circle>{" "}
                <path
                  d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z"
                  fill="white"
                ></path>{" "}
                <defs>
                  {" "}
                  <linearGradient
                    id="paint0_linear_87_7225"
                    x1="16"
                    y1="2"
                    x2="16"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                  >
                    {" "}
                    <stop stop-color="#37BBFE"></stop>{" "}
                    <stop offset="1" stop-color="#007DBB"></stop>{" "}
                  </linearGradient>{" "}
                </defs>{" "}
              </g>
            </svg>
            <input
              placeholder="Telegram"
              title="Inpit title"
              name="input-name"
              type="text"
              required
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className={styles["input_field"]}
            />
          </div>

          <div className={styles["input_container"]}>
            <label className={styles["input_label"]}>
              Telegram ID{" "}
              <Tooltip
                placement="top"
                title={
                  <div style={{ color: "#000" }}>
                    {
                      <span>
                        Để lấy ID Telegram, mở ứng dụng Telegram và tìm kiếm từ
                        khóa{" "}
                        <span style={{ color: "blue", fontWeight: "bold" }}>
                          @TrafficSeoBot
                        </span>{" "}
                        . Bấm chọn{" "}
                        <span style={{ color: "blue", fontWeight: "bold" }}>
                          TrafficSeoBot
                        </span>{" "}
                        sau đó bấm bắt đầu, bạn sẽ nhận được ID.
                      </span>
                    }
                  </div>
                }
                color="white"
              >
                <BsQuestionCircleFill
                  size={20}
                  color="blue"
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                />
              </Tooltip>
            </label>
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles["icon"]}
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="url(#paint0_linear_87_7225)"
                ></circle>{" "}
                <path
                  d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z"
                  fill="white"
                ></path>{" "}
                <defs>
                  {" "}
                  <linearGradient
                    id="paint0_linear_87_7225"
                    x1="16"
                    y1="2"
                    x2="16"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                  >
                    {" "}
                    <stop stop-color="#37BBFE"></stop>{" "}
                    <stop offset="1" stop-color="#007DBB"></stop>{" "}
                  </linearGradient>{" "}
                </defs>{" "}
              </g>
            </svg>
            <input
              placeholder="Telegram ID"
              title="Inpit title"
              name="input-name"
              type="text"
              required
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              className={styles["input_field"]}
            />
          </div>
          <div className={styles["input_container"]}>
            <label className={styles["input_label"]}>Team</label>
            <Select
              placeholder="Chọn team"
              options={teams?.map((item) => {
                return {
                  label: item?.name,
                  value: item?._id,
                };
              })}
              onChange={(value) => setTeam(value)}
            ></Select>
          </div>
          <button
            title="Sign In"
            type="submit"
            className={styles["sign-in_btn"]}
            onClick={handleLogin}
          >
            <span>Đăng ký</span>
          </button>

          <div className={styles["separator"]}>
            <hr className={styles["separator"]} />
            <span>Or</span>
            <hr className={styles["separator"]} />
          </div>

          <Link href={"/login"} className="w-100">
            <button
              className={styles["sign-in_apl"]}
              style={{ backgroundColor: "green" }}
            >
              <span>Đăng nhập</span>{" "}
            </button>
          </Link>

          <p className={styles["note"]}>Terms of use &amp; Conditions</p>
        </form>
      )}
    </div>
  );
}

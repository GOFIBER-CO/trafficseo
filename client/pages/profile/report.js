import ProfileLayout from "@/component/Layout/ProfileLayout";

import React, { useEffect, useState } from "react";
import styles from "@/styles/Profile.module.scss";
import { getPointLogs, getTotalCommissionAndMoney } from "@/api/profile";
import moment from "moment";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Table } from "antd";
const { Column } = Table;
const ReportPage = () => {
  const [startDate, setStartDate] = useState(new Date(2023, 9, 10, 0, 0, 0));
  const [endDate, setEndDate] = useState(new Date());

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await getTotalCommissionAndMoney(
      `startDate=${moment(startDate).toISOString()}&endDate=${moment(
        endDate
      ).toISOString()}`
    );

    setLoading(false);
    setData(res.data);
  };

  useEffect(() => {
    getData();
  }, [endDate, startDate]);

  return (
    <ProfileLayout>
      <div
        className={`d-flex flex-column justify-content-between align-items-center py-3 ${styles["container"]}`}
      >
        <div
          className="d-flex align-items-center p-3 w-100"
          style={{ flex: 1, borderBottom: "1px solid #efefef" }}
        >
          <h4 className={styles["payment-header"]}>Thống kê</h4>
        </div>
        <div className="row w-100 my-3">
          <div className="col-12 d-flex gap-3 mb-3">
            <div className="d-flex  gap-3 align-items-center">
              <label style={{ fontWeight: 500 }}>Ngày bắt đầu</label>
              <DatePicker
                className="p-2 border"
                minDate={new Date(2023, 9, 10, 0, 0, 0)}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat={"dd-MM-yyyy"}
              />
            </div>
            <div className="d-flex gap-3 align-items-center">
              <label style={{ fontWeight: 500 }}>Ngày kết thúc</label>
              <DatePicker
                className="p-2 border"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat={"dd-MM-yyyy"}
              />
            </div>
          </div>
          <div className="col-6">
            <span
              style={{
                padding: "20px !important",
                fontSize: 20,
                fontWeight: 700,
                textAlign: "start",
              }}
            >
              Tổng số tiền nhận được:{" "}
              <span style={{ color: "red" }}>
                {" "}
                {new Intl.NumberFormat().format(data?.totalPoint) || 0}
              </span>{" "}
              đ
            </span>
          </div>
          <div className="col-6">
            <span
              style={{
                padding: "20px !important",
                fontSize: 20,
                fontWeight: 700,
                textAlign: "start",
              }}
            >
              Tổng số nhiệm vụ đã hoàn thành:{" "}
              <span style={{ color: "green" }}>
                {data?.totalComission || 0}
              </span>
            </span>
          </div>
        </div>
        <div className="d-flex w-100" style={{ width: "100%" }}>
          <div style={{ width: "49%" }} className="px-2">
            <h3 style={{ textAlign: "start", fontSize: 16, padding: "0 10px" }}>
              Danh sách website
            </h3>
            <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
              {data?.listDomain &&
                Object.keys(data?.listDomain)?.map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0 15px",
                    }}
                  >
                    <label style={{ fontWeight: 500 }}>{item}</label>
                    <span style={{ color: "green" }}>
                      {data?.listDomain[item]}
                    </span>
                  </div>
                ))}
            </div>
          </div>
          <div style={{ width: "45%" }} className="px-2">
            <h3 style={{ textAlign: "start", fontSize: 16, padding: "0 15px" }}>
              Danh sách keyword
            </h3>
            <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
              {data?.listKey &&
                Object.keys(data?.listKey)?.map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0 15px",
                    }}
                  >
                    <label style={{ fontWeight: 500 }}>{item}</label>
                    <span style={{ color: "green" }}>
                      {data?.listKey[item]}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default ReportPage;

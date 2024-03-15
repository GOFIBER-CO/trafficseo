import ProfileLayout from "@/component/Layout/ProfileLayout";

import React, { useEffect, useState } from "react";
import styles from "@/styles/Profile.module.scss";
import { getReportPayment } from "@/api/profile";
import moment from "moment";
import { Button, Spin } from "antd";
import vi from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useCheckAuth } from "@/utils/useCheckAuth";
import { RiFileExcel2Fill } from "react-icons/ri";
import ExcelJS from "exceljs";
import { FaSearch } from "react-icons/fa";
const ReportPage = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const { user } = useCheckAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);

    setEndDate(end);
  };
  const getData = async () => {
    setLoading(true);
    const res = await getReportPayment(
      `startDate=${startDate && moment(startDate)?.toISOString()}&&endDate=${
        endDate &&
        moment(endDate)
          .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
          ?.toISOString()
      }&user=${user?._id}`
    );
    setData(res.data?.[0]);
    setLoading(false);
  };
  const exportExcel = async () => {
    setLoading(true);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Bao_cao_rut_tien_theo_brand`);
    sheet.properties.defaultRowHeight = 20;

    let optionBorder = {
      top: { color: { argb: "000000" }, style: "thin" },
      left: { color: { argb: "000000" }, style: "thin" },
      bottom: { color: { argb: "000000" }, style: "thin" },
      right: { color: { argb: "000000" }, style: "thin" },
    };
    let optionbold = {
      name: "Time New Romans",
      family: 4,
      size: 12,
      bold: true,
    };

    sheet.getRow(1).values = ["STT", "Team", "Brand", "Số tiền"];
    for (let i = 1; i <= 4; i++) {
      sheet.getCell(1, Number(i)).border = optionBorder;
      sheet.getCell(1, Number(i)).font = optionbold;
    }

    sheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    sheet.columns = [
      { key: "stt" },
      { key: "team", width: 30, border: optionBorder },
      { key: "brand", width: 30, border: optionBorder },
      {
        key: "amount",
        width: 30,
        border: optionBorder,
      },
    ];
    //Add dataSet
    let dataSetExport = [];
    let nf = new Intl.NumberFormat("en-US");

    Object?.keys(data?.details || {})?.map((child, index) => {
      let a = {
        stt: child?.stt || index + 1,
        team: data?.user,
        amount: data?.details?.[child],
        brand: child,
      };
      dataSetExport.push(a);
      sheet.addRow(a);
    });

    //saver
    workbook.xlsx.writeBuffer().then(function (dataSet) {
      const blob = new Blob([dataSet], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Bao_cao_rut_tien_theo_brand.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
    setLoading(false);
  };
  useEffect(() => {
    if (user?._id) getData();
  }, [user]);

  return (
    <ProfileLayout>
      <div
        className={`d-flex flex-column justify-content-between align-items-center py-3 ${styles["container"]}`}
      >
        <div
          className="d-flex align-items-center p-3 w-100"
          style={{ flex: 1, borderBottom: "1px solid #efefef" }}
        >
          <h4 className={styles["payment-header"]}>Thống kê thanh toán</h4>
        </div>
        <Spin spinning={loading} className="spin-report">
          <div className="row w-100 mb-3">
            <div className="col-12 d-flex gap-3 mb-2">
              <div className="d-flex gap-3 align-items-center mb-2">
                <label style={{ fontWeight: 500 }}>Thời gian</label>
                <DatePicker
                  className="p-2 mx-3 border w-100"
                  selected={startDate}
                  onChange={onChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange={true}
                  isClearable={true}
                  locale={vi}
                  dateFormat={"dd/MM/yyyy"}
                />
              </div>
            </div>
            <div className="col-12 mb-2 gap-2 d-flex">
              <Button
                style={{ width: 150 }}
                icon={<FaSearch size={15} />}
                type="primary"
                onClick={() => {
                  getData();
                }}
              >
                Tìm kiếm
              </Button>
              <Button
                style={{ width: 150, backgroundColor: "green" }}
                icon={<RiFileExcel2Fill size={20} />}
                type="primary"
                onClick={exportExcel}
              >
                Xuất excel
              </Button>
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
                Tổng số tiền đã thanh toán:{" "}
                <span style={{ color: "red" }}>
                  {" "}
                  {new Intl.NumberFormat().format(data?.total || 0) || 0}
                </span>{" "}
                đ
              </span>
            </div>
          </div>
          <div className="d-flex w-100" style={{ width: "100%" }}>
            <div style={{ width: "49%" }} className="px-2">
              <h3 style={{ textAlign: "start", fontSize: 16 }}>
                Danh sách hậu đài
              </h3>

              <div style={{ maxHeight: "400px" }}>
                {data?.details?.[0]?.details &&
                  Object.keys(data?.details?.[0]?.details)?.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <label style={{ fontWeight: 500 }}>{item}</label>
                      <span style={{ color: "green" }}>
                        {new Intl.NumberFormat().format(
                          data?.details?.[0]?.details?.[item] || 0
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Spin>
      </div>
    </ProfileLayout>
  );
};

export default ReportPage;

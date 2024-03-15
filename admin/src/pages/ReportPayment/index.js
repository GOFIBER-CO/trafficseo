import { Select, Spin } from "antd";
import React, { useState } from "react";
import { Col, Container, Input, Row } from "reactstrap";
import { Button as ButtonANTD } from "antd";
import BreadCrumb from "../../Components/Common/BreadCrumb";

import "react-datepicker/dist/react-datepicker.css";
import { SiMicrosoftexcel } from "react-icons/si";

import {
  countMoneyPayment,
  getAllUsers,
  getReportPayment,
} from "../../helpers/helper";
import DatePicker from "react-datepicker";
import { useEffect } from "react";

import vi from "date-fns/locale/vi";
import TableNested from "./TableNested";
import moment from "moment";
import TableParent from "./TableParent";
const ExcelJS = require("exceljs");
export default function ReportPayment() {
  const [loading, setLoading] = useState(true);
  const [moneyOverview, setMoneyOverview] = useState({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [userLocal, setUserLocal] = useState({});
  const [users, setUser] = useState([]);
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalMoneyLeader, setTotalMoneyLeader] = useState(0);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [searchUser, setSearchUser] = useState("");

  const getUsers = async () => {
    const users = await getAllUsers(
      {
        pageSize: 10000,
      },
      `acceptPost=true`
    );

    users?.users?.map((item) => {
      item.label = item?.username;
      item.value = item?._id;
    });

    setUser(users?.users || []);
  };
  const getData = async () => {
    const data = await getReportPayment(
      `startDate=${startDate && moment(startDate)?.toISOString()}&endDate=${
        endDate && moment(endDate)?.toISOString()
      }&user=${searchUser}`
    );
    const dataPayment = await countMoneyPayment(
      `startDate=${startDate && moment(startDate)?.toISOString()}&endDate=${
        endDate && moment(endDate)?.toISOString()
      }`
    );
    setMoneyOverview(dataPayment);
    setTotalDocs(data?.length);
    setData(data?.data);
    const total = data?.data?.reduce((total, item) => {
      return (total += item?.total);
    }, 0);
    setTotalMoneyLeader(total);
    setLoading(false);
  };

  const exportExcel = async () => {
    setLoadingExcel(true);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Thong_ke_thanh_toan_TrafficSeo`);
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

    sheet.getRow(1).values = ["STT", "Team", "User", "Brand", "Số tiền"];
    for (let i = 1; i <= 5; i++) {
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
      { key: "user", width: 30, border: optionBorder },
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
    data?.map((item, index) => {

      item?.details?.map((children) => {
        Object.keys(children?.details)?.map((child) => {
          let a = {
            stt: item?.stt || index + 1,
            team: item?.label,
            user: children?.label,
            brand: child,
            amount: children?.details?.[child],
          };
          dataSetExport.push(a);
          sheet.addRow(a);
        });

      });
    });

    //saver
    workbook.xlsx.writeBuffer().then(function (dataSet) {
      const blob = new Blob([dataSet], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Bao_cao_rut_tien_theo_team.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
    setLoadingExcel(false);
  };

  const searchPayment = () => {
    setLoading(true);
    getData();
  };

  useEffect(() => {
    getData();
    getUsers();
  }, [pageSize, pageIndex]);
  useEffect(() => {
    setUserLocal(JSON.parse(sessionStorage.getItem("authUser") || {}));
  }, []);
  return (
    <React.Fragment>
      <Spin spinning={loading}>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb
              title="Thống kê thanh toán"
              pageTitle="Thống kê thanh toán"
            />
            <Row className="mb-3">
              {userLocal?.user?.roleOfUser?.name === "leader" ? (
                <Col lg="12" className="my-3">
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    SỐ TIỀN ĐÃ THANH TOÁN{" "}
                    <label
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "green",
                      }}
                    >
                      {totalMoneyLeader
                        ?.toString()
                        ?.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
                        " VND"}
                    </label>
                  </span>
                </Col>
              ) : (
                <Col lg="12" className="my-3">
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    SỐ TIỀN ĐÃ THANH TOÁN{" "}
                    <label
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "green",
                      }}
                    >
                      {moneyOverview?.countMoneyPayment
                        ? moneyOverview?.countMoneyPayment
                            ?.toString()
                            ?.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
                          " VND"
                        : 0}
                    </label>
                  </span>
                </Col>
              )}

              {userLocal?.user?.roleOfUser?.name === "superAdmin" && (
                <Col className="mt-2" lg="2">
                  <div>
                    <label>Người dùng</label>
                    <Select
                      placeholder="Người dùng..."
                      onChange={(value) => setSearchUser(value)}
                      showSearch
                      allowClear
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        {
                          label: "Tất cả",
                          value: "",
                        },
                        ...users,
                      ]}
                      style={{ width: "100%" }}
                    />
                  </div>
                </Col>
              )}

              <Col className="mt-2" lg="3">
                <div>
                  <label>Thời gian</label>
                  <div className="d-flex gap-3">
                    <DatePicker
                      className="p-2 border"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      showTimeSelect
                      timeFormat="HH:mm"
                      dateFormat={"HH:mm dd-MM-yyyy"}
                      startDate={startDate}
                      endDate={endDate}
                      locale={vi}
                    />
                    <DatePicker
                      className="p-2 border"
                      showTimeSelect
                      timeFormat="HH:mm"
                      dateFormat={"HH:mm dd-MM-yyyy"}
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      locale={vi}
                    />
                  </div>
                </div>
              </Col>
              <Col className="mt-2 d-flex gap-3" lg="12">
                <div className="d-flex gap-3">
                  <ButtonANTD type="primary" onClick={() => searchPayment()}>
                    Tìm kiếm
                  </ButtonANTD>

                  <ButtonANTD
                    icon={<SiMicrosoftexcel color={"green"} />}
                    onClick={() => exportExcel()}
                    className="d-flex gap-2"
                    style={{ alignItems: "center" }}
                    loading={loadingExcel}
                  >
                    Xuất excel
                  </ButtonANTD>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <TableParent data={data} />
              </Col>
            </Row>
          </Container>
        </div>
      </Spin>
    </React.Fragment>
  );
}

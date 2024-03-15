import {
  Pagination,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
} from "antd";
import React, { useState } from "react";
import { Col, Container, Input, Row } from "reactstrap";
import { Button as ButtonANTD } from "antd";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { DeleteOutlined } from "@ant-design/icons";
import Column from "antd/lib/table/Column";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { SiMicrosoftexcel } from "react-icons/si";
import {
  countMoneyPayment,
  deletePayment,
  getAllUsers,
  getPayments,
  getPaymentsExportExcel,
} from "../../helpers/helper";
import DatePicker from "react-datepicker";
import { useEffect } from "react";
import { MdPayments, MdPendingActions } from "react-icons/md";
import { AiFillCloseSquare } from "react-icons/ai";
import ModalUpdatePayment from "./ModalUpdatePayment";
import vi from "date-fns/locale/vi";
import ModalViewHistoryPoint from "../Users/ModalViewHistoryPoint";
import { toast } from "react-toastify";
const ExcelJS = require("exceljs");
export default function RequirePayment() {
  const [moneyOverview, setMoneyOverview] = useState({});
  const getUsers = async () => {
    const users = await getAllUsers({
      pageSize: 10000,
    });

    users?.users?.map((item) => {
      item.label = item?.username;
      item.value = item?._id;
    });

    setUser(users?.users || []);
  };
  const getData = async () => {
    const data = await getPayments(
      searchUser,
      pageSize,
      pageIndex,
      `sort=${sort}&status=${status}&startDate=${moment(
        startDate
      ).toISOString()}&endDate=${moment(endDate).toISOString()}&stt=${stt}`
    );
    const dataPayment = await countMoneyPayment();
    setMoneyOverview(dataPayment);
    setTotalDocs(data?.totalDocs);
    setData(data?.data);
  };

  const exportExcel = async () => {
    const data = await getPaymentsExportExcel(
      searchUser,
      10000000,
      pageIndex,
      `sort=${sort}&status=${status}&startDate=${moment(
        startDate
      ).toISOString()}&endDate=${moment(endDate).toISOString()}&stt=${stt}`
    );
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(
      `Danh sach yeu cau rut tien TRAFFICSEO`
    );
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

    sheet.getRow(1).values = [
      "STT",
      "Tên người dùng",
      "Số tiền",
      "STK",
      "Tên trên thẻ",
      "Ngân hàng",
      "Trạng thái",
      "Thời gian tạo",
    ];
    for (let i = 1; i <= 8; i++) {
      sheet.getCell(1, Number(i)).border = optionBorder;
      sheet.getCell(1, Number(i)).font = optionbold;
    }

    sheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    sheet.columns = [
      { key: "stt" },
      { key: "nameUser", width: 30, border: optionBorder },
      { key: "amount", width: 30, border: optionBorder },
      {
        key: "stk",
        width: 30,
        border: optionBorder,
      },
      {
        key: "nameInCard",
        width: 30,
        border: optionBorder,
      },
      {
        key: "bankName",
        width: 20,
        border: optionBorder,
      },
      { key: "status", width: 20, border: optionBorder },
      { key: "createdAt", width: 20, border: optionBorder },
    ];
    //Add dataSet
    let dataSetExport = [];
    let nf = new Intl.NumberFormat("en-US");
    data?.data?.map((item, index) => {
      let a = {
        stt: item?.stt || index + 1,
        nameUser: item?.user?.username,
        amount: item?.amount,
        stk: item?.infoPayment?.stk?.toString(),
        nameInCard: item?.infoPayment?.fullName,
        bankName: item?.infoPayment?.bank,
        status:
          item?.status === "pending"
            ? "Chờ thanh toán"
            : item?.status === "completed"
            ? "Đã thanh toán"
            : "Từ chối",
        createdAt: moment(item?.createdAt)
          .format("HH:ss DD-MM-yyyy")
          ?.toString(),
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
      anchor.download = "Danh_sach_yeu_cau_rut_tien_TRAFFICSEO.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };


  const [users, setUser] = useState([]);
  const [data, setData] = useState([]);
  const [sort, setSort] = useState("stt");
  const [status, setStatus] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState(new Date("2023/04/01"));
  const [endDate, setEndDate] = useState(new Date());
  const [pageIndex, setPageIndex] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [searchUser, setSearchUser] = useState("");
  const [stt, setStt] = useState("");
  const searchPayment = () => {
    getData();
  };
  const handleDeletePayment = async (value) => {
    try {
      const deleteRecord = await deletePayment(value?._id);
      getData();
      return toast.success("Xóa yêu cầu thanh toán thành công!");
    } catch (error) {
      return toast.error("Xóa yêu cầu thanh toán thất bại!");
    }
  };

  useEffect(() => {

    getData();
    getUsers();
  }, [pageSize, pageIndex]);
  return (
    <React.Fragment>
      <Spin spinning={false}>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb
              title="Yêu Cầu Thanh Toán"
              pageTitle="Danh Sách Yêu Cầu Thanh Toán"
            />
            <Row className="mb-3">
              <Col lg="6" className="my-3">
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
                      ?.toString()
                      ?.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
                      " VND" || 0}
                  </label>
                </span>
              </Col>

              <Col lg="6" className="my-3">
                <span
                  style={{
                    padding: "30px !important",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  SỐ TIỀN CHỜ THANH TOÁN{" "}
                  <label
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "red",
                    }}
                  >
                    {moneyOverview?.countMoneyPending
                      ?.toString()
                      ?.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
                      " VND" || 0}
                  </label>
                </span>
              </Col>
              <Col className="mt-2" lg="2">
                <div>
                  <label>STT</label>
                  <Input
                    value={stt}
                    placeholder="STT..."
                    onChange={(value) => setStt(value.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>
              </Col>
              <Col className="mt-2" lg="2">
                <div>
                  <label>Người dùng</label>
                  <Select
                    placeholder="Người dùng..."
                    onChange={(value) => setSearchUser(value)}
                    showSearch
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
              <Col className="mt-2" lg="2">
                <div>
                  <label>Sắp xếp theo</label>
                  <Select
                    placeholder="Sắp xếp theo"
                    onChange={(value) => setSort(value)}
                    defaultValue={sort}
                    options={[
                      {
                        label: "STT",
                        value: "stt",
                      },
                      {
                        label: "Thời gian",
                        value: "createdAt",
                      },
                      {
                        label: "Số tiền",
                        value: "amount",
                      },
                    ]}
                    style={{ width: "100%" }}
                  />
                </div>
              </Col>
              <Col className="mt-2" lg="2">
                <div>
                  <label>Trạng thái</label>
                  <Select
                    placeholder="Trạng thái"
                    onChange={(value) => setStatus(value)}
                    defaultValue={status}
                    options={[
                      {
                        label: "Tất cả",
                        value: "",
                      },
                      {
                        label: "Đang xử lý",
                        value: "pending",
                      },
                      {
                        label: "Đã thanh toán",
                        value: "completed",
                      },
                      {
                        label: "Từ chối",
                        value: "rejected",
                      },
                    ]}
                    style={{ width: "100%" }}
                  />
                </div>
              </Col>
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
                  >
                    Xuất excel
                  </ButtonANTD>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Table rowKey="_id" dataSource={data} pagination={false}>
                  <Column scope="col" style={{ width: "50px" }} />
                  <Column
                    title="STT"
                    dataIndex="stt"
                    key="stt"
                    render={(val, rec, index) => {
                      return val;
                    }}
                  />

                  <Column
                    title="Người dùng"
                    dataIndex="user"
                    key="user"
                    render={(_) => _?.username}
                  />
                  <Column
                    title="Telegram"
                    dataIndex="user"
                    key="user"
                    render={(_) => _?.telegram}
                  />
                  <Column
                    title="Email"
                    dataIndex="user"
                    key="user"
                    render={(_) => _?.email}
                  />
                  <Column
                    title="Số tiền"
                    dataIndex="amount"
                    key="amount"
                    render={(_) =>
                      _?.toString()?.replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ","
                      ) + " VND"
                    }
                  />
                  <Column
                    title="STK"
                    dataIndex="infoPayment"
                    key="infoPayment"
                    render={(_, record) => record?.infoPayment?.stk}
                  />
                  <Column
                    title="Tên trên thẻ"
                    dataIndex="infoPayment"
                    key="infoPayment"
                    render={(_, record) => record?.infoPayment?.fullName}
                  />
                  <Column
                    title="Ngân hàng"
                    dataIndex="infoPayment"
                    key="infoPayment"
                    render={(_, record) => record?.infoPayment?.bank}
                  />
                  <Column
                    title="Trạng thái"
                    dataIndex="status"
                    key="status"
                    render={(_) => {
                      if (_ === "pending")
                        return (
                          <Tooltip title="Đang xử lý">
                            <MdPendingActions
                              style={{ color: "blue" }}
                              size={20}
                            />
                          </Tooltip>
                        );
                      else if (_ === "completed")
                        return (
                          <Tooltip title="Đã thanh toán">
                            <MdPayments style={{ color: "green" }} size={20} />
                          </Tooltip>
                        );
                      else
                        return (
                          <Tooltip title="Từ chối">
                            <AiFillCloseSquare
                              style={{ color: "red" }}
                              size={20}
                            />
                          </Tooltip>
                        );
                    }}
                  />
                  <Column
                    title="Lịch sử điểm"
                    dataIndex="user"
                    key="user"
                    render={(_, record) => (
                      <ModalViewHistoryPoint
                        id={_?._id}
                        paymentId={record?._id}
                      />
                    )}
                  />

                  <Column
                    title="Thời gian tạo"
                    dataIndex="createdAt"
                    key="createdAt"
                    render={(_) => moment(_).format("HH:mm DD-MM-YYYY")}
                  />
                  <Column
                    title="Hoạt động"
                    key="action"
                    render={(val, record) => (
                      <Space size="middle">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "15px",
                          }}
                        >
                          <ModalUpdatePayment
                            record={record}
                            getData={getData}
                          />

                          <Popconfirm
                            title="Bạn có chắc chắn muốn xóa yêu cầu này?"
                            onConfirm={() => handleDeletePayment(val)}
                            okText="Đồng ý"
                            cancelText="Không"
                          >
                            <DeleteOutlined
                              style={{ color: "red", fontSize: "20px" }}
                            />
                          </Popconfirm>
                        </div>
                      </Space>
                    )}
                  />
                </Table>
                <div className="text-right">
                  <Pagination
                    pageSize={pageSize}
                    current={pageIndex}
                    onChange={(page, pageSize) => {
                      setPageIndex(page );
                      setPageSize(pageSize);
                    }}
                    showTotal={(total) => `Tổng ${total} yêu cầu`}
                    total={totalDocs}
                    showSizeChanger
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Spin>
    </React.Fragment>
  );
}

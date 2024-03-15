import ProfileLayout from "@/component/Layout/ProfileLayout";
import React, { useContext, useEffect, useState } from "react";
import styles from "@/styles/Profile.module.scss";
import {
  Button,
  Checkbox,
  Col,
  Input,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import moment from "moment";
import DatePicker from "react-datepicker";
import {
  FaCheckSquare,
  FaSearch,
  FaTrash,
  FaWindowClose,
} from "react-icons/fa";
import vi from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";
import { getPagingPostForUserExportExcel, getPagingPostUser } from "@/api/post";
import { BiEdit } from "react-icons/bi";
import ModalEditPost from "@/component/Posts/ModalEditPost";
import ModalDeletePost from "@/component/Posts/ModalDeletePost";
import ModalDeleteMultiPost from "@/component/Posts/DeleteMultiPost";
import { SiMicrosoftexcel } from "react-icons/si";
import { getPagingBrand } from "@/api/profile";
import ModalExportTraffic from "@/component/Posts/ModalExportTraffic";
import ModalRefreshPost from "@/component/Posts/ModalRefreshPost";
import ModalReportList from "@/component/Posts/ModalReportList";

import { AuthContext } from "@/context/AuthContext";
const ExcelJS = require("exceljs");
const STATUS_POST = {
  0: "Chờ leader duyệt",
  1: "Chờ trợ lý duyệt",
  2: "Đang hoạt động",
  3: "Đã tắt",
  4: "Leader từ chối",
  5: "Trợ lý từ chối",
  6: "Đã đủ số lượng hôm nay",
};
export default function ListPost() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [posts, setPosts] = useState([]);
  const [startDate, setStartDate] = useState(new Date("2023/10/09"));
  const [endDate, setEndDate] = useState(new Date());
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState([]);
  const [totalMoneyChi, setTotalMoneyChi] = useState(0);
  const [totalMoneyByDay, setTotalMoneyByDay] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRowKeys);
    },
  };
  const getBrand = async () => {
    const brands = await getPagingBrand();
    setBrand(brands.data?.data);
  };
  const exportExcel = async () => {
    const data = await getPagingPostForUserExportExcel({
      search,
      status,
      pageSize,
      pageIndex,
      query: `startDate=${moment(startDate).toISOString()}&endDate=${moment(
        endDate
      ).toISOString()}&sort=${sort}`,
    });
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(
      `Danh sach bai viet cua ban TrafficSEO`
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
      "Keyword",
      "Domain",
      "Số lượng mỗi ngày",
      "Số lượng tổng",
      "Số lượng đã hoàn thành",
      "Số tiền đã chi",
      "Trạng thái",
      "Thời gian tạo",
    ];
    for (let i = 1; i <= 9; i++) {
      sheet.getCell(1, Number(i)).border = optionBorder;
      sheet.getCell(1, Number(i)).font = optionbold;
    }

    sheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    sheet.columns = [
      { key: "stt" },
      { key: "keyword", width: 30, border: optionBorder },
      { key: "domain", width: 30, border: optionBorder },
      { key: "quantityEveryDay", width: 30, border: optionBorder },
      { key: "quantityTotal", width: 30, border: optionBorder },
      {
        key: "userCompleted",
        width: 30,
        border: optionBorder,
      },
      {
        key: "totalMoney",
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
        stt: item?.index || index + 1,
        keyword: item?.content?.split("###")?.[0],
        domain: item?.content?.split("###")?.[1],
        quantityEveryDay: item?.quantityEveryDay,
        quantityTotal: item?.quantityTotal,
        userCompleted:
          item?.userCompleted?.length + (item?.quantityAfterReset || 0),
        totalMoney: item?.totalMoney,

        status: STATUS_POST[item?.status],
        createdAt: moment(item?.createdAt)
          .format("HH:ss DD-MM-yyyy")
          ?.toString(),
      };
      dataSetExport.push(a);
      sheet.addRow(a);
    });
    const totalMoney = sheet.addRow({
      totalMoney: `Tổng số tiền đã chi: ${nf.format(totalMoneyChi) + " VNĐ"}`,
    });
    totalMoney.font = { bold: true };
    //saver
    workbook.xlsx.writeBuffer().then(function (dataSet) {
      const blob = new Blob([dataSet], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Danh_sach_bai_viet_cua_ban_TrafficSEO.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };
  const getData = async () => {
    const listdata = await getPagingPostUser({
      search,
      status,
      pageSize,
      pageIndex,
      query: `startDate=${moment(startDate).toISOString()}&endDate=${moment(
        endDate
      ).toISOString()}&sort=${sort}`,
    });
    setLoading(false);
    setTotalPage(listdata?.totalPages);
    setTotalMoneyChi(listdata?.totalMoneyChi);
    setTotalMoneyByDay(listdata?.totalMoneyByDay);
    setPosts(listdata?.data);
    setTotalDocs(listdata?.totalDoc);
  };
  useEffect(() => {
    getData();
    getBrand();
  }, []);
  useEffect(() => {
    getData();
  }, [pageSize, pageIndex]);
  const handleOnChangeTable = ({ current, pageSize, total }) => {
    setPageIndex(current);
    setPageSize(pageSize);
  };
  return (
    <ProfileLayout>
      <div
        className={`d-flex flex-column justify-content-between align-items-center py-3 ${styles["container"]}`}
      >
        <div
          className="d-flex align-items-center p-3 w-100"
          style={{ flex: 1, borderBottom: "1px solid #efefef" }}
        >
          <h4 className={styles["payment-header"]}>Bài viết của bạn</h4>
        </div>
        <div className="px-2 py-2 w-100">
          <div className="d-flex gap-2">
            <h5
              className={styles["total-money"]}
              style={{
                display: "flex",
                gap: "10px",
                width: "50%",
                borderRadius: "10px",
              }}
            >
              TỔNG SỐ TIỀN THEO BÀI VIẾT{"  "}
              <span style={{ color: "green" }}>
                {new Intl.NumberFormat().format(totalMoneyChi)} VNĐ
              </span>
            </h5>
            <h5
              className={styles["total-money"]}
              style={{
                display: "flex",
                width: "50%",
                gap: "10px",
                borderRadius: "10px",
              }}
            >
              TỔNG SỐ TIỀN THEO NGÀY{"  "}
              <span style={{ color: "green" }}>
                {new Intl.NumberFormat().format(totalMoneyByDay)} VNĐ
              </span>
            </h5>
          </div>
          <Row gutter={[10, 10]}>
            <Col md={6}>
              <label style={{ fontWeight: 500 }}>Nội dung</label>
              <Input
                placeholder="Nội dung"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <label style={{ fontWeight: 500 }}>Trạng thái</label>
              <Select
                placeholder="Trạng thái"
                className="w-100"
                options={[
                  { label: "Tất cả", value: "" },
                  { label: "Hiển thị", value: 2 },
                  { label: "Chờ duyệt", value: "0,1" },
                  { label: "Ẩn bài", value: "3,4,5" },
                ]}
                defaultValue={""}
                onChange={(value) => setStatus(value)}
              />
            </Col>
            <Col md={5}>
              <label style={{ fontWeight: 500 }}>Sắp xếp theo</label>
              <Select
                placeholder="Sắp xếp"
                className="w-100"
                options={[
                  { label: "Thời gian tạo", value: "createdAt" },
                  { label: "Số người dùng hoàn thành", value: "userCompleted" },
                ]}
                defaultValue={"createdAt"}
                onChange={(value) => setSort(value)}
              />
            </Col>
            <Col md={4}>
              <label style={{ fontWeight: 500 }}>Thời gian</label>
              <div className="d-flex gap-3">
                <DatePicker
                  className="p-1 border"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  minDate={new Date("2023/10/09")}
                  endDate={endDate}
                  dateFormat={"dd-MM-yyyy"}
                  locale={vi}
                />
                <DatePicker
                  className="p-1 border"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  dateFormat={"dd-MM-yyyy"}
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  locale={vi}
                />
              </div>
            </Col>
            <Col md={24} style={{ display: "flex", gap: "10px" }}>
              <Button
                icon={<FaSearch />}
                type="primary"
                onClick={() => {
                  setLoading(true);
                  getData();
                }}
              >
                Tìm kiếm
              </Button>

              <Button
                icon={<SiMicrosoftexcel />}
                type="primary"
                style={{ background: "green" }}
                onClick={() => {
                  exportExcel();
                }}
              >
                Xuất excel
              </Button>
            </Col>
            
          </Row>
        </div>
        <div className="py-2 w-100">
          <Table
            rowKey="_id"
            dataSource={posts}
            style={{ width: "100%" }}
            // width={1200}
            loading={loading}
            pagination={{
              total: totalDocs,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSize: pageSize,
              current: pageIndex,
            }}
            columns={[
            {
                title: "STT",
                dataIndex: "stt",
                key: "stt",
                width: "5%",
              },
              {
                title: "Keyword",
                dataIndex: "content",
                key: "content",
                width: "10%",
                render: (value) => value?.split("###")?.[0],
              },
              {
                title: "Domain",
                dataIndex: "content",
                key: "content",
                width: "15%",
                render: (value) => value?.split("###")?.[1],
              },

              {
                title: "Traffic mỗi ngày",
                dataIndex: "quantityEveryDay",
                key: "quantityEveryDay",
                width: "10%",
              },
              {
                title: "Đã hoàn thành",
                dataIndex: "sizeUserCompleted",
                key: "sizeUserCompleted",
                width: "10%",
                render: (value, record) =>
                  (record?.quantityAfterReset || 0) + value,
              },
              {
                title: "Số tiền đã chi",
                dataIndex: "totalMoney",
                key: "totalMoney",
                width: "10%",
                render: (value) =>
                  `${new Intl.NumberFormat().format(value)} VNĐ`,
              },
              {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                render: (_) => (
                  <div className="d-flex align-items-center justify-content-center">
                    <span>{STATUS_POST[_]}</span>
                  </div>
                ),
                width: "10%",
              },
              {
                title: "Note",
                dataIndex: "note",
                key: "note",
                width: "10%",
              },
              {
                title: "Dự kiến hoàn thành",
            dataIndex: "endDate",
                key: "endDate",
                render: (val) => val && moment(val).format("HH:mm DD/MM/YYYY"),
                width: "10%",
              },
              {
                title: "Thời gian tạo",
                dataIndex: "createdAt",
                key: "createdAt",
                render: (val) => val && moment(val).format("HH:mm DD/MM/YYYY"),
                width: "10%",
              },
              {
                title: "Hành động",
                dataIndex: "actions",
                key: "actions",
                render: (_, record) => {
                  return (
                    <div className=" d-flex gap-3">
                      <ModalReportList id={record?._id} />
                      <ModalRefreshPost record={record} getData={getData} />
                      <ModalExportTraffic id={record?._id} />

                      <ModalEditPost
                        record={record}
                        getData={getData}
                        brand={brand}
                      />

                      {((user?.roleOfUser?.name === "btv" &&
                        record?.status === 0) ||
                        (user?.roleOfUser?.name === "leader" &&
                          record?.status === 1)) && (
                        <ModalDeletePost record={record} getData={getData} />
                      )}

                    </div>
                  );
                },
                width: "15%",
              },
            ]}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedRows,
              ...rowSelection,
            }}
            onChange={(e) => handleOnChangeTable(e)}
          ></Table>
        </div>
      </div>
    </ProfileLayout>
  );
}

import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import DatePicker from "react-datepicker";
import vi from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";
import { FaCheckSquare, FaSearch, FaWindowClose } from "react-icons/fa";
import moment from "moment";
import { SiMicrosoftexcel } from "react-icons/si";
import {
  deletePost,
  getPagingBrand,
  getPagingPostForUserExportExcelById,
  getPagingPostUserId,
} from "../../helpers/helper";
import ExcelJS from "exceljs";
import ModalExportTraffic from "../Posts/ModalExportExcelTraffic";
import ModalEditPost from "../Posts/ModalEditPost";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { MdPendingActions } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { AiFillCloseSquare } from "react-icons/ai";
const STATUS_POST = {
  0: "Chờ leader duyệt",
  1: "Chờ trợ lý duyệt",
  2: "Đang hoạt động",
  3: "Đã tắt",
  4: "Leader từ chối",
  5: "Trợ lý từ chối",
  6: "Đã đủ số lượng hôm nay",
};
const ModalListPost = ({ id, name }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [posts, setPosts] = useState([]);
  const [startDate, setStartDate] = useState(new Date("2023/04/01"));
  const [endDate, setEndDate] = useState(new Date());
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState();
  const [totalMoneyChi, setTotalMoneyChi] = useState(0);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [totalDocs, setTotalDocs] = useState(0);
  const handleOnChangeTable = ({ current, pageSize, total }) => {
    setPageIndex(current);
    setPageSize(pageSize);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const exportExcel = async () => {
    setLoadingExcel(true);
    const data = await getPagingPostForUserExportExcelById({
      id,
      search,
      status,
      pageSize,
      pageIndex,
      query: `startDate=${moment(startDate).toISOString()}&endDate=${moment(
        endDate
      ).toISOString()}&sort=${sort}&brand=${selectedBrand}`,
    });
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Danh sach bai viet cua ${name}`);
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
      "Brand",
      "Số lượng",
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
      { key: "brand", width: 30, border: optionBorder },
      { key: "quantity", width: 30, border: optionBorder },
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
        brand: item?.brand?.name,
        quantity: item?.quantity,
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
      anchor.download = `Danh_sach_bai_viet_cua_${name}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
    setLoadingExcel(false);
  };
  const confirm = (post) => {
    if (post) {
      deletePost(post._id)
        .then((res) => {
          toast.success("Chỉnh sửa bài viết thành công!");
          getData();
        })
        .catch((error) => {
          toast.error("Chỉnh sửa bài viết thất bại!");
        });
    }
  };
  const getData = async () => {
    const listdata = await getPagingPostUserId({
      id,
      search,
      status,
      pageSize,
      pageIndex,
      query: `startDate=${moment(startDate).toISOString()}&endDate=${moment(
        endDate
      ).toISOString()}&sort=${sort}&brand=${selectedBrand}`,
    });

    setLoading(false);
    setTotalPage(listdata?.totalPages);
    setTotalMoneyChi(listdata?.totalMoneyChi);
    setPosts(listdata?.data);
    setTotalDocs(listdata?.totalDoc);
  };
  const getBrand = async () => {
    const brands = await getPagingBrand();

    setBrand(brands.data);
  };
  useEffect(() => {
    if (isModalOpen) {
      getData();
      getBrand();
    }
  }, [id, isModalOpen]);
  useEffect(() => {
    if (isModalOpen) getData();
  }, [pageSize, pageIndex, isModalOpen]);
  return (
    <>
      <span
        type="primary"
        onClick={showModal}
        style={{
          color: "blue",
          fontWeight: 500,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        Xem
      </span>
      <Modal
        title={`Danh sách bài viết của ${name}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1300}
        footer={null}
      >
        <div className="px-2 py-2 w-100">
          <h5
            // className={styles["total-money"]}
            style={{
              display: "flex",
              gap: "10px",
              fontWeight: 900,
              borderRadius: "10px",
            }}
          >
            TỔNG SỐ TIỀN ĐÃ CHI{"  "}
            <span style={{ color: "green" }}>
              {new Intl.NumberFormat().format(totalMoneyChi || 0)} VNĐ
            </span>
          </h5>
          <Row gutter={[10, 10]}>
            <Col md={4}>
              <label style={{ fontWeight: 500 }}>Nội dung</label>
              <Input
                placeholder="Nội dung"
                style={{ height: 40 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <label style={{ fontWeight: 500 }}>Trạng thái</label>
              <Select
                placeholder="Trạng thái"
                style={{ height: 40 }}
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
            <Col md={4}>
              <label style={{ fontWeight: 500 }}>Brand</label>
              <Select
                placeholder="Chọn brand"
                allowClear
                onChange={(value) => setSelectedBrand(value)}
                defaultValue={selectedBrand}
                options={brand?.map((item) => {
                  return {
                    label: item?.name,
                    value: item?._id,
                  };
                })}
                style={{ width: "100%" }}
              />
            </Col>
            <Col md={5}>
              <label style={{ fontWeight: 500 }}>Sắp xếp theo</label>
              <Select
                placeholder="Sắp xếp"
                className="w-100"
                style={{ height: 40 }}
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
                  className="p-2 border"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat={"dd-MM-yyyy"}
                  locale={vi}
                />
                <DatePicker
                  className="p-2 border"
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
                style={{
                  background: "green",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  borderColor: "green",
                }}
                loading={loadingExcel}
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
                title: "Brand",
                dataIndex: "brand",
                key: "brand",
                width: "10%",
                render: (value) => value?.name,
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
                render: (_) => STATUS_POST[_],

                width: "10%",
              },
              {
                title: "Thời gian tạo",
                dataIndex: "createdAt",
                key: "createdAt",
                render: (val) => val && moment(val).format("HH:mm DD/MM/YYYY"),
                width: "15%",
              },

              {
                title: "Hành động",
                dataIndex: "actions",
                key: "actions",
                render: (_, record) => {
                  return (
                    <Space size="middle">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "15px",
                        }}
                      >
                        <ModalExportTraffic id={record?._id} />
                        <ModalEditPost
                          record={record}
                          brand={brand}
                          getData={() => getData()}
                        />

                        <Popconfirm
                          title="Bạn có chắc chắn muốn xóa bài viết?"
                          onConfirm={() => confirm(record)}
                          okText="Đồng ý"
                          cancelText="Không"
                        >
                          <DeleteOutlined
                            style={{ color: "red", fontSize: "20px" }}
                          />
                        </Popconfirm>
                      </div>
                    </Space>
                  );
                },
                width: "10%",
              },
            ]}
            onChange={(e) => handleOnChangeTable(e)}
          ></Table>
        </div>
      </Modal>
    </>
  );
};
export default ModalListPost;

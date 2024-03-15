/* eslint-disable react/jsx-no-undef */
import React, { useState } from "react";
import "antd/dist/antd.css";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DatePicker from "react-datepicker";
import {
  Col,
  Container,
  Input,
  InputGroup,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import { Table, Space, Popconfirm, Pagination, Spin, Select } from "antd";
import { useEffect } from "react";
import {
  getAllPosts,
  deletePost,
  getAllUsers,
  createPost,
  deleteMultiPost,
  activeListPost,
  activeAllPost,
  getPagingPostForAdminExportExcel,
  getPagingBrand,
  getPagingTeam,
} from "../../helpers/helper";

import moment from "moment";
import { useCallback } from "react";
import TextArea from "antd/lib/input/TextArea";
import ModalEditPost from "./ModalEditPost";
import { DeleteOutlined } from "@ant-design/icons";
import vi from "date-fns/locale/vi";
import ModalExportTraffic from "./ModalExportExcelTraffic";
import { toast } from "react-toastify";
import ModalReportList from "./ModalReportList";
const ExcelJS = require("exceljs");
const { Column } = Table;

const STATUS_POST = {
  0: "Chờ leader duyệt",
  1: "Chờ trợ lý duyệt",
  2: "Đang hoạt động",
  3: "Đã tắt",
  4: "Leader từ chối",
  5: "Trợ lý từ chối",
  6: "Đã đủ số lượng hôm nay",
};
function PostList() {
  const DateCompleted = new Date();
  DateCompleted.setDate(DateCompleted.getDate() + 1);
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [stt, setStt] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [totalPageSize, setTotalPageSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [valueCate, setValueCate] = useState("");
  const [startDate, setStartDate] = useState(new Date("2023/10/10"));
  const [endDate, setEndDate] = useState(new Date());
  const [valueStatus, setValueStatus] = useState("");
  const [domainId, setDomainId] = useState("");
  const [brand, setBrand] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState();
  const [selectedTeam, setSelectedTeam] = useState();
  const [brandCreated, setBrandCreated] = useState();
  const [teamCreated, setTeamCreated] = useState();
  const [postContent, setPostContent] = useState("");
  const [totalMoneyChi, setTotalMoneyChi] = useState(0);
  const [postQuantity, setPostQuantity] = useState();
  const [quantityTotal, setQuantityTotal] = useState();
  const [quantityEveryDay, setQuantityEveryDay] = useState();
  const [dateCompleted, setDateCompleted] = useState(new Date(DateCompleted));
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const toggle = useCallback(
    () => setOpenCreatePost(!openCreatePost),
    [openCreatePost]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const getBrand = async () => {
    const brands = await getPagingBrand();
    setBrand(brands.data);
  };
  const getTeam = async () => {
    const teams = await getPagingTeam("", 10000, 1);
    setTeams(teams.data);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const exportExcel = async () => {
    const data = await getPagingPostForAdminExportExcel(
      pageSize,
      pageIndex,
      searchInput,
      valueCate,
      valueStatus,
      domainId,
      userId,
      `sort=${sort}&startDate=${moment(
        startDate
      ).toISOString()}&endDate=${moment(
        endDate
      ).toISOString()}&brand=${selectedBrand}&team=${selectedTeam}`
    );
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
        stt: item?.stt || index + 1,
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
  //allPost
  const [modalAllPost, setModalAllPost] = useState(false);
  const showModalAllPost = () => {
    setModalAllPost(true);
  };

  const handleCancelAllPost = () => {
    setModalAllPost(false);
  };

  /// list post
  const [modalListPost, setModalListPost] = useState(false);
  const showModalListPost = () => {
    setModalListPost(true);
  };

  const handleCancelListPost = () => {
    setModalListPost(false);
  };

  const getPosts = async (
    pageSize,
    pageIndex,
    searchInput,
    cate,
    status,
    domainId,
    userId
  ) => {
    setIsLoading(true);
    const result = await getAllPosts(
      pageSize,
      pageIndex,
      searchInput,
      cate,
      status,
      domainId,
      userId,
      `sort=${sort}&startDate=${moment(
        startDate
      ).toISOString()}&endDate=${moment(
        endDate
      ).toISOString()}&brand=${selectedBrand}&team=${selectedTeam}&stt=${stt}`
    );
    if (result) {
      setIsLoading(false);
      setPosts(result?.data);
      setTotalMoneyChi(result?.totalMoneyChi || 0);
      setTotalPageSize(result?.totalDoc);
    }
  };
  useEffect(() => {
    getBrand();
    getPagingUser();
    getTeam();
    setUser(JSON.parse(sessionStorage.getItem("authUser") || {}));
  }, []);
  useEffect(() => {
    getPosts(
      pageSize,
      pageIndex,
      searchInput,
      valueCate,
      valueStatus,
      domainId,
      userId
    );
  }, [pageIndex, pageSize]);

  const confirm = (post) => {
    if (post) {
      deletePost(post._id)
        .then((res) => {
          if (res?.status === -1) {
            return toast.error(res?.message || "Xóa bài viết thất bại!");
          } else {
            getPosts(pageSize, pageIndex, searchInput, valueCate, valueStatus);
            return toast.success("Xóa bài viết thành công!");
          }
        })
        .catch((error) => {
          return toast.error("Xóa bài viết thất bại!");
        });
    }
  };

  const handleChange = useCallback((e) => {
    setPostContent(e.target.value);
  }, []);

  const getPagingUser = async () => {
    const allUser = await getAllUsers({ pageSize: 999999, pageIndex: 1 });
    setUsers(allUser?.users);
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRowKeys);
    },
  };
  const handleSubmit = useCallback(async () => {
    if (!brandCreated) return toast.warning("Vui lòng chọn brand!");
    if (!teamCreated) return toast.warning("Vui lòng chọn team!");
    const newPost = await createPost({
      content: postContent,
      quantity: postQuantity,
      brand: brandCreated,
      dateCompleted: moment(dateCompleted).toISOString(),
      team: teamCreated,
      quantityTotal,
      quantityEveryDay,
    });
    setPosts([newPost, ...posts]);
    toggle();
    getPosts(
      pageSize,
      pageIndex,
      searchInput,
      valueCate,
      valueStatus,
      domainId,
      userId
    );
  }, [
    postContent,
    postQuantity,
    toggle,
    posts,
    brandCreated,
    teamCreated,
    dateCompleted,
    quantityTotal,
    quantityEveryDay,
  ]);
  const searchPost = () => {
    getPosts(
      pageSize,
      pageIndex,
      searchInput,
      valueCate,
      valueStatus,
      domainId,
      userId
    );
  };
  const handleDeteleMultiPosts = () => {
    if (selectedRows.length === 0) {
      toast.warning("Vui lòng chọn bài viết muốn xóa!");
      // notification.warning({
      //   message: "Xóa bài viết",
      //   description: "Vui lòng chọn bài viết muốn xóa!",
      // });
      return;
    } else {
      deleteMultiPost(selectedRows)
        .then(() => {
          getPosts(
            pageSize,
            pageIndex,
            searchInput,
            valueCate,
            valueStatus,
            domainId,
            userId
          );
          toast.success("Xóa bài viết thành công!");

          handleCancel();
        })
        .catch((err) => {
          toast.error("Xóa bài viết thất bại!");
        });
    }
  };

  const handleActiveListPost = () => {
    if (selectedRows.length === 0) {
      toast.warning("Vui lòng chọn bài viết muốn bật!");

      return;
    } else {
      activeListPost(selectedRows)
        .then(() => {
          getPosts(
            pageSize,
            pageIndex,
            searchInput,
            valueCate,
            valueStatus,
            domainId,
            userId
          );

          toast.success("Bật bài viết thành công!");
          setSelectedRows([]);
          handleCancelListPost();
        })
        .catch((err) => {
          toast.error("Bật bài viết thất bại!");
        });
    }
  };
  const handleActiveAllPost = () => {
    activeAllPost()
      .then(() => {
        getPosts(
          pageSize,
          pageIndex,
          searchInput,
          valueCate,
          valueStatus,
          domainId,
          userId
        );

        setSelectedRows([]);
        handleCancelAllPost();
        return toast.success("Bật bài viết thành công!");
      })
      .catch((err) => {
        return toast.error("Bật bài viết thất bại!");
      });
  };
  return (
    <React.Fragment>
      <Spin spinning={false}>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb title="Bài viết" pageTitle="Quản lý bài viết" />
            <Row className="mb-3">
              <Col className="mt-2" lg="12">
                <h4
                  style={{
                    display: "flex",
                    gap: "10px",
                    borderRadius: "10px",
                    border: "2px green solid",
                    padding: "10px",
                    fontWeight: 700,
                  }}
                >
                  TỔNG SỐ TIỀN ĐÃ CHI{" "}
                  <span style={{ color: "green" }}>
                    {new Intl.NumberFormat().format(totalMoneyChi)} VNĐ
                  </span>
                </h4>
              </Col>
              <Col className="mt-2" lg="2">
                <div>
                  <label>Nội dung</label>
                  <InputGroup>
                    <Input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Tìm kiếm..."
                    />
                  </InputGroup>
                </div>
              </Col>
              <Col className="mt-2" lg="2">
                <div>
                  <label>STT</label>
                  <InputGroup>
                    <Input
                      value={stt}
                      onChange={(e) => setStt(e.target.value)}
                      placeholder="STT"
                    />
                  </InputGroup>
                </div>
              </Col>
              <Col className="mt-2" lg="2">
                <div>
                  <label>Trạng thái bài viết</label>
                  <Select
                    allowClear={true}
                    style={{ width: "100%" }}
                    onChange={(value) => {
                      setValueStatus(value);
                    }}
                    placeholder="Trạng thái"
                  >
                    <Option label="Đã đăng" key={"2"}>
                      Đang hiển thị
                    </Option>
                    <Option label="Đã ẩn" key={"0,1"}>
                      Đang chờ duyệt
                    </Option>
                    <Option label="Đã ẩn" key={"3,4,5"}>
                      Đã tắt
                    </Option>
                  </Select>
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
                      dateFormat={"dd-MM-yyyy"}
                      startDate={startDate}
                      endDate={endDate}
                      minDate={new Date("2023/10/10")}
                      locale={vi}
                    />
                    <DatePicker
                      className="p-2 border"
                      selected={endDate}
                      dateFormat={"dd-MM-yyyy"}
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
              <Col className="mt-2" lg="2">
                <div>
                  <label>Sắp xếp theo</label>
                  <Select
                    placeholder="Sắp xếp theo"
                    onChange={(value) => setSort(value)}
                    defaultValue={sort}
                    options={[
                      {
                        label: "Thời gian",
                        value: "createdAt",
                      },
                      {
                        label: "Nội dung",
                        value: "content",
                      },
                      {
                        label: "Số traffic hoàn thành",
                        value: "userCompleted",
                      },
                    ]}
                    style={{ width: "100%" }}
                  />
                </div>
              </Col>
              <Col className="mt-2" lg="2">
                <div>
                  <label>Brand</label>
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
                </div>
              </Col>
              <Col className="mt-2" lg="2">
                <div>
                  <label>Team</label>
                  <Select
                    placeholder="Chọn team"
                    allowClear
                    onChange={(value) => setSelectedTeam(value)}
                    defaultValue={selectedTeam}
                    options={teams?.map((item) => {
                      return {
                        label: item?.name,
                        value: item?._id,
                      };
                    })}
                    style={{ width: "100%" }}
                  />
                </div>
              </Col>
              <Col className="mt-2" lg="2">
                <div>
                  <label>Người tạo</label>
                  <Select
                    showSearch
                    style={{
                      width: 200,
                    }}
                    allowClear
                    placeholder="Chọn người tạo"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "").includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={users?.map((item) => {
                      return {
                        label: item?.username,
                        value: item?._id,
                      };
                    })}
                    onChange={(value) => setUserId(value)}
                  />
                </div>
              </Col>
              <Col className="mt-2 d-flex gap-3" lg="12">
                <div>
                  <Button onClick={() => searchPost()}>Tìm kiếm</Button>
                </div>
                {user?.user?.roleOfUser?.name === "superAdmin" && (
                  <Button
                    style={{ backgroundColor: "green", border: "none" }}
                    onClick={toggle}
                  >
                    Thêm mới
                  </Button>
                )}
                <Button
                  style={{ backgroundColor: "#018749", border: "none" }}
                  onClick={() => exportExcel()}
                >
                  Xuất excel
                </Button>
                {user?.user?.roleOfUser?.name === "superAdmin" && (
                  <Button
                    style={{ backgroundColor: "#CD853F	", border: "none" }}
                    onClick={showModalAllPost}
                  >
                    Bật tất cả bài viết
                  </Button>
                )}
                {selectedRows.length !== 0 &&
                  user?.user?.roleOfUser?.name === "superAdmin" && (
                    <>
                      <Button
                        style={{ backgroundColor: "#33CCFF	", border: "none" }}
                        onClick={showModalListPost}
                      >
                        Bật tất các bài viết đã chọn
                      </Button>
                      <Button
                        style={{ backgroundColor: "red", border: "none" }}
                        onClick={() => showModal()}
                      >
                        Xóa bài viết
                      </Button>
                    </>
                  )}
              </Col>
            </Row>
            {/* modal delete multi post */}
            {/* <Modal
              title="Xóa bài viết đã chọn"
              open={isModalOpen}
              onOk={handleDeteleMultiPosts}
              onCancel={handleCancel}
            >
              Bạn có chắc chắn muốn xóa các bài viết đã chọn?
            </Modal> */}
            <Modal
              isOpen={modalListPost}
              toggle={handleCancelListPost}
              // className={className}
              centered
              backdrop={true}
              // keyboard={keyboard}
            >
              <ModalHeader
                className={"modal-header"}
                toggle={handleCancelListPost}
              >
                Bật các bài viết đã chọn
              </ModalHeader>
              <ModalBody>
                <p>Bạn có chắc chắn muốn bật các bài viết đã chọn?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  className="w-100"
                  onClick={handleActiveListPost}
                >
                  Bật
                </Button>
              </ModalFooter>
            </Modal>
            <Modal
              isOpen={modalAllPost}
              toggle={handleCancelAllPost}
              // className={className}
              centered
              backdrop={true}
              // keyboard={keyboard}
            >
              <ModalHeader
                className={"modal-header"}
                toggle={handleCancelAllPost}
              >
                Bật tất cả các bài viết
              </ModalHeader>
              <ModalBody>
                <p>Bạn có chắc chắn muốn bật tất cả các bài viết?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  className="w-100"
                  onClick={handleActiveAllPost}
                >
                  Bật
                </Button>
              </ModalFooter>
            </Modal>
            <Modal
              isOpen={isModalOpen}
              toggle={handleCancel}
              // className={className}
              centered
              backdrop={true}
              // keyboard={keyboard}
            >
              <ModalHeader className={"modal-header"} toggle={handleCancel}>
                Xóa bài viết
              </ModalHeader>
              <ModalBody>
                <p>Bạn có chắc chắn muốn xóa các bài viết đã chọn?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  className="w-100"
                  onClick={handleDeteleMultiPosts}
                >
                  Xóa
                </Button>
              </ModalFooter>
            </Modal>
            <Modal
              isOpen={openCreatePost}
              toggle={toggle}
              // className={className}
              centered
              backdrop={true}
              // keyboard={keyboard}
            >
              <ModalHeader className={"modal-header"} toggle={toggle}>
                Tạo bài đăng
              </ModalHeader>
              <ModalBody>
                <TextArea
                  className={`w-100 h-100 post-content-input`}
                  rows={8}
                  placeholder={`keywords###domain.com`}
                  value={postContent}
                  onChange={handleChange}
                ></TextArea>
                <div className="grid">
                  <label>Brand</label>
                  <Select
                    className="w-100"
                    placeholder="Chọn brand"
                    allowClear
                    onChange={(value) => setBrandCreated(value)}
                    defaultValue={brandCreated}
                    options={brand?.map((item) => {
                      return {
                        label: item?.name,
                        value: item?._id,
                      };
                    })}
                  ></Select>
                </div>
                <div className="grid">
                  <label>Team</label>
                  <Select
                    className="w-100"
                    placeholder="Chọn team"
                    allowClear
                    onChange={(value) => setTeamCreated(value)}
                    defaultValue={teamCreated}
                    options={teams?.map((item) => {
                      return {
                        label: item?.name,
                        value: item?._id,
                      };
                    })}
                  ></Select>
                </div>
                <div className="grid">
                  <label>Số lượng mỗi ngày</label>
                  <Input
                    className=""
                    placeholder={`Số lượng mỗi ngày`}
                    value={quantityEveryDay}
                    onChange={(e) => setQuantityEveryDay(e.target.value)}
                    type="number"
                  />
                </div>
                <div className="grid">
                  <label>Số lượng tổng</label>
                  <Input
                    className=""
                    placeholder={`Số lượng tổng`}
                    value={quantityTotal}
                    onChange={(e) => setQuantityTotal(e.target.value)}
                    type="number"
                  />
                </div>
                <label className="mr-2">Thời gian hoàn thành</label>
                <DatePicker
                  className="p-2 border ml-2"
                  selected={dateCompleted}
                  onChange={(date) => setDateCompleted(date)}
                  dateFormat={"dd-MM-yyyy"}
                  minDate={new Date()}
                  locale={vi}
                ></DatePicker>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  className="w-100"
                  onClick={handleSubmit}
                >
                  Tạo mới
                </Button>
              </ModalFooter>
            </Modal>
            <Row>
              <Col lg={12}>
                <Table
                  rowKey="_id"
                  dataSource={posts}
                  pagination={false}
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: selectedRows,
                    ...rowSelection,
                  }}
                >
                  <Column scope="col" style={{ width: "50px" }} />
                  <Column
                    title="STT"
                    dataIndex="stt"
                    key="stt"
                    // render={(item) => <>{item?.split("###")?.[0]}</>}
                  />
                  <Column
                    title="Keyword"
                    dataIndex="content"
                    key="content"
                    render={(item) => <>{item?.split("###")?.[0]}</>}
                  />

                  <Column
                    title="Domain"
                    dataIndex="content"
                    key="content"
                    render={(item) => <>{item?.split("###")?.[1]}</>}
                  />

                  <Column
                    title="Người tạo"
                    dataIndex="userId"
                    key="userId"
                    render={(_) => _?.username}
                  />
                  <Column
                    title="Brand"
                    dataIndex="brand"
                    key="brand"
                    render={(_) => _?.name}
                  />
                  <Column
                    title="Tổng tiền chi"
                    dataIndex="totalMoney"
                    key="totalMoney"
                    render={(_) => `${new Intl.NumberFormat().format(_)} VNĐ`}
                  />
                  <Column
                    title="Traffic mỗi ngày"
                    dataIndex="quantityEveryDay"
                    key="quantityEveryDay"
                  />
                  <Column
                    title="Số lượng hoàn thành"
                    dataIndex="userCompleted"
                    key="userCompleted"
                    render={(_) => _?.length || 0}
                  />

                  <Column
                    title="Trạng thái"
                    dataIndex="status"
                    key="status"
                    render={(_) => {
                      return STATUS_POST[_];
                      // if (_ === 0 || _ === 1) {
                      //   return (
                      //     <Tooltip title={STATUS_POST[_]}>
                      //       <MdPendingActions color="blue" size={20} />
                      //     </Tooltip>
                      //   );
                      // } else if (_ === 2) {
                      //   return (
                      //     <Tooltip title={STATUS_POST[_]}>
                      //       <BsCheckCircleFill color="green" size={20} />
                      //     </Tooltip>
                      //   );
                      // } else {
                      //   return (
                      //     <Tooltip title={STATUS_POST[_]}>
                      //       <AiFillCloseSquare color="red" size={20} />
                      //     </Tooltip>
                      //   );
                      // }
                    }}
                  />
                  <Column
                    title="Thời gian bắt đầu"
                    dataIndex="startDate"
                    key="startDate"
                    render={(_) => moment(_).format("HH:mm DD-MM-YYYY")}
                  />
                  <Column
                    title="Dự kiến hoàn thành"
                    dataIndex="endDate"
                    key="endDate"
                    render={(_) => moment(_).format("HH:mm DD-MM-YYYY")}
                  />
                  <Column title="Note" dataIndex="note" key="note" />
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
                          <ModalReportList id={record?._id} />
                          <ModalExportTraffic id={record?._id} />
                          <ModalEditPost
                            statusPost={STATUS_POST}
                            record={record}
                            teams={teams}
                            brand={brand}
                            getData={() =>
                              getPosts(
                                pageSize,
                                pageIndex,
                                searchInput,
                                valueCate,
                                valueStatus,
                                domainId,
                                userId
                              )
                            }
                          />
                          {(user?.user?.roleOfUser?.name === "superAdmin" ||
                            (record?.status <= 1 &&
                              user?.user?.roleOfUser?.name === "leader")) && (
                            <Popconfirm
                              title="Are you sure to delete this post?"
                              onConfirm={() => confirm(val)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <DeleteOutlined
                                style={{ color: "red", fontSize: "20px" }}
                              />
                            </Popconfirm>
                          )}
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
                      setPageIndex(page !== 0 ? page : 1);
                      setPageSize(pageSize);
                    }}
                    showTotal={(total) => `Tổng ${total} bài viết`}
                    total={totalPageSize}
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

export default PostList;

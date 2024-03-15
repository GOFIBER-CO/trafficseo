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
  InputGroupText,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import {
  Table,
  Space,
  Popconfirm,
  notification,
  Pagination,
  PaginationProps,
  Spin,
  Select,
  Tooltip,
} from "antd";

import { useEffect } from "react";
import {
  getAllUsers,
  createPost,
  deleteMultiPost,
  activeListPost,
  getPagingBrand,
  getPostPending,
  getExcelPostPending,
  getPagingTeam,
} from "../../helpers/helper";

import moment from "moment";
import { useCallback } from "react";
import TextArea from "antd/lib/input/TextArea";

import vi from "date-fns/locale/vi";

import { toast } from "react-toastify";

import ModalAcceptPost from "./ModalAcceptPost";
import ModalRejectPost from "./ModalRejectPost";
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
function PostPending() {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [stt, setStt] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [users, setUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState();
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
  const [brandCreated, setBrandCreated] = useState();
  const [postContent, setPostContent] = useState("");
  const [totalMoneyChi, setTotalMoneyChi] = useState(0);
  const [postQuantity, setPostQuantity] = useState();
  const [userId, setUserId] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const toggle = useCallback(
    () => setOpenCreatePost(!openCreatePost),
    [openCreatePost]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getBrand = async () => {
    const brands = await getPagingBrand();
    setBrand(brands.data);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const getTeam = async () => {
    const teams = await getPagingTeam("", 10000, 1);
    setTeams(teams.data);
  };
  /// list post
  const [modalListPost, setModalListPost] = useState(false);

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
    const result = await getPostPending(
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
      ).toISOString()}&brand=${selectedBrand}&stt=${stt}&team=${selectedTeam}`
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
    getTeam();
    getPagingUser();
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

  const exportExcel = async () => {
    const data = await getExcelPostPending(
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
      ).toISOString()}&brand=${selectedBrand}&stt=${stt}&team=${selectedTeam}`
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Danh sach bai viet cho duyet`);
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
      "Người tạo",
      "Brand",
      "Team",
      "Số lượng",
      "Thời gian tạo",
      "Dự kiến hoàn thành",
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
      { key: "user", width: 30, border: optionBorder },
      { key: "brand", width: 30, border: optionBorder },
      { key: "team", width: 30, border: optionBorder },
      { key: "quantity", width: 30, border: optionBorder },
      { key: "createdAt", width: 20, border: optionBorder },
      { key: "dateCompleted", width: 30, border: optionBorder },
    ];
    //Add dataSet
    let dataSetExport = [];
    let nf = new Intl.NumberFormat("en-US");

    data?.data?.map((item, index) => {
      let a = {
        stt: item?.index || index + 1,
        keyword: item?.content?.split("###")?.[0],
        domain: item?.content?.split("###")?.[1],
        quantity: item?.quantity,
        user: item?.userId?.username,
        brand: item?.brand?.name,
        team: item?.team?.name,

        createdAt: moment(item?.createdAt)
          .format("HH:ss DD-MM-yyyy")
          ?.toString(),
        dateCompleted: moment(item?.endDate)
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
      anchor.download = "Danh_sach_bai_viet_cho_duyet.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };
  const handleChange = useCallback((e) => {
    setPostContent(e.target.value);
  }, []);
  const handleChangeQuantity = useCallback((e) => {
    setPostQuantity(e.target.value);
  }, []);
  const getPagingUser = async () => {
    const allUser = await getAllUsers(
      { pageSize: 999999, pageIndex: 1 },
      `acceptPost=true`
    );
    setUsers(allUser?.users);
  };

  const handleSubmit = useCallback(async () => {
    if (!brandCreated) return toast.warning("Vui lòng chọn brand!");

    const newPost = await createPost({
      content: postContent,
      quantity: postQuantity,
      brand: brandCreated,
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
  }, [postContent, postQuantity, toggle, posts]);
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

  return (
    <React.Fragment>
      <Spin spinning={false}>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb
              title="Bài viết chờ duyệt"
              pageTitle="Quản lý bài viết"
            />
            <Row className="mb-3">
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
                    ]}
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
              <Col className="mt-2 d-flex gap-3" lg="12">
                <div className="d-flex gap-2">
                  <Button onClick={() => searchPost()}>Tìm kiếm</Button>
                  <Button
                    style={{ backgroundColor: "green", borderColor: "green" }}
                    onClick={() => exportExcel()}
                  >
                    Xuất excel
                  </Button>
                </div>
              </Col>
            </Row>

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
                  placeholder={`Điểm nhiều hơn 10k sẽ được ưu tiên hiển thị.
Nhập 3 link dạng: keywords###domain.com`}
                  value={postContent}
                  onChange={handleChange}
                ></TextArea>
                <Select
                  className="mt-3 w-100"
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
                <Input
                  className="mt-3"
                  placeholder={`Số lượng mong muốn`}
                  value={postQuantity}
                  onChange={handleChangeQuantity}
                  type="number"
                />
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
                <Table rowKey="_id" dataSource={posts} pagination={false}>
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
                    title="Team"
                    dataIndex="team"
                    key="team"
                    render={(_) => _?.name}
                  />

                  <Column
                    title="Traffic mỗi ngày"
                    dataIndex="quantityEveryDay"
                    key="quantityEveryDay"
                  />
                  <Column
                    title="Traffic tổng"
                    dataIndex="quantityTotal"
                    key="quantityTotal"
                  />
                  <Column
                    title="Trạng thái"
                    dataIndex="status"
                    key="status"
                    render={(_) => {
                      return STATUS_POST[_];
                    }}
                  />
                  <Column
                    title="Thời gian tạo"
                    dataIndex="createdAt"
                    key="createdAt"
                    render={(_) => moment(_).format("HH:mm DD-MM-YYYY")}
                  />
                  <Column
                    title="Dự kiến hoàn thành"
                    dataIndex="endDate"
                    key="endDate"
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
                          <ModalAcceptPost
                            id={record?._id}
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
                          <ModalRejectPost
                            id={record?._id}
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
                          {/* <Popconfirm
                            title="Are you sure to delete this post?"
                            onConfirm={() => confirm(val)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <DeleteOutlined
                              style={{ color: "red", fontSize: "20px" }}
                            />
                          </Popconfirm> */}
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

export default PostPending;

import React, { useEffect, useState } from "react";

//import Components
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Col, Container, Input, InputGroup, Row, Button } from "reactstrap";

import DatePicker from "react-datepicker";
import vi from "date-fns/locale/vi";
import { Space, Table, Popconfirm, Pagination } from "antd";
import { Link } from "react-router-dom";
import {
  DeleteRecordBlockUser,
  getPagingUserBlock,
} from "../../helpers/helper";
import { DeleteOutlined } from "@ant-design/icons";

import moment from "moment";
import { toast } from "react-toastify";

const { Column } = Table;

const UserBlock = () => {
  document.title = "Users Management";
  const [checkId, setCheckId] = useState([]);
  const [users, setUsers] = useState([]);
  const [total, setTotals] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("createdAt");
  const [acceptPost, setAcceptPost] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [status, setStatus] = useState();
  const [startDate, setStartDate] = useState(new Date("2023/04/01"));
  const [endDate, setEndDate] = useState(new Date());

  const confirm = (user) => {
    if (user.id) {
      DeleteRecordBlockUser(user.id)
        .then((res) => {
          getUsers();
          toast.success("Xóa record thành công!");
        })
        .catch((er) => {
          toast.error("Xóa record thất bại!");
        });
    }
  };

  const cancel = (e) => {
    console.log(e);
  };

  useEffect(() => {
    getUsers();
  }, [pageIndex, pageSize]);

  const getUsers = () => {
    let dataReq = {
      pageSize: pageSize,
      pageIndex: pageIndex,
      search: searchInput,
    };
    getPagingUserBlock(
      dataReq,
      `sort=${sort}&acceptPost=${acceptPost}&startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}`
    ).then((res) => {
      setUsers(res?.data);
      setTotals(res?.totalDocs);
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Thành Viên Bị Khóa"
            pageTitle="Quản lý thành viên"
          />
          <Row className="mb-3">
            <Col lg="3">
              <div>
                <label>Tìm kiếm</label>
                <InputGroup>
                  <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Nhập tên hoặc ip"
                  />
                  <Button onClick={() => getUsers()}>
                    <i className="ri-search-line"></i>
                  </Button>
                </InputGroup>
              </div>
            </Col>

            {/* <Col lg={2}>
              <label>Sắp xếp theo</label>
              <Select
                style={{ width: "100%" }}
                value={sort}
                onChange={(value) => setSort(value)}
                allowClear
                onClear={() => setSort("")}
                showSearch
                placeholder="Sắp xếp"
              >
                <Option key={0} value={"createdAt"} label={"Thời gian tạo"}>
                  <div className="d-flex justify-content-start align-items-center">
                    Thời gian tạo{" "}
                  </div>
                </Option>
                <Option key={1} value={"point"} label={" Số điểm"}>
                  <div className="d-flex justify-content-start align-items-center">
                    Số điểm{" "}
                  </div>
                </Option>
              </Select>
            </Col> */}

            <Col lg={2}>
              <div>
                <label>Thời gian</label>
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
              </div>
            </Col>
            <Col lg="12">
              <div
                className="gap-3"
                style={{
                  display: "flex",
                  justifyContent: "start",
                  marginTop: "20px",
                }}
              >
                <Button onClick={getUsers}>Tìm kiếm</Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Table dataSource={users} pagination={false}>
                <Column
                  title="Tên"
                  dataIndex="user"
                  key="user"
                  render={(value, record) => {
                    return <>{value?.username}</>;
                  }}
                />
                <Column
                  title="Email"
                  dataIndex="user"
                  key="user"
                  render={(value, record) => {
                    return <>{value?.email}</>;
                  }}
                />
                <Column
                  title="Số điểm"
                  dataIndex="user"
                  key="user"
                  render={(value, record) => {
                    return <>{value?.point}</>;
                  }}
                />

                <Column title="IP" dataIndex="ip" key="ip" />
                <Column title="FP" dataIndex="fp" key="fp" />

                <Column
                  title="Người dùng trùng FP"
                  dataIndex="listUserSame"
                  key="listUserSame"
                  render={(_) => {
                    const name = _?.map((item) => item?.username);
                    return name?.toString();
                  }}
                />
                <Column
                  title="Thời gian"
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
                          gap: "15px",
                        }}
                      >
                        <Popconfirm
                          title="Bạn có chắc muốn xóa người dùng?"
                          onConfirm={() => confirm(val)}
                          onCancel={cancel}
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
              <Pagination
                style={{ float: "right", marginTop: "10px" }}
                total={total}
                showTotal={(total) => `Total ${total} items`}
                showSizeChanger
                defaultPageSize={pageSize}
                current={pageIndex}
                onChange={(page, pageSize) => {
                  setPageIndex(page);
                  setPageSize(pageSize);
                }}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserBlock;

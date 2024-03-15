import React, { useEffect, useState } from "react";

//import Components
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Col, Container, Input, InputGroup, Row, Button } from "reactstrap";

// Formik validation

import DatePicker from "react-datepicker";
import vi from "date-fns/locale/vi";
import { Space, Table, Select, Popconfirm, Pagination } from "antd";

import {
  deleteUser,
  getAllRole,
  getAllUsers,
  getPagingTeam,
} from "../../helpers/helper";
import {
  CheckSquareOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ModalAddUser from "./ModalAddUser";
import ModalEditUser from "./ModalEditUser";
import moment from "moment";
import ModalAcceptPost from "./ModalAcceptPostAll";
import ModalDisableUpPost from "./ModalDisableUpPost";
import ModalAddPointUser from "./ModalAddPointUser";
import ModalViewHistoryPoint from "./ModalViewHistoryPoint";
import ModalListPost from "./ModalListPost";
import { toast } from "react-toastify";
import ModalViewHistoryAllTime from "./ModalViewHistoryAllTime";
import ModalTopPointUser from "./ModalTopPointUser";
import { MdPendingActions } from "react-icons/md";
const { Option } = Select;
const { Column } = Table;

const UsersManagement = () => {
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
  const [team, setTeam] = useState();
  const [teams, setTeams] = useState([]);
  const [role, setRole] = useState();
  const [roles, setRoles] = useState([]);
  const onCheckUser = (id) => {
    const index = checkId.indexOf(id);
    if (index !== -1) {
      setCheckId((data) => {
        data.splice(index, 1);
        return [...data];
      });
    } else {
      setCheckId((data) => {
        data.push(id);
        return [...data];
      });
    }
  };
  const handleCheckAll = (checked) => {
    if (checked) {
      const listId = users?.map((item) => item?._id);
      setCheckId(listId);
    } else {
      setCheckId([]);
    }
  };
  const getTeams = async () => {
    let res = await getPagingTeam("", 1000000, 1);
    setTeams(res?.data);
  };

  const getPhanquyen = async () => {
    let res = await getAllRole(1000000, 1);
    setRoles(res?.role);
  };
  const confirm = (user) => {
    if (user?._id) {
      deleteUser(user.id)
        .then((res) => {
          getUsers();
          return toast.success("Xóa người dùng thành công!");
        })
        .catch((er) => {
          return toast.error("Xóa người dùng thất bại!");
        });
    }
  };

  const cancel = (e) => {
    console.log(e);
  };
  const getUsers = () => {
    let dataReq = {
      pageSize: pageSize,
      pageIndex: pageIndex,
      search: searchInput,
      status: status,
    };
    getAllUsers(
      dataReq,
      `sort=${sort}&isAccept=${acceptPost}&startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}&team=${team}&role=${role}`
    ).then((res) => {
      setUsers(res?.users);
      setTotals(res?.total);
    });
  };
  useEffect(() => {
    getUsers();
  }, [pageIndex, pageSize]);
  useEffect(() => {
    getTeams();
    getPhanquyen();
  }, []);
  const handleStatusChange = (e) => {
    setStatus(e);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Thành Viên" pageTitle="Quản lý thành viên" />
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
            <Col lg={2}>
              <label>Trạng thái tài khoản</label>
              <Select
                style={{ width: "100%" }}
                value={status}
                onChange={handleStatusChange}
                allowClear
                onClear={() => setStatus("")}
                showSearch
                placeholder="Trạng thái tài khoản"
              >
                <Option key={0} value={true} label={"Hoạt động"}>
                  <div className="d-flex justify-content-start align-items-center">
                    Hoạt động{" "}
                    <CheckSquareOutlined
                      style={{ marginLeft: 12, color: "green" }}
                    />
                  </div>
                </Option>
                <Option key={1} value={false} label={"Đã khoá"}>
                  <div className="d-flex justify-content-start align-items-center">
                    Đã khoá{" "}
                    <CloseSquareOutlined
                      style={{ marginLeft: 12, color: "red" }}
                    />
                  </div>
                </Option>
              </Select>
            </Col>
            <Col lg={2}>
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
                <Option key={1} value={"point"} label={"Số điểm"}>
                  <div className="d-flex justify-content-start align-items-center">
                    Số điểm{" "}
                  </div>
                </Option>
              </Select>
            </Col>
            <Col lg={2}>
              <label>Trạng thái duyệt</label>
              <Select
                style={{ width: "100%" }}
                value={acceptPost}
                onChange={(value) => setAcceptPost(value)}
                allowClear
                onClear={() => setAcceptPost("")}
                showSearch
                placeholder="Trạng thái duyệt"
              >
                <Option key={0} value={1}>
                  <div className="d-flex justify-content-start align-items-center">
                    Đã duyệt
                    <CheckSquareOutlined
                      style={{ marginLeft: 12, color: "green" }}
                    />
                  </div>
                </Option>
                <Option key={1} value={0}>
                  <div className="d-flex justify-content-start align-items-center">
                    Chờ duyệt
                    <MdPendingActions
                      style={{ marginLeft: 12, color: "blue" }}
                    />
                  </div>
                </Option>
                <Option key={1} value={-1}>
                  <div className="d-flex justify-content-start align-items-center">
                    Không duyệt
                    <CloseSquareOutlined
                      style={{ marginLeft: 12, color: "red" }}
                    />
                  </div>
                </Option>
              </Select>
            </Col>
            <Col lg={2}>
              <div>
                <label>Thời gian tạo</label>
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
            <Col lg={2}>
              <label>Team</label>
              <Select
                style={{ width: "100%" }}
                value={team}
                onChange={setTeam}
                allowClear
                onClear={() => setTeam(null)}
                showSearch
                placeholder="Team"
              >
                {teams?.map((item, index) => (
                  <Option key={index} value={item?._id} label={item?.name}>
                    <div className="d-flex justify-content-start align-items-center">
                      {item?.name}
                    </div>
                  </Option>
                ))}
              </Select>
            </Col>
            <Col lg={2}>
              <label>Phân quyền</label>
              <Select
                style={{ width: "100%" }}
                value={role}
                onChange={setRole}
                allowClear
                onClear={() => setRole(null)}
                showSearch
                placeholder="Phân quyền"
              >
                {roles?.map((item, index) => (
                  <Option
                    key={index}
                    value={item?._id}
                    label={item?.name?.toUpperCase()}
                  >
                    <div className="d-flex justify-content-start align-items-center">
                      {item?.name?.toUpperCase()}
                    </div>
                  </Option>
                ))}
              </Select>
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
                <ModalAddUser getData={getUsers} />
                <ModalTopPointUser />
                <ModalAcceptPost listId={checkId} getData={getUsers} />
                <ModalDisableUpPost listId={checkId} getData={getUsers} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Table dataSource={users} pagination={false}>
                <Column
                  key="id"
                  title={
                    <input
                      type="checkbox"
                      onClick={(e) => handleCheckAll(e.target.checked)}
                      checked={checkId?.length === users?.length}
                    />
                  }
                  render={(val, rec, index) => {
                    return (
                      <input
                        type="checkbox"
                        checked={checkId?.includes(rec?._id)}
                        onClick={() => onCheckUser(rec?._id)}
                      />
                    );
                  }}
                />

                <Column
                  title="Tên"
                  dataIndex="firstName"
                  key="firstName"
                  render={(value, record) => {
                    return <>{record?.username}</>;
                  }}
                />
                <Column title="Email" dataIndex="email" key="email" />
                <Column title="Telegram" dataIndex="telegram" key="telegram" />
                <Column title="Số điểm" dataIndex="point" key="point" />
                <Column
                  title="Team"
                  dataIndex="team"
                  key="team"
                  render={(value) => {
                    const temp = value?.map((item) => item?.name);
                    return <>{temp?.toString()}</>;
                  }}
                />
                <Column
                  title="Phân quyền"
                  dataIndex="role"
                  key="role"
                  render={(value, record) => {
                    return <>{record?.roleOfUser?.name?.toUpperCase()}</>;
                  }}
                />
                <Column title="IP" dataIndex="ip" key="ip" />
                <Column
                  title="Thời gian tạo"
                  dataIndex="createdAt"
                  key="createdAt"
                  render={(_) => moment(_).format("HH:mm DD-MM-YYYY")}
                />
                <Column
                  title="Tình trạng"
                  dataIndex="isActivated"
                  key="isActivated"
                  render={(_) => (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {_ ? (
                        <CheckSquareOutlined style={{ color: "green" }} />
                      ) : (
                        <CloseSquareOutlined style={{ color: "red" }} />
                      )}
                    </div>
                  )}
                />
                <Column
                  title="Trạng thái duyệt"
                  dataIndex="isAccept"
                  key="isAccept"
                  render={(_) => (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {_ === 0 ? (
                        <MdPendingActions style={{ color: "blue" }} />
                      ) : _ === 1 ? (
                        <CheckSquareOutlined style={{ color: "green" }} />
                      ) : (
                        <CloseSquareOutlined style={{ color: "red" }} />
                      )}
                    </div>
                  )}
                />
                <Column
                  title="Lịch sử điểm"
                  dataIndex="acceptPost"
                  key="acceptPost"
                  render={(_, record) => (
                    <ModalViewHistoryAllTime id={record?._id} />
                  )}
                />
                <Column
                  title="Bài viết"
                  dataIndex="acceptPost"
                  key="acceptPost"
                  render={(_, record) => (
                    <ModalListPost id={record?._id} name={record?.username} />
                  )}
                />
                <Column
                  title="Hoạt động"
                  key="acceptPost"
                  dataIndex="acceptPost"
                  render={(val, record) => (
                    <Space size="middle">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        {/* {val && (
                          <ModalAddPointUser
                            record={record}
                            getData={getUsers}
                          />
                        )} */}
                        <ModalEditUser record={record} getData={getUsers} />
                        <Popconfirm
                          title="Bạn có chắc muốn xóa người dùng?"
                          onConfirm={() => confirm(record)}
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

export default UsersManagement;

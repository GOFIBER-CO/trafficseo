import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";

import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Container, Input, Row } from "reactstrap";
import { Table, Select, Popconfirm, Pagination, Modal } from "antd";
import "../../App.css";
import {
  getAllMessage,
  deleteMessage,
  getAllUsers,
} from "../../helpers/helper";

import moment from "moment";
import { toast } from "react-toastify";

const { Column } = Table;
function MessageManager() {
  const [message, setMessage] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState([]);
  const [modalExcel, setModalExcel] = useState(false);
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
  const getPagingMessages = () => {
    getAllMessage(searchText, userId, pageSize, pageIndex).then((res) => {
      setMessage(res.messages);
      setTotalPage(res.totalDoc);
    });
  };
  useEffect(() => {
    getPagingMessages();
    setPageIndex(1);
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getPagingMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex]);

  const confirm = (id) => {
    if (id) {
      deleteMessage(id)
        .then((res) => {
          getPagingMessages();
          return toast.success("Xóa tin nhắn thành công!");
        })
        .catch((error) => {
          return toast.error("Xóa tin nhắn thất bại!");
        });
    }
  };
  const onSearch = () => {
    getPagingMessages();
  };

  const handleOnChangeTable = ({ current, pageSize, total }) => {
    setPageIndex(current);
    setPageSize(pageSize);
    getPagingMessages();
  };

  const closeExcelModal = () => {
    setModalExcel(false);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Tin Nhắn" pageTitle="Quản lý Tin Nhắn" />
          <Row className="mb-3">
            <Col lg="2">
              <Input
                placeholder="Nhập tin nhắn muốn tìm"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col lg="2">
              <Select
                style={{ width: "100%" }}
                onChange={(value) => setUserId(value)}
                options={[{ label: "Tất cả", value: "" }, ...user]}
                placeholder="Người dùng"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Col>
            <Col lg="12" style={{ marginTop: "20px" }}>
              <Button onClick={() => onSearch()}>Tìm kiếm</Button>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Table
                rowKey="_id"
                dataSource={message}
                pagination={false}
                onChange={(e) => handleOnChangeTable(e)}
              >
                <Column
                  title="#"
                  render={(val, rec, index) => {
                    return (pageIndex - 1) * pageSize + index + 1;
                  }}
                />
                <Column title="Nội dung" dataIndex="content" key="content" />
                <Column
                  title="Người gửi"
                  dataIndex="from"
                  key="from"
                  render={(_) => _?.username}
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
                  dataIndex={"_id"}
                  render={(val, record) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      <Popconfirm
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        title="Bạn có chắc chắn muốn xóa tin nhắn?"
                        onConfirm={() => confirm(val)}
                        okText="Đồng ý"
                        cancelText="Không"
                      >
                        <DeleteOutlined
                          style={{ color: "red", fontSize: "20px" }}
                        />
                      </Popconfirm>
                    </div>
                  )}
                />
              </Table>
            </Col>
            <Col style={{ marginTop: "1rem" }}>
              <Pagination
                defaultCurrent={1}
                current={pageIndex}
                total={totalPage}
                pageSize={pageSize}
                onChange={(page, pageSize) => {
                  setPageSize(pageSize);
                  setPageIndex(page);
                }}
                showSizeChanger
              />
            </Col>
          </Row>
          <Modal
            open={modalExcel}
            onOk={closeExcelModal}
            onCancel={closeExcelModal}
            footer={
              <>
                <Button onClick={closeExcelModal}>Cancel</Button>
                <Button type="primary" onClick={closeExcelModal}>
                  Hoàn thành
                </Button>
              </>
            }
          ></Modal>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default MessageManager;

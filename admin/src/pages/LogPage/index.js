import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import ValidateIPaddress from "../../common/validIp";

import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import {
  Space,
  Table,
  Select,
  Popconfirm,
  message,
  Pagination,
  Modal,
  Upload,
} from "antd";
import "../../App.css";
import {
  addBlacklist,
  getBlacklist,
  editBlacklist,
  removeBlacklist,
  getLogs,
  getAllUsers,
} from "../../helpers/helper";

import { AiFillFileExcel } from "react-icons/ai";
import { Drawer } from "antd";
// import { Form } from "reactstrap";
import { Form, DatePicker } from "antd";
import { Tooltip } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;
const { Column } = Table;
function LogsManager() {
  const [logs, setLogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [userId, setUserId] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [form] = Form.useForm();
  const [visibleForm, setVisibleForm] = useState(false);
  const [user, setUser] = useState([]);
  const [date, setDate] = useState([]);
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
  const getPagingLogs = () => {
    let dataReq = {
      pageSize: pageSize || 10,
      pageIndex: pageIndex || 1,
      user: userId || "",
      date: date || [],
    };

    getLogs(dataReq).then((res) => {
      setLogs(res.data);
      setTotalPage(res.totalDoc);
    });
  };
  useEffect(() => {
    getPagingLogs(10, 1);
    setPageIndex(1);
    getUsers();
  }, []);
  useEffect(() => {
    getPagingLogs();
  }, [pageSize, pageIndex]);
  const onClose = () => {
    setVisibleForm(false);
  };
  const onFinish = async (data) => {
    if (ValidateIPaddress(data.ip)) {
      const dataReq = {
        ip: data.ip,
        note: data.note,
      };
      if (!data.id) {
        //Save
        const dataRes = await addBlacklist(dataReq);
        dataRes.status === 1
          ? message.success(` ${dataRes.message}`)
          : message.error(`Save Failed! ${dataRes.message}`);
        if (dataRes.status === 1) {
          onClose();
        }
      } else {
        //Update

        const dataRes = await editBlacklist(data.id, dataReq);

        dataRes.status === 1
          ? message.success(`Update Success!`)
          : message.error(`Update Failed!`);
        if (dataRes.status === 1) {
          onClose();
        }
      }
      setSearchText("");
      form.resetFields();
      getPagingLogs();
    } else {
      message.error("Nhập đúng định dạng IP!");
    }
  };
  const handleRefreshCreate = async () => {
    form.resetFields();
  };

  const onSearch = () => {
    getPagingLogs();
  };
  const onFinishFailed = () => {
    // message.error("Save failed!");
  };
  const handleOnChangeTable = ({ current, pageSize, total }) => {
    setPageIndex(current);
    setPageSize(pageSize);
    getPagingLogs();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Logs" pageTitle="Quản lý Logs" />
          <Row className="mb-3">
            <Drawer
              title={drawerTitle}
              placement={"right"}
              width={"30%"}
              onClose={onClose}
              visible={visibleForm}
              bodyStyle={{
                paddingBottom: 80,
              }}
              style={{ marginTop: "70px" }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Row>
                  <Col sm={4} hidden={true}>
                    <Form.Item name="id" label="Id">
                      <Input name="id" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="ip"
                      label="Địa chỉ IP"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập địa chỉ!",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Địa chỉ IP"
                        name="ip"
                        allowClear={true}
                        onChange={(e) =>
                          form.setFieldsValue({
                            ip: e.target.value,
                          })
                        }
                      />
                    </Form.Item>

                    <Form.Item name="note" label="Ghi chú">
                      <Input placeholder="Ghi chú!" name="note" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>

                    <Button
                      type="primary"
                      htmlType="button"
                      onClick={() => handleRefreshCreate()}
                    >
                      Refresh
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Drawer>
            <Col lg="2">
              <Select
                style={{ width: "100%" }}
                options={[{ label: "Tất cả", value: "" }, ...user]}
                defaultValue={""}
                onChange={(value) => setUserId(value)}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              ></Select>
            </Col>
            <Col lg="2">
              <RangePicker onChange={(value) => setDate(value)} />
            </Col>
            <Col lg="12" style={{ marginTop: "20px" }}>
              <Button onClick={() => onSearch()}>Tìm kiếm</Button>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Table
                rowKey="_id"
                dataSource={logs}
                pagination={false}
                onChange={(e) => handleOnChangeTable(e)}
              >
                <Column
                  title="#"
                  render={(val, rec, index) => {
                    return index + 1;
                  }}
                  width={"3%"}
                />
                <Column
                  title="Địa chỉ IP"
                  dataIndex="ip"
                  key="ip"
                  width={"10%"}
                />
                <Column
                  title="Người dùng"
                  dataIndex="user"
                  key="user"
                  render={(_) => _?.username}
                  width={"10%"}
                />
                <Column
                  title="Hành động"
                  dataIndex="actionName"
                  key="actionName"
                  width={"15%"}
                />

                <Column
                  title="Nội dung"
                  dataIndex="requestDetail"
                  key="requestDetail"
                  width={"30%"}
                  ellipsis
                  render={(e) => {
                    return (
                      <Tooltip title={e}>
                        <span>{e}</span>
                      </Tooltip>
                    );
                  }}
                />
                <Column
                  title="Thời gian"
                  dataIndex="createdAt"
                  key="createdAt"
                  render={(_) => moment(_)?.format("HH:mm DD-MM-YYYY")}
                  width={"10%"}
                />
              </Table>
            </Col>
            <Col style={{ marginTop: "1rem" }}>
              <Pagination
                defaultCurrent={1}
                total={totalPage}
                pageSize={pageSize}
                current={pageIndex}
                onChange={(page, pageSize) => {
                  setPageSize(pageSize);
                  setPageIndex(page);
                }}
                showSizeChanger
              />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default LogsManager;

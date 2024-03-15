import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import { Space, Table, Select, Popconfirm, message, Pagination } from "antd";
import "../../App.css";
import {
  insertAutolink,
  getAutolink,
  updateAutolink,
  deleteAutolink,
  getPagingAutolink,
} from "../../helpers/helper";
import { Drawer } from "antd";
// import { Form } from "reactstrap";
import { Form } from "antd";
import { Tooltip } from "antd";
import axios from "axios";
const { Column } = Table;
const { Option } = Select;
function AutoLink() {
  const [autolink, setAutoLink] = useState([]);
  const [id, setId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [form] = Form.useForm();
  const [visibleForm, setVisibleForm] = useState(false);
  const [editType, setEditType] = useState(false);
  const [prevHref, setPrevHref] = useState("");

  const getAutolink = () => {
    let dataReq = {
      pageSize: pageSize,
      pageIndex: pageIndex,
      search: searchText,
    };
    console.log("dataReq: ", dataReq);

    getPagingAutolink(dataReq).then((res) => {
      setAutoLink(res.datas);
      setTotalPage(res.total);
    });
  };
  useEffect(() => {
    getAutolink(10, 1);
    setPageIndex(1);
  }, []);
  useEffect(() => {
    getAutolink();
  }, [pageSize, pageIndex]);
  const onClose = () => {
    setEditType(false);
    setVisibleForm(false);
  };
  const onFinish = async (data) => {
    const dataReq = {
      key: data.key,
      value: data.slug,
      href: data.href,
    };
    console.log(dataReq);
    if (editType === true) {
      await axios
        .post("https://api.gofiber.vn/api/v1/autoLinkUpdateById", {
          slug: dataReq.value,
          newHref: dataReq.href,
          key: dataReq.key,
          prevHref: prevHref,
        })
        .then(() => {
          onClose();
          console.log("okay");
        });
    } else {
      await axios
        .post("https://api.gofiber.vn/api/v1/autoLinkCreateById", {
          slug: dataReq.value,
          href: dataReq.href,
          key: dataReq.key,
        })
        .then(() => {
          onClose();
          console.log("okay");
        });
    }
    setSearchText("");
    form.resetFields();
    getAutolink();
  };
  const handleRefreshCreate = async () => {
    form.resetFields();
  };
  const onEdit = (key) => {
    const dataEdit = autolink.filter((item) => item._id === key);
    setPrevHref(dataEdit[0].href);
    setEditType(true);
    form.setFieldsValue({
      key: dataEdit[0].key,
      slug: dataEdit[0].slug,
      href: dataEdit[0].href,
    });
    showDrawer();
    setDrawerTitle("Chỉnh Sửa Autolink");
  };
  const onDelete = async (key) => {
    const result = await deleteAutolink(key);
    result?.isSuccessed === true
      ? message.success(`${result.message}`)
      : message.error(`${result.message}`);
    getAutolink();
  };
  const showDrawer = () => {
    setVisibleForm(true);
  };
  const onInputChange = (e) => {
    setSearchText(e.target.value);

    console.log("searchText: ", searchText);
    // let dataReq = {
    //   pageSize: pageSize,
    //   pageIndex: pageIndex,
    //   search: e.target.value || "",
    // };
  };
  const onSearch = () => {
    if (!searchText) {
      getAutolink();
    }
    getAutolink();
  };
  const onFinishFailed = () => {
    // message.error("Save failed!");
  };
  const handleOnChangeTable = ({ current, pageSize, total }) => {
    setPageIndex(current);
    setPageSize(pageSize);
    getAutolink();
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Autolink" pageTitle="Quản lí Autolink" />
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
                    <Form.Item name="key" label="Từ khóa">
                      <Input
                        placeholder="Từ khóa"
                        name="key"
                        disabled={editType}
                        allowClear={true}
                        onChange={(e) =>
                          form.setFieldsValue({
                            key: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                    <Form.Item name="slug" label="Đường dẫn tới bài viết">
                      <Input
                        placeholder="Vui lòng nhập Đường dẫn !"
                        name="slug"
                        disabled={editType}
                      />
                    </Form.Item>
                    <Form.Item name="href" label="Đường dẫn">
                      <Input
                        placeholder="Vui lòng nhập Đường dẫn !"
                        name="href"
                      />
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
            <Col lg="5">
              <div>
                <InputGroup style={{ marginBottom: "1rem" }}>
                  <Input
                    value={searchText}
                    onChange={(e) => {
                      onInputChange(e);
                    }}
                    placeholder="Tìm kiếm..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        console.log(e.target.value);
                      }
                    }}
                  />
                  <InputGroupText
                    style={{ cursor: "pointer" }}
                    onClick={onSearch}
                  >
                    <i className="ri-search-line"></i>
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>

            <Col lg="7">
              <div className="text-right">
                <Button
                  onClick={() => {
                    setDrawerTitle("Thêm Autolink Mới000");
                    showDrawer();
                    console.log(visibleForm);
                    form.resetFields();
                  }}
                >
                  Thêm mới
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Table
                rowKey="_id"
                dataSource={autolink}
                pagination={false}
                onChange={(e) => handleOnChangeTable(e)}
              >
                <Column
                  title="#"
                  render={(val, rec, index) => {
                    return pageSize * (pageIndex - 1) + index + 1;
                  }}
                />
                <Column title="Từ khóa" dataIndex="key" key="key" />
                <Column
                  title="Đường đẫn tới bài viết (không lấy đấu /)"
                  dataIndex="slug"
                  key="slug"
                />
                <Column
                  title="Đường đẫn (của thẻ a)"
                  dataIndex="href"
                  key="href"
                />

                <Column
                  title="Hoạt động"
                  key="action"
                  render={(val, record) => (
                    <>
                      <Space size="middle">
                        <Tooltip title="Edit">
                          <i
                            className="ri-pencil-line action-icon"
                            style={{ color: "blue" }}
                            onClick={() => onEdit(val._id)}
                          ></i>
                        </Tooltip>

                        <Popconfirm
                          title="Bạn có chắc muốn xóa autolink này?"
                          onConfirm={() => onDelete(val._id)}
                          okText="Xóa"
                          cancelText="Hủy bỏ"
                        >
                          <i className="ri-delete-bin-line action-icon"></i>
                        </Popconfirm>
                      </Space>
                    </>
                  )}
                />
              </Table>
            </Col>
            <Col style={{ marginTop: "1rem" }}>
              <Pagination
                defaultCurrent={1}
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
        </Container>
      </div>
    </React.Fragment>
  );
}

export default AutoLink;

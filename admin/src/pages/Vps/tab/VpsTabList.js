import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import { Space, Table, Select, Popconfirm, Pagination } from "antd";
import { Drawer } from "antd";
import { message } from "antd";
import { Form } from "antd";
import { Tooltip } from "antd";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  addVpsTab,
  deleteVpsTab,
  getPagingVpsTabs,
  updateVpsTab,
} from "../../../helpers/helper";
import toSlug from "../../../common/function";
const { Column } = Table;
const { Option } = Select;

function VpsTabList() {
  const [taxonomies, setTaxonomies] = useState([]);

  const [drawerTitle, setDrawerTitle] = useState("");
  const [form] = Form.useForm();
  const [visibleForm, setVisibleForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [filter, setFilter] = useState("");
  const [total, setTotal] = useState(1);
  const [status, setStatus] = useState(0);

  const getVpsTabs = () => {
    getPagingVpsTabs(pageSize, pageIndex, filter).then((res) => {
      setTaxonomies(res.data);
      setPageSize(res.pageSize);
      setTotal(res.totalItem);
    });
  };

  useEffect(() => {
    getVpsTabs();
  }, [pageSize, pageIndex]);

  const onClose = () => {
    setVisibleForm(false);
  };
  const onFinish = async (data) => {
    const dataReq = {
      name: data.name,
      slug: data.slug,
      status: status || 0,
    };
    // console.log(dataReq, "dataReq");
    if (!data.id) {
      //Save
      dataReq.id = Math.floor(Math.random() * 10000) + 10000;
      const dataRes = await addVpsTab(dataReq);
      dataRes.success === true
        ? message.success(`Save Success! `)
        : message.error(`Save Failed! ${dataRes.message}`);
      if (dataRes.success === false) {
        onClose();
      }
    } else {
      //Update
      const dataRes = await updateVpsTab(data.id, dataReq);
      dataRes.success === true
        ? message.success(`Update Success!`)
        : message.error(`Update Failed! ${dataRes.message}`);
      if (dataRes.success === true) {
        onClose();
      }
    }

    form.resetFields();
    getVpsTabs(pageSize, pageIndex);
    // setListTag(dataRes);
  };
  const handleRefreshCreate = async () => {
    form.resetFields();
  };
  const onEdit = (key) => {
    const dataEdit = taxonomies.filter((item) => item._id === key);
    form.setFieldsValue({
      name: dataEdit[0].name,
      slug: dataEdit[0].slug,
      id: dataEdit[0]._id,
    });
    showDrawer();
    setDrawerTitle("Chỉnh Sửa Vps Tab");
  };
  const showDrawer = () => {
    setVisibleForm(true);
  };

  const onFinishFailed = () => {
    // message.error("Save failed!");
  };

  const onSearch = () => {
    getPagingVpsTabs();
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Vps Tab" pageTitle="Quản lý Service" />
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
                      name="name"
                      label="Tên vps tab"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên vps tab!",
                        },
                        {
                          type: "tagName",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập tên vps tab"
                        name="tagName"
                        allowClear={true}
                        onChange={(e) =>
                          form.setFieldsValue({
                            slug: toSlug(e.target.value),
                          })
                        }
                        // onChange={(e) => handleChangeTitle(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="slug"
                      label="Slug"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập vps tab slug!",
                        },
                        {
                          type: "slug",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập vps tab slug"
                        name="slug"
                        allowClear={true}
                      />
                    </Form.Item>
                  </Col>
                  <Row>
                    <Col lg={12}>
                      <Form.Item name="status" label="Trạng thái">
                        <Select
                          placeholder="Chọn trạng thái"
                          value={status}
                          defaultValue={status}
                          // key={formAdd.status}
                          style={{ width: "200px" }}
                          onChange={(e) => setStatus(e)}
                        >
                          <Option label="Dừng hoạt động" key={0} value={0}>
                            Dừng hoạt động
                          </Option>
                          <Option label="Đang hoạt động" key={1} value={1}>
                            Đang hoạt động
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
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
                <InputGroup>
                  <Input
                    // value={searchText}
                    onChange={(e) => {
                      setFilter(e.target.value);
                    }}
                    placeholder="Tìm kiếm..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setFilter(e.target.value);
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
                    setDrawerTitle("Thêm Vps Tab Mới");
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
                dataSource={taxonomies}
                pagination={false}
                // onChange={(e) => handleOnChangeTable(e)}
              >
                <Column
                  title="#"
                  render={(val, rec, index) => {
                    return index + 1;
                  }}
                />
                <Column title="Tên" dataIndex="name" key="name" />

                <Column title="Đường dẫn tĩnh" dataIndex="slug" key="slug" />

                <Column
                  title="Trạng thái"
                  dataIndex="status"
                  key="status"
                  render={(item) => {
                    let rs = "";

                    if (item === 1) {
                      rs = "Đang hoạt động";
                    }
                    if (item === 0) {
                      rs = "Dừng hoạt động";
                    }
                    return <>{rs}</>;
                  }}
                />
                <Column
                  title="Hoạt động"
                  key="action"
                  render={(val, record) => (
                    <Space size="middle">
                      <Tooltip title="Edit">
                        <i
                          className="ri-pencil-line action-icon"
                          style={{ color: "blue" }}
                          onClick={() => onEdit(val._id)}
                        ></i>
                      </Tooltip>

                      <Popconfirm
                        title="Are you sure to delete this vps tab?"
                        onConfirm={() => {
                          deleteVpsTab(val._id).then(() => {
                            getVpsTabs(pageSize, pageIndex);
                          });
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <i className="ri-delete-bin-line action-icon"></i>
                      </Popconfirm>
                    </Space>
                  )}
                />
              </Table>
              <Row>
                <Col className="d-flex justify-content-end">
                  <Pagination
                    // showTotal={showTotal}
                    style={{ marginTop: "20px" }}
                    current={pageIndex}
                    defaultCurrent={pageIndex}
                    total={total}
                    pageSize={pageSize}
                    showSizeChanger
                    onChange={(page, pageSize) => {
                      setPageIndex(page);
                      setPageSize(pageSize);
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default VpsTabList;

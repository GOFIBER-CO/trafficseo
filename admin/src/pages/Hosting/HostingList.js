import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import { Space, Table, Select, Popconfirm, Pagination } from "antd";
import { Link } from "react-router-dom";
import { Drawer } from "antd";
import { message } from "antd";
import { Form } from "antd";
import { Tooltip } from "antd";
import {
  addHosting,
  deleteHosting,
  getPagingHosting,
  updateHosting,
} from "../../helpers/helper";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import toSlug from "../../common/function";
import TagComp from "../Posts/tag";
const { Column } = Table;
const { Option } = Select;

function HostingList() {
  const [hosting, setHosting] = useState([]);

  const [drawerTitle, setDrawerTitle] = useState("");
  const [form] = Form.useForm();
  const [visibleForm, setVisibleForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [filter, setFilter] = useState("");
  const [total, setTotal] = useState(1);
  const [status, setStatus] = useState(0);
  const [feature, setFeature] = useState([]);
  const [free, setFree] = useState([]);
  const [security, setSecurity] = useState([]);
  const [isBest, setIsBest] = useState(false);

  const getHosting = () => {
    getPagingHosting(pageSize, pageIndex, filter).then((res) => {
      setHosting(res.data);
      setPageSize(res.pageSize);
      setTotal(res.totalItem);
    });
  };

  useEffect(() => {
    getHosting();
  }, [pageSize, pageIndex]);

  const onClose = () => {
    setVisibleForm(false);
  };

  const handleChangeIsBest = () => {
    setIsBest(!isBest);
  };

  const onFinish = async (data) => {
    const dataReq = {
      name: data.name,
      slug: data.slug,
      status: status || 0,
      extra: data?.extra,
      price: Number(data?.price) || 0,
      feature: feature?.map((item) => item.text) || [],
      free: free?.map((item) => item.text) || [],
      security: security?.map((item) => item.text) || [],
      isBest,
    };

    if (!data.id) {
      //Save
      dataReq.id = Math.floor(Math.random() * 10000) + 10000;
      const dataRes = await addHosting(dataReq);
      dataRes.success === true
        ? message.success(`Save Success! `)
        : message.error(`Save Failed! ${dataRes.message}`);
      if (dataRes.success === false) {
        onClose();
      }
    } else {
      //Update
      const dataRes = await updateHosting(data.id, dataReq);
      dataRes.success === true
        ? message.success(`Update Success!`)
        : message.error(`Update Failed! ${dataRes.message}`);
      if (dataRes.success === true) {
        onClose();
      }
    }

    form.resetFields();
    getHosting(pageSize, pageIndex);
    // setListTag(dataRes);
  };
  const handleRefreshCreate = async () => {
    form.resetFields();
  };
  const onEdit = (key) => {
    const dataEdit = hosting.filter((item) => item._id === key);

    form.setFieldsValue({
      name: dataEdit[0].name,
      slug: dataEdit[0].slug,
      status: dataEdit[0].status,
      extra: dataEdit[0].extra,
      price: dataEdit[0].price,
      id: dataEdit[0]._id,
    });

    setIsBest(dataEdit[0].isBest);
    setFeature(
      (dataEdit[0]?.feature || []).map((item, index) => {
        return {
          id: index,
          text: item,
        };
      })
    );
    setFree(
      (dataEdit[0]?.free || []).map((item, index) => {
        return {
          id: index,
          text: item,
        };
      })
    );

    setSecurity(
      (dataEdit[0]?.security || []).map((item, index) => {
        return {
          id: index,
          text: item,
        };
      })
    );

    showDrawer();
    setDrawerTitle("Chỉnh Sửa Hosting");
  };
  const showDrawer = () => {
    setVisibleForm(true);
  };

  const onFinishFailed = () => {
    // message.error("Save failed!");
  };

  const onSearch = () => {
    getPagingHosting();
  };

  const onPressFeature = (e) => {
    if (e.key === "Enter" && e.target.value) {
      setFeature([
        ...feature,
        { id: new Date().getTime(), text: e.target.value },
      ]);

      e.target.value = "";
    }
  };

  const onRemoveFeature = (id) => {
    const newFeature = feature.filter((item) => item.id !== id);
    setFeature(newFeature);
  };

  const onPressFree = (e) => {
    if (e.key === "Enter" && e.target.value) {
      setFree([...free, { id: new Date().getTime(), text: e.target.value }]);

      e.target.value = "";
    }
  };

  const onRemoveFree = (id) => {
    const newFree = free.filter((item) => item.id !== id);
    setFree(newFree);
  };

  const onPressSecurity = (e) => {
    if (e.key === "Enter" && e.target.value) {
      setSecurity([
        ...security,
        { id: new Date().getTime(), text: e.target.value },
      ]);

      e.target.value = "";
    }
  };

  const onRemoveSecurity = (id) => {
    const newSecurity = security.filter((item) => item.id !== id);
    setSecurity(newSecurity);
  };

  const resetFeature = () => {
    setFeature([]);
    setFree([]);
    setSecurity([]);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Hosting" pageTitle="Quản lý Service" />
          <Row className="mb-3">
            <Drawer
              title={drawerTitle}
              placement={"right"}
              size="large"
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
                onKeyPress={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
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
                      label="Tên hosting"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên hosting!",
                        },
                        {
                          type: "name",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập tên hosting"
                        name="name"
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
                          message: "Vui lòng nhập hosting slug!",
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
                        placeholder="Nhập hosting slug"
                        name="slug"
                        allowClear={true}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item name="extra" label="Extra">
                      <Input
                        placeholder="Nhập extra"
                        name="extra"
                        allowClear={true}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      name="price"
                      label="Giá"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập giá!",
                        },
                        {
                          type: "price",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập giá"
                        name="price"
                        allowClear={true}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} className="mb-2">
                    <Label>Tính năng hàng đầu</Label>
                    <Input
                      id="feature"
                      name="feature"
                      className="mb-1"
                      placeholder="Nhập xong nhấp enter"
                      type="text"
                      onKeyPress={onPressFeature}
                    />
                    {feature.map((item, i) => (
                      <TagComp
                        key={item.id}
                        content={item}
                        onRemove={onRemoveFeature}
                        id={item.id}
                      />
                    ))}
                  </Col>
                  <Col xs={12} className="mb-2">
                    <Label>Bảo mật</Label>
                    <Input
                      id="security"
                      name="security"
                      className="mb-1"
                      placeholder="Nhập xong nhấp enter"
                      type="text"
                      onKeyPress={onPressSecurity}
                    />
                    {security.map((item, i) => (
                      <TagComp
                        key={item.id}
                        content={item}
                        onRemove={onRemoveSecurity}
                        id={item.id}
                      />
                    ))}
                  </Col>
                  <Col xs={12} className="mb-2">
                    <Label>Phần thưởng miễn phí</Label>
                    <Input
                      id="free"
                      name="free"
                      className="mb-1"
                      placeholder="Nhập xong nhấp enter"
                      type="text"
                      onKeyPress={onPressFree}
                    />
                    {free.map((item, i) => (
                      <TagComp
                        key={item.id}
                        content={item}
                        onRemove={onRemoveFree}
                        id={item.id}
                      />
                    ))}
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      name="isBest"
                      label="is Best"
                      rules={[
                        {
                          required: false,
                        },
                        {
                          type: "isBest",
                        },
                      ]}
                      className="item-checkbox mb-0"
                    >
                      <Input
                        type="checkbox"
                        checked={isBest}
                        onChange={handleChangeIsBest}
                        allowClear={true}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={12}>
                    <Form.Item name="status" label="Trạng thái">
                      <Select
                        placeholder="Chọn trạng thái"
                        value={status}
                        defaultValue={status}
                        // key={formAdd.status}
                        style={{ width: "200px" }}
                        onChange={(e) => setStatus(e)}
                      >
                        <Option label="Dừng hoạt động" key={-1} value={-1}>
                          Dừng hoạt động
                        </Option>
                        <Option label="Nháp" key={0} value={0}>
                          Nháp
                        </Option>
                        <Option label="Đang hoạt động" key={1} value={1}>
                          Đang hoạt động
                        </Option>
                      </Select>
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
                    setDrawerTitle("Thêm Hosting mới");
                    showDrawer();
                    resetFeature();
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
                dataSource={hosting}
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
                  title="Giá"
                  dataIndex="price"
                  key="price"
                  render={(item) => (
                    <>{Intl.NumberFormat("en-US").format(item || 0)} vnđ</>
                  )}
                />

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
                        title="Are you sure to delete this hosting?"
                        onConfirm={() => {
                          deleteHosting(val._id).then(() => {
                            getHosting(pageSize, pageIndex);
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

export default HostingList;

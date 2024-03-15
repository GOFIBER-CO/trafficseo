import {
  Drawer,
  Form,
  message,
  notification,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Input, InputGroup, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  addSeo,
  deleteSeo,
  getAllDomains,
  getAllSeo,
  updateSeo,
} from "../../helpers/helper";

const { Option } = Select;

const { Column } = Table;

function SeoList() {
  const [drawerTitle, setDrawerTitle] = useState("");
  const [form] = Form.useForm();
  const [visibleForm, setVisibleForm] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [domains, setDomains] = useState([]);
  const [seo, setSeo] = useState([]);

  const [domainId, setDomainId] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPageSize, setTotalPageSize] = useState(0);
  const [tags, setTags] = useState([
    {
      id: `${Date.now()}`,
      value: "",
    },
  ]);

  const getDomains = async () => {
    try {
      const result = await getAllDomains();
      const { data } = result;
      //   console.log("data", data);
      setDomains(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getSeo = async (pageSize, pageIndex, searchInput, domain) => {
    try {
      setIsLoading(true);
      const result = await getAllSeo(pageSize, pageIndex, searchInput, domain);
      if (result) {
        setSeo(result?.data || []);
        setTotalPageSize(result?.count || 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDomains();
  }, []);

  useEffect(() => {
    getSeo(pageSize, pageIndex, searchInput, domainId);
  }, [pageSize, pageIndex]);

  const confirm = (seo) => {
    deleteSeo(seo._id)
      .then((res) => {
        notification["success"]({
          message: "Notification",
          description: "Delete seo successfully!",
        });
        getSeo(pageSize, pageIndex, searchInput);
      })
      .catch((error) => {
        notification["error"]({
          message: "System error",
          description: error,
        });
      });
  };

  const searchSeo = () => {
    getSeo(pageSize, pageIndex, searchInput, domainId);
  };

  const showDrawer = () => {
    setVisibleForm(true);
  };

  const onClose = () => {
    setVisibleForm(false);
  };

  const handleRefreshCreate = async () => {
    form.resetFields();
  };

  // const onDomainChange = (value) => {
  //   setFormAdd({
  //     ...formAdd,
  //     domain: value,
  //   });
  // };

  const onFinish = async (data) => {
    const dataReq = {
      link: data?.link,
      domain: data?.domain,
      tags: tags.filter((item) => item?.value),
    };

    if (!data.id) {
      //Save
      const dataRes = await addSeo(dataReq);
      console.log("dataRes", dataRes);
      dataRes.status === 1
        ? message.success(`Save Success! `)
        : message.error(`Save Failed! ${dataRes.message}`);
      if (dataRes.success === false) {
        onClose();
      }
    } else {
      //Update
      const dataRes = await updateSeo(data.id, dataReq);
      dataRes.status === 1
        ? message.success(`Update Success!`)
        : message.error(`Update Failed! ${dataRes.message}`);
      if (dataRes.success === true) {
        onClose();
      }
    }

    form.resetFields();
    setTags([
      {
        id: `${Date.now()}`,
        value: "",
      },
    ]);
    getSeo(pageSize, pageIndex);
    // setListTag(dataRes);
  };

  const handleAddTagItem = () => {
    setTags([
      ...tags,
      {
        id: `${Date.now()}`,
        value: "",
      },
    ]);
  };

  const handleDeleteTagsItem = (item) => {
    setTags((prevState) => prevState.filter((e) => e.id !== item.id));
  };

  const handleChangeTag = (value, item) => {
    setTags((prevState) => {
      const newState = prevState.map((e) => {
        if (e.id === item.id) {
          return {
            ...e,
            value: value,
          };
        }

        return e;
      });

      return newState;
    });
  };

  const onEdit = (key) => {
    const dataEdit = seo.find((item) => item._id === key);

    form.setFieldsValue({
      link: dataEdit?.link,
      domain: dataEdit?.domain?._id,
      id: dataEdit?._id,
    });

    setTags(dataEdit?.tags || []);

    showDrawer();
    setDrawerTitle("Chỉnh Sửa Seo");
  };

  return (
    <React.Fragment>
      <Spin spinning={isLoading}>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb title="Seo" pageTitle="Quản lý Seo" />
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
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
                onKeyPress={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
              >
                <Row>
                  <Col sm={4} hidden={true}>
                    <Form.Item name="id" label="Id">
                      <Input name="id" />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      name="domain"
                      label="Domain"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn Domain!",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        style={{ width: "100%" }}
                        placeholder="Chọn domain"
                        // onChange={onDomainChange}
                        value={form.getFieldValue().domain || ""}
                      >
                        {domains &&
                          domains?.map((item) => (
                            <Option key={item._id}>{item?.host} </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="link"
                      label="Link (ex: /gioi-thieu)"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập link!",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập link"
                        name="link"
                        allowClear={true}
                        // onChange={(e) =>
                        //   form.setFieldsValue({
                        //     slug: toSlug(e.target.value),
                        //   })
                        // }
                      />
                    </Form.Item>
                  </Col>
                  <Row className="px-0 mx-0 mb-4">
                    <div className="mx-1" style={{ fontWeight: 600 }}>
                      <span style={{ color: "red" }}>* </span>
                      Thẻ
                    </div>
                    {tags.map((item, index) => (
                      <Col md={12} className="mt-2" key={index}>
                        <div className="d-flex align-items-center justify-content-between">
                          <Input
                            value={item?.value}
                            onChange={(e) =>
                              handleChangeTag(e?.target?.value, item)
                            }
                            style={{ width: "90%" }}
                            placeholder="Nhập value"
                          />
                          {index !== 0 && (
                            <Button
                              onClick={() => handleDeleteTagsItem(item)}
                              type="button"
                              color="danger"
                            >
                              X
                            </Button>
                          )}
                        </div>
                      </Col>
                    ))}
                    <Col md={12} className="mt-4">
                      <Button
                        onClick={handleAddTagItem}
                        type="button"
                        color="info"
                      >
                        Thêm thẻ
                      </Button>
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
            <Row className="mb-3">
              <Col lg="2">
                <div>
                  <InputGroup>
                    <Input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Tìm kiếm..."
                    />
                  </InputGroup>
                </div>
              </Col>
              <Col lg="2">
                <div>
                  <Select
                    allowClear={true}
                    style={{ width: "100%" }}
                    placeholder="Domain"
                    onChange={(e) => setDomainId(e)}
                  >
                    {domains &&
                      domains?.map((item) => (
                        <Option label={item.host} key={item._id}>
                          {item?.host}{" "}
                        </Option>
                      ))}
                  </Select>
                </div>
              </Col>
              <Col lg="6">
                <Row>
                  <Col style={{ width: "130px" }} lg="6">
                    <div>
                      <Button onClick={() => searchSeo()}>Tìm kiếm</Button>
                    </div>
                  </Col>
                  <Col style={{ width: "130px" }} lg="6">
                    <div className="">
                      <Button
                        onClick={() => {
                          setDrawerTitle("Thêm SEO mới");
                          showDrawer();
                          form.resetFields();
                        }}
                      >
                        Thêm mới
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <Table rowKey="_id" dataSource={seo} pagination={false}>
                  <Column
                    title="#"
                    render={(val, rec, index) => {
                      return index + 1;
                    }}
                  />
                  <Column title="Link" dataIndex="link" key="link" />
                  <Column
                    title="Domain"
                    dataIndex="domain"
                    key="domain"
                    render={(item) => {
                      return <>{item?.host}</>;
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
                          title="Are you sure to delete this seo?"
                          onConfirm={() => confirm(val)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <i className="ri-delete-bin-line action-icon"></i>
                        </Popconfirm>
                      </Space>
                    )}
                  />
                </Table>
                <div className="text-right">
                  <Pagination
                    className="mt-4"
                    pageSize={pageSize}
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

export default SeoList;

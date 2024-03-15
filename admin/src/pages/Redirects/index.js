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
import { Space, Table, Select, Popconfirm, notification } from "antd";
import { Link } from "react-router-dom";
import { error, success } from "../../Components/Common/message";
import {
  addTag,
  deleteTag,
  deleteTaxonomy,
  getPagingTags,
  searchtag,
  searchTaxonomy,
  updateTag,
  insertRedirect,
  updateRedirect,
  deleteRedirect,
  getPagingRedirect,
} from "../../helpers/helper";
import "../../App.css";
import { Drawer } from "antd";
// import { Form } from "reactstrap";
import { message } from "antd";
import { Form } from "antd";
import { Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import toSlug from "../../common/function";
const { Column } = Table;
const { Option } = Select;
function RedirectList() {
  const [taxonomies, setTaxonomies] = useState([]);
  const [redirect, setRedirect] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [form] = Form.useForm();
  const [visibleForm, setVisibleForm] = useState(false);

  //   const getTaxonomies = (size, index) => {
  //     getPagingTags(size, index).then((res) => {
  //       console.log(res);
  //       setTaxonomies(res.docs);
  //       setTotalPage(res.totalDocs);
  //     });
  //   };
  const getRedirect = () => {
    let dataReq = {
      pageSize: pageSize,
      pageIndex: pageIndex,
      search: "",
    };
    getPagingRedirect(dataReq).then((res) => {
      setRedirect(res.docs);
      console.log(res);
      setTotalPage(res.totalDocs);
    });
  };
  useEffect(() => {
    getRedirect(10, 1);
    setPageIndex(1);
  }, []);

  const onClose = () => {
    setVisibleForm(false);
  };
  const onFinish = async (data) => {
    const dataReq = {
      source: data.source,
      destination: data.destination,
    };

    if (!data.id) {
      //Save
      const dataRes = await insertRedirect(dataReq);
      dataRes.status === 1
        ? message.success(`Save Success! ${dataRes.message}`)
        : message.error(`Save Failed! ${dataRes.message}`);
      if (dataRes.status === 1) {
        onClose();
      }
    } else {
      //Update
      const dataRes = await updateRedirect(data.id, dataReq);
      dataRes.status === 1
        ? message.success(`Update Success! ${dataRes.message}`)
        : message.error(`Update Failed! ${dataRes.message}`);
      if (dataRes.status === 1) {
        onClose();
      }
    }

    form.resetFields();
    getRedirect();
    // setListTag(dataRes);
  };
  const handleRefreshCreate = async () => {
    form.resetFields();
  };
  const onEdit = (key) => {
    const dataEdit = redirect.filter((item) => item._id === key);
    form.setFieldsValue({
      source: dataEdit[0].source[0],
      destination: dataEdit[0].destination,
      id: dataEdit[0]._id,
    });
    showDrawer();
    setDrawerTitle("Chỉnh Sửa Redirect");
  };
  const showDrawer = () => {
    setVisibleForm(true);
  };
  const onInputChange = (e) => {
    setSearchText(e.target.value);
    let dataReq = {
      pageSize: pageSize,
      pageIndex: pageIndex,
      search: e.target.value || "",
    };
    getPagingRedirect(dataReq)
      .then((res) => {
        setRedirect(res.docs);
        setTotalPage(res.totalDocs);
      })
      .catch((error) => {
        notification["error"]({
          message: "System error",
          description: error,
        });
      });
  };
  const onSearch = () => {
    if (!searchText) {
      getRedirect();
    }
    let dataReq = {
      pageSize: pageSize,
      pageIndex: pageIndex,
      search: searchText || "",
    };
    getPagingRedirect(dataReq)
      .then((res) => {
        setRedirect(res.docs);
        setTotalPage(res.totalDocs);
      })
      .catch((error) => {
        notification["error"]({
          message: "System error",
          description: error,
        });
      });
  };
  const onFinishFailed = () => {
    // message.error("Save failed!");
  };
  const handleOnChangeTable = ({ current, pageSize, total }) => {
    setPageIndex(current);
    setPageSize(pageSize);
    let dataReq = {
      pageSize: pageSize,
      pageIndex: pageIndex,
      search: searchText || "",
    };
    getPagingRedirect(dataReq);
    // setTotalPage(total);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Redirect" pageTitle="Quản lí Redirect" />
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
                      name="source"
                      label="Nguồn"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập source!",
                        },
                        {
                          type: "source",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nguồn"
                        name="source"
                        allowClear={true}
                        onChange={(e) =>
                          form.setFieldsValue({
                            source: e.target.value,
                          })
                        }
                        // onChange={(e) => handleChangeTitle(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="destination"
                      label="Đích đến"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập đích đến !",
                        },
                        {
                          type: "destination",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Vui lòng nhập đích đến !"
                        name="destination"
                        allowClear={true}
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
                <InputGroup>
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
                  <InputGroupText>
                    <i className="ri-search-line" onClick={onSearch}></i>
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>

            <Col lg="7">
              <div className="text-right">
                <Button
                  onClick={() => {
                    setDrawerTitle("Thêm Redirect Mới");
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
                dataSource={redirect}
                pagination={{
                  total: totalPage,
                  pageSize: pageSize,
                  current: pageIndex,
                }}
                onChange={(e) => handleOnChangeTable(e)}
              >
                <Column
                  title="#"
                  render={(val, rec, index) => {
                    return index + 1;
                  }}
                />
                <Column title="Source" dataIndex="source" key="source" />
                {/* <Column
                  title="Mô tả"
                  dataIndex="tax_description"
                  key="tax_description"
                  render={(val) => {
                    return (
                      <div>
                        <span dangerouslySetInnerHTML={{ __html: val }}></span>
                      </div>
                    );
                  }}
                /> */}
                {/* <Column title="Loại" dataIndex="tax_type" key="tax_type" /> */}
                <Column
                  title="Đích đến"
                  dataIndex="destination"
                  key="destination"
                />
                <Column
                  title="Hoạt động"
                  key="action"
                  render={(val, record) => (
                    <Space size="middle">
                      {/* <Link to={{ pathname: "/taxonomy/" + val.tax_slug }}>View</Link> */}
                      {/* <Tooltip title="View">
                        <i
                          className="ri-eye-line action-icon"
                          style={{ color: "blue" }}
                          onClick={() => onEdit(val._id)}
                        ></i>
                      </Tooltip> */}

                      {/* <Link to={{ pathname: "/taxonomy/add/" + val.tax_slug}}>Edit</Link> */}
                      <Tooltip title="Edit">
                        <i
                          className="ri-pencil-line action-icon"
                          style={{ color: "blue" }}
                          onClick={() => onEdit(val._id)}
                        ></i>
                      </Tooltip>
                      {/* <Tooltip title="Edit">
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<EditOutlined />}
                          size="small"
                          onClick={() => onEdit(val._id)}
                        />
                      </Tooltip> */}
                      <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => {
                          deleteRedirect(val._id).then(() => {
                            getRedirect();
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
            </Col>
          </Row>
        </Container>
      </div>

      {/* <Modal
        title="Add Taxonomy"
        okText="Save"
        visible={isModalAddTaxonomyVisible}
        onOk={addNewTaxonomy}
        onCancel={() => setIsModalVisible(false)}
        width="680px"
      >
        <div>
          <Form>
            <Row>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="Taxonomy_type">
                    Taxonomy type
                  </Label>
                  <Input
                    id="Taxonomy_type"
                    name="Taxonomy_type"
                    placeholder="Taxonomy type"
                    type="text"
                    value={formVal.Taxonomy_type}
                    onChange={onInputChange}
                  />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="Taxonomy_script">
                    Taxonomy script
                  </Label>
                  <Input
                    id="Taxonomy_script"
                    name="Taxonomy_script"
                    placeholder="Taxonomy script"
                    type="text"
                    value={formVal.Taxonomy_script}
                    onChange={onInputChange}
                  />
                </FormGroup>
              </Col>
              <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="post_id">
                    Posts
                  </Label>
                  <Select
                    mode="multiple"
                    size="large"
                    name="post_id"
                    id="post_id"
                    value={formVal.post_id}
                    onChange={onPostChange}
                    placeholder="Posts"
                    style={{ width: "100%" }}
                  >
                    {posts.map((post) => {
                      return (
                        <Option key={post._id} value={post._id}>{post.post_title}</Option>
                      );
                    })}
                  </Select>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal> */}
    </React.Fragment>
  );
}

export default RedirectList;

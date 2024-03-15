import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
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
} from "reactstrap";
import {
  Space,
  Table,
  Modal,
  Select,
  Popconfirm,
  Input as InputANTD,
} from "antd";
import { Link } from "react-router-dom";
import {
  addSchema,
  deleteSchema,
  getAllPosts,
  getAllSchemas,
  updateSchema,
  getSchema,
  searchSchema,
  getAllPages,
  getPostOnlyName,
} from "../../helpers/helper";
import { error, success } from "../../Components/Common/message";
import { SchemaPattern } from "../../common/schemas";
const { Column } = Table;
const { Option } = Select;
function SchemaList() {
  const [schemas, setSchemas] = useState([]);
  const [posts, setPosts] = useState([]);
  const [pages, setPages] = useState([]);
  const [isModalAddSchemaVisible, setIsModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState(undefined);
  const [schemaSelected, setSchemaSelected] = useState(null);
  const [formVal, setFormVal] = useState({
    name: "",
    script: SchemaPattern(),
    post: [],
    page: [],
  });

  const getSchemas = () => {
    getAllSchemas().then((res) => {
      setSchemas(res);
    });
  };

  useEffect(() => {
    getSchemas();
    getPostOnlyName().then((res) => {
      console.log(res);
      if (res) {
        setPosts(res);
      }
    });
    getAllPages().then((res) => {
      if (res) {
        setPages(res);
      }
    });
  }, []);
  const addNewSchema = () => {
    setSchemaSelected(null);
    addSchema({ ...formVal })
      .then((res) => {
        success();
        setIsModalVisible(false);
        getSchemas();
        setFormVal({
          name: "",
          script: "",
          post: [],
          page: [],
        });
      })
      .catch((err) => {
        error();
      });
  };

  const openPopupEditSchema = (item) => {
    setSchemaSelected(item);
    setFormVal({
      name: item.name,
      script: item.script,
      post: item.post?.map((i) => i._id),
      page: item.page?._id,
    });
    setIsModalVisible(true);
  };

  const editSchema = () => {
    updateSchema(schemaSelected._id, formVal)
      .then((res) => {
        success();
        setIsModalVisible(false);
        getSchemas();
        setSchemaSelected(null);
        setFormVal({
          ...formVal,
          name: "",
          script: "",
          post: [],
          page: [],
        });
      })
      .catch((err) => {
        error();
      });
  };

  const onInputChange = (e) => {
    setFormVal({
      ...formVal,
      [e.target.name]: e.target.value,
    });
  };

  const onPostChange = (e) => {
    setFormVal({
      ...formVal,
      post: e,
    });
  };
  const onPageChange = (e) => {
    setFormVal({
      ...formVal,
      page: e,
    });
  };

  const onSearchSchema = (e) => {
    setSearchInput(e.target.value);
    searchSchema(e.target.value).then((res) => {
      setSchemas(res);
    });
  };

  const removeSchema = (id) => {
    if (id) {
      deleteSchema(id)
        .then((res) => {
          getSchemas();
          success();
        })
        .catch((er) => {
          error();
        });
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Schemas" pageTitle="Schemas Management" />
          <Row className="mb-3">
            <Col lg="5">
              <div>
                <InputGroup>
                  <Input
                    value={searchInput}
                    onChange={(e) => onSearchSchema(e)}
                    placeholder="Search schema..."
                  />
                  <InputGroupText>
                    <i className="ri-search-line"></i>
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>

            <Col lg="7">
              <div className="text-right">
                <Button onClick={() => setIsModalVisible(true)}>
                  Thêm mới
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Table rowKey="_id" dataSource={schemas}>
                <Column
                  title="#"
                  key="index"
                  render={(val, rec, index) => {
                    return index + 1;
                  }}
                />
                <Column
                  title="Tên"
                  dataIndex="name"
                  key="name"
                  render={(val) => {
                    return val ?? "---";
                  }}
                />
                {/* <Column
                  title="Đoạn mã"
                  dataIndex="script"
                  key="script"
                  render={(val) => {
                    return val ?? "---";
                  }}
                /> */}
                <Column
                  title="Bài viết"
                  dataIndex="post"
                  key="post"
                  render={(val) => {
                    return (
                      <ul>
                        {val?.length ? (
                          <ul>
                            {val.map((item, index) => {
                              if (index < 2) {
                                return <li key={index}>{item.post_title}</li>;
                              }
                            })}
                          </ul>
                        ) : (
                          "---"
                        )}
                      </ul>
                    );
                  }}
                />
                <Column
                  title="Trang"
                  dataIndex="page"
                  key="page"
                  render={(val) => {
                    return val?.page_title ?? "---";
                  }}
                />
                <Column
                  title="Hoạt động"
                  key="action"
                  render={(val, record) => (
                    <Space size="middle">
                      {/* <Link to={{ pathname: "/schemas/" + val._id }}>
                        <i className="ri-eye-line action-icon"></i>
                      </Link> */}
                      <i
                        className="ri-pencil-line action-icon"
                        style={{ color: "blue" }}
                        onClick={() => openPopupEditSchema(val)}
                      ></i>
                      <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => removeSchema(val._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <i
                          className="ri-delete-bin-line action-icon"
                          style={{ color: "red" }}
                        ></i>
                      </Popconfirm>
                    </Space>
                  )}
                />
              </Table>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal
        title={schemaSelected ? "Sửa" : "Thêm mới"}
        okText="Save"
        visible={isModalAddSchemaVisible}
        onOk={schemaSelected ? editSchema : addNewSchema}
        onCancel={() => setIsModalVisible(false)}
        width="680px"
      >
        <div>
          <Form>
            <Row>
              <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="name">
                    Tên
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Schema name"
                    type="text"
                    value={formVal.name}
                    onChange={onInputChange}
                  />
                </FormGroup>
              </Col>

              <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="script">
                    Đoạn mã
                  </Label>
                  <InputANTD.TextArea
                    style={{ minHeight: "200px" }}
                    id="script"
                    name="script"
                    placeholder="Schema script"
                    type="text"
                    value={formVal.script}
                    onChange={onInputChange}
                  />
                </FormGroup>
              </Col>
              {/* <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="script">
                    Trang
                  </Label>
                  <Select
                    size="large"
                    name="page"
                    id="page"
                    value={formVal.page}
                    onChange={onPageChange}
                    placeholder="Pages"
                    style={{ width: "100%" }}
                  >
                    {pages &&
                      pages.map((page) => {
                        return (
                          <Option key={page._id} value={page._id}>
                            {page.page_title}
                          </Option>
                        );
                      })}
                  </Select>
                </FormGroup>
              </Col> */}
              <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="post">
                    Bài viết
                  </Label>
                  <Select
                    mode="multiple"
                    size="large"
                    name="post"
                    id="post"
                    value={formVal.post}
                    onChange={onPostChange}
                    placeholder="Posts"
                    style={{ width: "100%" }}
                  >
                    {posts &&
                      posts.map((post) => {
                        return (
                          <Option key={post._id} value={post._id}>
                            {post.title}
                          </Option>
                        );
                      })}
                  </Select>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </React.Fragment>
  );
}

export default SchemaList;

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
import {
  Space,
  Table,
  Select,
  Popconfirm,
  notification,
  Input as InputANTD,
} from "antd";
import {
  addCategory,
  addTag,
  deleteCategory,
  deleteTag,
  deleteTaxonomy,
  getAllCategory,
  getAllCateParent,
  getAllTags,
  getpagingDomains,
  searchCategory,
  searchtag,
  searchTaxonomy,
  updateCategory,
  updateTag,
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
function CategoriesList() {
  const [taxonomies, setTaxonomies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [cateParent, setCateParent] = useState([]);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [form] = Form.useForm();
  const [visibleForm, setVisibleForm] = useState(false);
  const [isShow, setIsShow] = useState(true);
  const [isNoIndex, setIsNoIndex] = useState(false);
  const [isNoFlow, setIsNoFlow] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [domainList, setDomainList] = useState([]);
  const [editDomains, setEditDomains] = useState([]);

  const getTaxonomies = (size, index) => {
    getAllCategory(size, index).then((res) => {
      setTaxonomies(res.categories);
      setTotalPage(res.totalPages);
    });
  };

  const getDomains = async () => {
    let domains = await getpagingDomains(99999, 1, "");
    setDomainList(domains.data);
  };

  useEffect(() => {
    getTaxonomies();
    setPageIndex(1);
    getAllCateParent().then((data) => {
      setCateParent(data?.categories || []);
    });
    getDomains();
  }, []);

  const onClose = () => {
    setVisibleForm(false);
    setEditingId("");
  };
  const handleChangeTitle = (value) => {
    form.setFieldsValue({
      categorySlug: toSlug(value),
    });
  };
  const handleChange = () => {
    setIsShow(!isShow);
  };
  const handleChangeNoIndex = () => {
    setIsNoIndex(!isNoIndex);
  };
  const handleChangeNoFlow = () => {
    setIsNoFlow(!isNoFlow);
  };
  const onFinish = async (data) => {
    const dataReq = {
      name: data.categoryName,
      slug: data.categorySlug,
      isShow: isShow,
      parent: data.parent,
      description: data.description,
      cateOrder: data.categoryOrder,
      isNoFlow: isNoFlow,
      isNoIndex: isNoIndex,
      domains: data.domains,
    };

    if (!editingId) {
      //Save
      dataReq.id = Math.floor(Math.random() * 10000) + 10000;
      const dataRes = await addCategory(dataReq);
      dataRes.status === 1
        ? message.success(`Save Success! ${dataRes.message || ""}`)
        : message.error(`Save Failed! ${dataRes.message || ""}`);
      if (dataRes.status === 1) {
        onClose();
      }
    } else {
      //Update
      const dataRes = await updateCategory(data.id, dataReq);
      dataRes.status === 1
        ? message.success(`Update Success! ${dataRes.message}`)
        : message.error(`Update Failed! ${dataRes.message}`);
      if (dataRes.status === 1) {
        onClose();
      }
    }

    form.resetFields();
    getTaxonomies(pageSize, pageIndex);
    // setListTag(dataRes);
  };
  const handleRefreshCreate = async () => {
    form.resetFields();
  };
  const onEdit = (key) => {
    const dataEdit = taxonomies.filter((item) => item._id === key);

    setEditingId(dataEdit[0]?._id);

    form.setFieldsValue({
      categoryName: dataEdit[0].name,
      categorySlug: dataEdit[0].slug,
      id: dataEdit[0]._id,
      description: dataEdit[0].description,
      categoryOrder: dataEdit[0].cateOrder,
      parent: dataEdit[0]?.parent,
      domains: dataEdit[0]?.domains,
    });
    setIsShow(dataEdit[0].isShow);
    setIsNoFlow(dataEdit[0].isNoFlow);
    setIsNoIndex(dataEdit[0].isNoIndex);
    setEditDomains(dataEdit[0].domains);
    showDrawer();
    setDrawerTitle("Chỉnh sửa danh mục");
    console.log(dataEdit, "dataEdit");
  };
  const showDrawer = () => {
    setVisibleForm(true);
  };
  const onInputChange = (e) => {
    setSearchText(e.target.value);
    searchCategory(e.target.value)
      .then((res) => {
        setTaxonomies(res.categories);
        setTotalPage(res.totalDocs);
      })
      .catch((error) => {
        notification["error"]({
          message: "System error",
          description: error,
        });
      });
  };
  const onSearch = (e) => {
    if (!searchText) {
      getTaxonomies(pageSize, pageIndex);
    }
    searchCategory(e.target.value)
      .then((res) => {
        setTaxonomies(res.docs);
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
    getTaxonomies(pageSize, current);
    // setTotalPage(total);
  };

  const genAllParentCategories = () => {
    return cateParent.filter(
      (item) => item?._id !== editingId && item?.parent !== editingId
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Danh mục" pageTitle="Chuyên mục" />
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
                  <Col hidden={true}>
                    <Form.Item name="id" label="Id">
                      <Input name="id" />
                    </Form.Item>
                  </Col>
                  <Form.Item
                    name="categoryName"
                    label="Tên danh mục"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên danh mục!",
                      },
                      {
                        type: "categoryName",
                      },
                      {
                        type: "string",
                        min: 1,
                      },
                    ]}
                  >
                    <Input
                      placeholder="Vui lòng nhập tên"
                      name="categoryName"
                      allowClear={true}
                      onChange={(e) => handleChangeTitle(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="categorySlug"
                    label="Đường dẫn danh mục"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên danh mục!",
                      },
                      {
                        type: "categorySlug",
                      },
                      {
                        type: "string",
                        min: 1,
                      },
                    ]}
                  >
                    <Input
                      placeholder="Vui lòng nhập tên danh mục!"
                      name="categorySlug"
                      allowClear={true}
                    />
                  </Form.Item>
                  {/* <Form.Item
                    name="categoryOrder"
                    label="Số thứ tự hiện trên menu"
                    rules={[
                      {
                        required: false,
                        message: "Vui lòng nhập số thứ tự!",
                      },
                      {
                        type: "categoryOrder",
                      },
                      {
                        type: "string",
                        min: 1,
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Vui lòng nhập số thứ tự!"
                      name="categoryOrder"
                      allowClear={true}
                    />
                  </Form.Item> */}
                  <Form.Item name="parent" label="Danh mục cha">
                    <Select
                      placeholder="Chọn danh mục cha!"
                      allowClear
                      showSearch
                      name="menus"
                    >
                      {genAllParentCategories() &&
                        genAllParentCategories().map((item) => {
                          return (
                            <Option key={item._id} value={item._id}>
                              {item.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mô tả!",
                      },
                      {
                        type: "description",
                      },
                      {
                        type: "string",
                        min: 1,
                      },
                    ]}
                  >
                    <InputANTD.TextArea
                      placeholder="Vui lòng nhập mô tả!"
                      name="description"
                      allowClear={true}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Domains"
                    name="domains"
                    rules={[
                      { required: true, message: "Vui lòng chọn Domains" },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      size="large"
                      name="domains"
                      id="domains"
                      placeholder="Domains"
                      value={editDomains}
                      // onChange={onRoleChange}
                    >
                      {domainList &&
                        domainList?.map((item, index) => {
                          return (
                            <Option value={item._id} key={item._id}>
                              {item.host}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                  <Row>
                    <Form.Item
                      name="isShow"
                      label="Hiển thị Footer"
                      rules={[
                        {
                          required: false,
                          // message: "Please menu is Show!",
                        },
                        {
                          type: "isShow",
                        },
                      ]}
                      className="item-checkbox"
                    >
                      <Input
                        type="checkbox"
                        checked={isShow}
                        onChange={handleChange}
                        allowClear={true}
                      />
                    </Form.Item>
                    {/* <Form.Item
                      name="nameSchemas"
                      label="Name Schemas"
                      rules={[
                        {
                          required: true,
                          message: "Please enter name schemas!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter name of schemas"
                        name="nameSchemas"
                        allowClear={true}
                      />
                    </Form.Item>
                    <Form.Item name="script" label="Script Schemas">
                      <Input.TextArea
                        placeholder="Enter script of schemas"
                        name="script"
                        allowClear={true}
                        style={{ height: "200px" }}
                      />
                    </Form.Item>
                    <Col hidden={true}>
                      <Form.Item name="idschema" label="Id">
                        <Input name="idschema" />
                      </Form.Item>
                    </Col> */}
                  </Row>

                  <Row>
                    <Form.Item
                      name="isNoIndex"
                      label="is No Index"
                      rules={[
                        {
                          required: false,
                          // message: "Please menu is Show!",
                        },
                        {
                          type: "isNoIndex",
                        },
                      ]}
                      className="item-checkbox"
                    >
                      <Input
                        type="checkbox"
                        checked={isNoIndex}
                        onChange={handleChangeNoIndex}
                        allowClear={true}
                      />
                    </Form.Item>
                  </Row>
                  <Row>
                    <Form.Item
                      name="isNoFlow"
                      label="is No Flow"
                      rules={[
                        {
                          required: false,
                          // message: "Please menu is Show!",
                        },
                        {
                          type: "isNoFlow",
                        },
                      ]}
                      className="item-checkbox"
                    >
                      <Input
                        type="checkbox"
                        checked={isNoFlow}
                        onChange={handleChangeNoFlow}
                        allowClear={true}
                      />
                    </Form.Item>
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
                    setDrawerTitle("Thêm danh mục mới");
                    showDrawer();
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
                <Column title="Tên" dataIndex="name" key="name" />
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
                <Column title="Đường dẫn tĩnh" dataIndex="slug" key="slug" />
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
                          deleteCategory(val._id).then(() => {
                            getTaxonomies(pageSize, pageIndex);
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

export default CategoriesList;

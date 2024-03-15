import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Input,
  InputGroup,
  Form,
  FormGroup,
  Label,
  Button,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Space,
  Modal,
  Table,
  message,
  Popconfirm,
  notification,
  Select,
  Pagination,
  Spin,
} from "antd";
import { AudioOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  getAllBanner,
  getById,
  getByPosition,
  createBanner,
  updateBanner,
  removeBanner,
  getAllPages,
  getByPage,
} from "../../helpers/helper";
import { success, error } from "../../Components/Common/message";
import {
  uploadFileToBunny,
  getListImageBunny,
  deleteImageBunny,
} from "../../helpers/api_bunny";
import { URL_IMAGE_BUNNY } from "../../helpers/url_helper";
import { toast } from "react-toastify";

const { Column } = Table;
const { Option } = Select;

const BannersList = () => {
  document.title = "Banners Management";
  const authUser = sessionStorage.getItem("authUser")
    ? JSON.parse(sessionStorage.getItem("authUser"))
    : null;
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isAddBannerModalVisible, setAddBannerModalVisible] = useState(false);
  const [bannerList, setBannerList] = useState([]);
  const [bannerSelected, setBannerSelected] = useState(null);
  const [pageList, setPageList] = useState([]);
  const [current, setCurrent] = useState(0);
  const [res, setRes] = useState({});
  const [pageSize, setPageSize] = React.useState(10);
  const [searchValue, setSearchValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formVal, setFormVal] = useState({
    name: "",
    link: "",
    position: "",
    image: "",
    pageId: "",
    userId: authUser.id,
  });

  //const faqList = useSelector((state) => state.Faqs.faqList);
  useEffect(() => {
    getListBanner();
    getListPage();
  }, []);
  const getListBanner = (limit, skip, slug) => {
    setIsLoading(true);
    if (typeof limit !== "undefined" && typeof skip !== "undefined") {
      slug = slug ? slug : null;
      getAllBanner(limit, skip, slug)
        .then((res) => {
          //console.log(res);
          if (res.datas) {
            const formatRes = res.datas.map((item) => ({
              ...item,
              key: item._id,
            }));
            setBannerList(formatRes);
            setRes(res);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          // notification["error"]({
          //   message: "System error",
          //   description: error,
          // });
          toast.error("Lỗi hệ thống!");
          setIsLoading(false);
        });
    } else {
      slug = slug ? slug : null;
      getAllBanner(pageSize, current, slug)
        .then((res) => {
          //console.log(res);
          if (res.datas && res.datas.length > 0) {
            const formatRes = res.datas.map((item) => ({
              ...item,
              key: item._id,
            }));
            setBannerList(formatRes);
            setRes(res);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          // notification["error"]({
          //   message: "System error",
          //   description: error,
          // });
          toast.error("Lỗi hệ thống!");
          setIsLoading(false);
        });
    }
  };
  const getListPage = () => {
    getAllPages().then((res) => {
      if (res) {
        const formatRes = res.map((item) => ({
          ...item,
          key: item._id,
        }));
        setPageList(formatRes);
      }
    });
  };

  const onDelete = (record) => {
    if (record._id) {
      removeBanner(record._id)
        .then((res) => {
          notification["success"]({
            message: "Notification",
            description: "Delete link sucessfully!",
          });
          getListBanner();
        })
        .catch((error) => {
          notification["error"]({
            message: "System error",
            description: error,
          });
        });
    }
  };

  const uploadImage = (e) => {
    let file = e.target.files ? e.target.files[0] : null;
    if (file) {
      uploadFileToBunny(file).then((res) => {
        getListBanner();
      });
    }
  };
  const onInputChange = (e) => {
    setFormVal({
      ...formVal,
      [e.target.name]: e.target.value,
    });
    let file = e.target.files ? e.target.files[0] : null;

    if (file) {
      uploadFileToBunny(file);
      setFormVal({
        ...formVal,
        [e.target.name]: "https://agency88.b-cdn.net/" + file.name,
      });
    }
  };
  const editBanner = () => {
    updateBanner(bannerSelected._id, formVal)
      .then((res) => {
        setAddBannerModalVisible(false);
        setBannerSelected(null);
        getListBanner();
        message.success("Thành công");
        setFormVal({
          ...formVal,
          name: "",
          link: "",
          position: "",
          image: "",
          pageId: "",
        });
      })
      .catch((err) => {
        message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
      });
  };
  const addNewBanner = () => {
    setBannerSelected(null);
    createBanner(formVal)
      .then((res) => {
        if (res.error) {
          notification["error"]({
            message: "Notification",
            description: res.error,
          });
        } else {
          notification["success"]({
            message: "Notification",
            description: "Create banner successfully!",
          });
        }
        setFormVal({
          ...formVal,
          name: "",
          link: "",
          position: "",
          image: "",
          pageId: "",
        });
        setAddBannerModalVisible(false);
        getListBanner();
      })
      .catch((err) => {
        message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
      });
  };
  const openPopupEditBanner = (item) => {
    setBannerSelected(item);
    setFormVal({
      name: item.name,
      link: item.link,
      position: item.position,
      image: item.image,
      pageId: item.pageId && item.pageId.map((i) => i._id),
    });
    setAddBannerModalVisible(true);
  };
  const convertPosition = (item) => {
    var data = "";
    if (item) {
      switch (item) {
        case "TopLeft":
          data = "Phía trên bên trái";
          break;
        case "Middle":
          data = "Ở giữa";
          break;
        case "BottomLeft":
          data = "Ở dưới bên trái";
          break;
        case "BottomRight":
          data = "Ở dưới bên phải";
          break;
        default:
          break;
      }
      return data;
    }
  };
  const onPageChange = (e) => {
    setFormVal({
      ...formVal,
      pageId: e,
    });
  };
  const onChangePosition = (e) => {
    setFormVal({
      ...formVal,
      position: e,
    });
  };
  const changeByPage = (value) => {
    setSearchValue(value);
    if (value) {
      getListBanner(pageSize, current, value);
      // getByPage(value).then((res) => {
      //   if(res){
      //     setBannerList(res);
      //   }
      // })
      //console.log('value', value);
    } else {
      //let limit = 10;
      //let skip = 0;
      //setCurrent(0);
      //setPageSize(10)
      getListBanner();
    }
  };
  return (
    <React.Fragment>
      <Spin spinning={isLoading}>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb title="Banners" pageTitle="Banners" />
            <Row className="mb-3">
              <Col lg="5">
                <div>
                  <Select
                    allowClear={true}
                    style={{ width: "100%" }}
                    placeholder="Tìm kiếm"
                    onChange={changeByPage}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                    // value={selectCategory}
                  >
                    {pageList &&
                      pageList?.map((item) => (
                        <Option
                          label={item.page_title}
                          key={item.page_category_slug}
                        >
                          {item?.page_title}
                        </Option>
                      ))}
                  </Select>
                </div>
              </Col>

              <Col lg="7">
                <div className="text-right">
                  <Button onClick={() => setAddBannerModalVisible(true)}>
                    Thêm mới
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                {/* <div className="text-right" style={{ width: "40%" }}>
                <Search
                  placeholder="input search text"
                  allowClear
                  size="large"
                  onSearch={onSearch}
                />
              </div> */}
                <div className="table-responsive mt-4 mt-xl-0">
                  <Table
                    rowKey="_id"
                    dataSource={bannerList}
                    pagination={false}
                  >
                    <Column
                      width="3%"
                      title="#"
                      render={(val, rec, index) => {
                        return index + 1;
                      }}
                    />
                    <Column
                      width="5%"
                      title="Tên"
                      dataIndex="name"
                      key="name"
                    />
                    <Column
                      width="10%"
                      title="Hình ảnh"
                      dataIndex="image"
                      key="image"
                      render={(image) => (
                        <img
                          src={image}
                          alt="pro_image"
                          style={{ width: "85%" }}
                        />
                      )}
                    />
                    <Column
                      width="3%"
                      title="Link"
                      dataIndex="link"
                      key="link"
                    />
                    <Column
                      width="5%"
                      title="Vị trí"
                      dataIndex="position"
                      key="position"
                      render={(position) => convertPosition(position)}
                    />
                    <Column
                      width="10%"
                      title="Trang"
                      dataIndex="pageId"
                      key="pageId"
                      render={(val) => {
                        return (
                          <div>
                            {val && val?.length ? (
                              <ul>
                                {val.map((item, index) => {
                                  return <li key={index}>{item.page_title}</li>;
                                })}
                              </ul>
                            ) : (
                              "---"
                            )}
                          </div>
                        );
                      }}
                    />
                    <Column
                      width="5%"
                      title="Hoạt động"
                      key="action"
                      render={(val, record) => (
                        <Space size="middle">
                          <i
                            className="ri-pencil-line action-icon"
                            onClick={() => openPopupEditBanner(val)}
                          ></i>
                          <Popconfirm
                            title="Are you sure to delete this file?"
                            onConfirm={() => onDelete(record)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <i className="ri-delete-bin-line action-icon"></i>
                          </Popconfirm>
                        </Space>
                      )}
                    />
                  </Table>
                </div>
                <div className="text-right">
                  <Pagination
                    onChange={(page, newPageSize) => {
                      let pageTmp = page - 1;
                      setPageSize(newPageSize);
                      setCurrent(pageSize !== newPageSize ? 0 : pageTmp);
                      console.log(pageTmp, newPageSize);
                      if (searchValue && searchValue.length > 0) {
                        changeByPage(newPageSize, pageTmp, searchValue);
                      } else {
                        getListBanner(newPageSize, pageTmp);
                      }
                    }}
                    showSizeChanger={true}
                    total={res.total}
                    current={current + 1}
                    pageSize={pageSize}
                    showTotal={(total) => `Tổng ${total} bài viết`}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Spin>

      <Modal
        title={bannerSelected ? "Sửa" : "Thêm mới"}
        okText="Lưu"
        visible={isAddBannerModalVisible}
        onOk={bannerSelected ? editBanner : addNewBanner}
        onCancel={() => setAddBannerModalVisible(false)}
        width="680px"
      >
        <div>
          <Form>
            <Row>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="name">
                    Tên
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Name"
                    type="text"
                    value={formVal.name}
                    onChange={onInputChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="link">
                    Link
                  </Label>
                  <Input
                    id="link"
                    name="link"
                    placeholder="Link"
                    type="text"
                    value={formVal.link}
                    onChange={onInputChange}
                  />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="position">
                    Vị trí
                  </Label>
                  <Select
                    value={formVal.position}
                    style={{ width: "100%" }}
                    onChange={onChangePosition}
                  >
                    <Option value="TopLeft">Phía trên bên trái</Option>
                    <Option value="Middle">Giữa</Option>
                    <Option value="BottomLeft">Dưới bên trái</Option>
                    <Option value="BottomRight">Dưới bên phải</Option>
                  </Select>
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="image">
                    Hình ảnh
                  </Label>
                  <div>
                    <label className="custom-file-upload">
                      <Input
                        id="add_image"
                        name="image"
                        type="file"
                        onChange={onInputChange}
                      />
                      Upload Image
                    </label>
                  </div>
                </FormGroup>
              </Col>
              <Col lg={12}>
                <FormGroup>
                  <Label htmlFor="pageId" className="mb-1" for="link">
                    Hiển thị trên trang :
                  </Label>
                  <Select
                    mode="multiple"
                    size="large"
                    name="pageId"
                    id="pageId"
                    value={formVal.pageId || []}
                    onChange={onPageChange}
                    placeholder="Please Select Page"
                    style={{ width: "100%" }}
                  >
                    {pageList &&
                      pageList.map((page) => {
                        return (
                          <Option key={page._id} value={page._id}>
                            {page.page_title}
                          </Option>
                        );
                      })}
                  </Select>
                </FormGroup>
              </Col>
              {formVal.image && formVal.image !== "" && (
                <Col lg={6}>
                  <img
                    src={formVal.image}
                    alt="pro_image"
                    style={{ width: "100%" }}
                  />
                </Col>
              )}
            </Row>
          </Form>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default BannersList;

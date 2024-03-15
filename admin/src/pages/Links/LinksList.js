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
import { Space, Modal, Table, message, Popconfirm, notification } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllLinks,
  getLinkById,
  getLinkSearch,
  createLink,
  updateLink,
  removeLink,
} from "../../helpers/helper";
import { success, error } from "../../Components/Common/message";
import { toast } from "react-toastify";

const { Column } = Table;
const confirmDeleteText = "Are you sure to delete this Link";
const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1890ff",
    }}
  />
);

const LinksList = () => {
  document.title = "Links";
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isAddLinkModalVisible, setAddLinkModalVisible] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [linkList, setLinkList] = useState([]);
  const [linkSelected, setLinkSelected] = useState(null);
  const [formVal, setFormVal] = useState({
    name: "",
    link: "",
    status: true,
  });

  useEffect(() => {
    getListLink();
  }, []);

  const getListLink = () => {
    getAllLinks()
      .then((res) => {
        const formatRes = res.map((link) => ({
          ...link,
          key: link._id,
        }));
        setLinkList(formatRes);
      })
      .catch((error) => {
        return toast.error("Lỗi hệ thống!");
      });
  };

  const onDelete = (record) => {
    if (record._id) {
      removeLink(record._id)
        .then((res) => {
          notification["success"]({
            message: "Notification",
            description: "Delete link sucessfully!",
          });
          getListLink();
        })
        .catch((error) => {
          notification["error"]({
            message: "System error",
            description: error,
          });
        });
    }
  };

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
    getLinkSearch(e.target.value)
      .then((res) => {
        const formatRes = res.map((link) => ({
          ...link,
          key: link._id,
        }));
        setLinkList(formatRes);
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
      getListLink();
    } else {
      getLinkSearch(searchText)
        .then((res) => {
          const formatRes = res.map((link) => ({
            ...link,
            key: link._id,
          }));
          setLinkList(formatRes);
        })
        .catch((error) => {
          notification["error"]({
            message: "System error",
            description: error,
          });
        });
    }
  };

  const onInputChange = (e) => {
    setFormVal({
      ...formVal,
      [e.target.name]: e.target.value,
    });
  };

  const addNewLink = () => {
    setLinkSelected(null);
    createLink(formVal)
      .then((res) => {
        message.success("Thành công");
        setFormVal({
          ...formVal,
          name: "",
          link: "",
          status: true,
        });
        setAddLinkModalVisible(false);
        getListLink();
      })
      .catch((err) => {
        message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
      });
  };

  const openPopupEditLink = (item) => {
    setLinkSelected(item);
    setFormVal({
      name: item.name,
      link: item.link,
      status: item.status,
    });
    setAddLinkModalVisible(true);
  };

  const editLink = () => {
    updateLink(linkSelected._id, formVal)
      .then((res) => {
        setAddLinkModalVisible(false);
        setLinkSelected(null);
        getListLink();
        message.success("Thành công");
        setFormVal({
          ...formVal,
          name: "",
          link: "",
          status: true,
        });
      })
      .catch((err) => {
        message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
      });
  };

  const convertHtmlText = (htmlText) => {
    if (htmlText && htmlText.length > 0) {
      let strText =
        new DOMParser().parseFromString(htmlText, "text/html").documentElement
          .textContent || "";
      if (strText && strText.length > 20) {
        strText = strText.slice(0, 20) + "...";
      }
      return strText;
    }
    return "";
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Links" pageTitle="Links" />
          <Row className="mb-3">
            <Col lg="5">
              <div>
                <InputGroup>
                  <Input
                    placeholder="Tìm kiếm..."
                    value={searchText}
                    onChange={(e) => {
                      onSearchChange(e);
                    }}
                  />

                  <Button color="primary" onClick={onSearch}>
                    <i className="ri-search-line"></i>
                  </Button>
                  {/* <InputGroupText onClick={onSearch}>
                      <i className="ri-search-line"></i>
                  </InputGroupText> */}
                </InputGroup>
              </div>
            </Col>

            <Col lg="7">
              <div className="text-right">
                <Button onClick={() => setAddLinkModalVisible(true)}>
                  Thêm mới
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <div className="text-right" style={{ width: "40%" }}>
                {/* <Search
                  placeholder="input search text"
                  allowClear
                  size="large"
                  onSearch={onSearch}
                /> */}
              </div>
              <div className="table-responsive mt-4 mt-xl-0">
                <Table rowKey="_id" dataSource={linkList}>
                  <Column
                    title="#"
                    render={(val, rec, index) => {
                      return index + 1;
                    }}
                  />
                  <Column title="Tên" dataIndex="name" key="name" />
                  <Column
                    title="Link"
                    dataIndex="link"
                    key="link"
                    render={(item) => <>{convertHtmlText(item)}</>}
                  />
                  <Column
                    title="Hoạt động"
                    key="action"
                    render={(val, record) => (
                      <Space size="middle">
                        <Link to={`/links/${record._id}`}>
                          <i className="ri-eye-line action-icon"></i>
                        </Link>
                        <i
                          className="ri-pencil-line action-icon"
                          onClick={() => openPopupEditLink(val)}
                        ></i>
                        <Popconfirm
                          placement="topLeft"
                          title={confirmDeleteText}
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
              {/* <div className="text-center mt-4">
                <Pagination defaultCurrent={1} total={50} />
              </div> */}
            </Col>
          </Row>
        </Container>
      </div>

      <Modal
        title={linkSelected ? "Sửa" : "Thêm mới"}
        okText="Save"
        visible={isAddLinkModalVisible}
        onOk={linkSelected ? editLink : addNewLink}
        onCancel={() => setAddLinkModalVisible(false)}
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
                    placeholder="Link Name"
                    type="text"
                    value={formVal.name}
                    onChange={onInputChange}
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
            </Row>
          </Form>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default LinksList;

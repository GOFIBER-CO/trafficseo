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
import { Space, Modal, Table, message, Popconfirm } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { faqGetAll, deleteFaq, searchFaq } from "../../store/faqs/actions";
import { addFaq, updateFaq, searchFAQ, getAllFaqs } from "../../helpers/helper";
import { success, error } from "../../Components/Common/message";
import { toast } from "react-toastify";

const { Column } = Table;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1890ff",
    }}
  />
);

const FaqsList = () => {
  document.title = "Footer";
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isAddFaqModalVisible, setAddFaqModalVisible] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [faqList, setFaqList] = useState([]);
  const [faqSelected, setFaqSelected] = useState(null);
  const [formVal, setFormVal] = useState({
    faq_name: "",
    faq_question: "",
    faq_answer: "",
  });
  const dispatch = useDispatch();

  //const faqList = useSelector((state) => state.Faqs.faqList);
  useEffect(() => {
    getListFaqs();
  }, []);
  const getListFaqs = () => {
    getAllFaqs()
      .then((res) => {
        const formatRes = res.map((faq) => ({
          ...faq,
          key: faq._id,
        }));
        setFaqList(formatRes);
      })
      .catch((error) => {
        toast.error("Lỗi hệ thống!");
      });
  };

  const handleOk = () => {
    setConfirmModalVisible(false);
    dispatch(deleteFaq(deleteModalData._id));
    getListFaqs();
    // dispatch(faqGetAll());
  };

  const removeFaq = (id) => {
    if (id) {
      dispatch(deleteFaq(id));
      getListFaqs();
    }
  };

  const handleCancel = () => {
    setConfirmModalVisible(false);
  };

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
    searchFAQ(e.target.value)
      .then((res) => {
        const formatRes = res.map((faq) => ({
          ...faq,
          key: faq._id,
        }));
        setFaqList(formatRes);
      })
      .catch((error) => {
        return toast.error("Lỗi hệ thống!");
      });
  };

  const onSearch = () => {
    if (!searchText) {
      dispatch(faqGetAll());
    } else {
      searchFAQ(searchText)
        .then((res) => {
          const formatRes = res.map((faq) => ({
            ...faq,
            key: faq._id,
          }));
          setFaqList(formatRes);
        })
        .catch((error) => {
          return toast.error("Lỗi hệ thống!");
        });
    }
  };

  const onInputChange = (e) => {
    setFormVal({
      ...formVal,
      [e.target.name]: e.target.value,
    });
  };

  const addNewFaq = () => {
    setFaqSelected(null);
    addFaq(formVal)
      .then((res) => {
        message.success("Thành công");
        setFormVal({
          ...formVal,
          faq_name: "",
          faq_question: "",
          faq_answer: "",
        });
        setAddFaqModalVisible(false);
        getListFaqs();
        //dispatch(faqGetAll());
      })
      .catch((err) => {
        message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
      });
  };

  const openPopupEditFaq = (item) => {
    setFaqSelected(item);
    setFormVal({
      faq_name: item.faq_name,
      faq_question: item.faq_question,
      faq_answer: item.faq_answer,
    });
    setAddFaqModalVisible(true);
  };

  const editFaq = () => {
    updateFaq(faqSelected._id, formVal)
      .then((res) => {
        setAddFaqModalVisible(false);
        setFaqSelected(null);
        getListFaqs();
        message.success("Thành công");
        setFormVal({
          ...formVal,
          faq_name: "",
          faq_question: "",
          faq_answer: "",
        });
      })
      .catch((err) => {
        message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
      });
  };

  const cancelAddFaq = () => {
    setAddFaqModalVisible(false);
    setTimeout(() => {
      setFormVal({
        ...formVal,
        faq_name: "",
        faq_question: "",
        faq_answer: "",
      });
    }, 1000);
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
          <BreadCrumb title="Câu hỏi" pageTitle="FAQs" />
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
                <Button onClick={() => setAddFaqModalVisible(true)}>
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
                <Table rowKey="_id" dataSource={faqList}>
                  <Column
                    title="#"
                    render={(val, rec, index) => {
                      return index + 1;
                    }}
                  />
                  <Column title="Tên" dataIndex="faq_name" key="faq_name" />
                  <Column
                    title="Câu hỏi"
                    dataIndex="faq_question"
                    key="faq_question"
                  />
                  <Column
                    title="Câu trả lời"
                    dataIndex="faq_answer"
                    key="faq_answer"
                    render={(item) => <>{convertHtmlText(item)}</>}
                  />
                  <Column
                    title="Hoạt động"
                    key="action"
                    render={(val, record) => (
                      <Space size="middle">
                        {/* <Link to={`/faqs/${record._id}`}>View</Link> */}
                        <Link to={`/faqs/${record._id}`}>
                          <i className="ri-eye-line action-icon"></i>
                        </Link>

                        {/* <a>Add</a>
                      <a>Edit</a> */}
                        <i
                          className="ri-pencil-line action-icon"
                          onClick={() => openPopupEditFaq(val)}
                        ></i>
                        {/* <a onClick={() => openPopupEditFaq(val)}>Edit</a> */}
                        {/* <a onClick={() => showModal(record)}>Delete</a> */}
                        <Popconfirm
                          title="Are you sure to delete this user?"
                          onConfirm={() => removeFaq(record._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <i className="ri-delete-bin-line action-icon"></i>
                        </Popconfirm>
                        {/* <i className="ri-delete-bin-line action-icon" onClick={() => showModal(record)}></i> */}
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
        title={faqSelected ? "Sửa" : "Thêm mới"}
        visible={isAddFaqModalVisible}
        onOk={faqSelected ? editFaq : addNewFaq}
        onCancel={() => cancelAddFaq()}
        okText="Save"
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
                    name="faq_name"
                    placeholder="Name"
                    type="text"
                    value={formVal.faq_name}
                    onChange={onInputChange}
                  />
                </FormGroup>
              </Col>

              <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="question">
                    Câu hỏi
                  </Label>
                  <Input
                    id="question"
                    name="faq_question"
                    placeholder="Question"
                    type="textarea"
                    value={formVal.faq_question}
                    onChange={onInputChange}
                  />
                </FormGroup>
              </Col>

              <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="answer">
                    Câu trả lời
                  </Label>
                  <Input
                    id="answer"
                    name="faq_answer"
                    placeholder="Answer"
                    type="textarea"
                    value={formVal.faq_answer}
                    onChange={onInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>

      <Modal
        title="Confirm to delete"
        visible={isConfirmModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure to delete this record?</p>
      </Modal>
    </React.Fragment>
  );
};

export default FaqsList;

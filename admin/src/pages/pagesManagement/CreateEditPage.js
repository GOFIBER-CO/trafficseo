import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  InputGroup,
  Row,
  Col,
  Input,
  InputGroupText,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useHistory, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import {
  Select,
  notification,
  Input as InputAntd,
  Button,
  Modal,
  Spin,
} from "antd";
import {
  getAllFaqs,
  createPage,
  getPageById,
  updatePage,
  addFaq,
  deleteFaqs,
  getAllSchemas,
} from "../../helpers/helper";
import { error, success } from "../../Components/Common/message";

const { Option } = Select;

const mockPage = {
  id: "",
  page_title: "",
  page_category_slug: "",
  page_description: "",
  page_category_name: "",
  page_content: "",
  faq_id: [],
};
const CreateEditPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [faqList, setFaqList] = useState([]);
  const [formAdd, setAddForm] = useState(mockPage);
  const [isAddFaqModalVisible, setAddFaqModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [formFaq, setFormFaq] = useState({
    faq_name: "",
    faq_question: "",
    faq_answer: "",
  });

  const { id } = useParams();
  const history = useHistory();
  const editorContentRef = useRef(null);
  const editorDescriptionRef = useRef(null);

  const getFaqs = () => {
    getAllFaqs()
      .then((res) => {
        const formatRes = res.map((item) => ({
          ...item,
          key: item._id,
        }));
        setFaqList(formatRes);
        setIsLoading(false);
      })
      .catch((error) => {
        notification["error"]({
          message: "System error",
          description: error,
        });
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (id) {
      getPageById(id)
        .then((res) => {
          // console.log('res: ', res);
          setAddForm({
            ...res,
            faq_id: res.faq_id?.map(i => i._id),
          });
        })
        .catch((error) => {
          notification["error"]({
            message: "System error",
            description: error,
          });
        });
    }
    setIsLoading(true);
    getFaqs();
  }, []);
  const onBack = () => {
    history.goBack();
  }
  const onSave = () => {
    let content = "";
    let des = "";
    if (editorContentRef.current) {
      content = editorContentRef.current.getContent() || "";
    }
    if (editorDescriptionRef.current) {
      des = editorDescriptionRef.current.getContent() || "";
    }
    const payload = new FormData();
    payload.append("page_title", formAdd.page_title);
    payload.append("id", formAdd._id || formAdd.id);
    payload.append("page_category_slug", formAdd.page_category_slug);
    payload.append("page_description", des);
    payload.append("page_category_name", formAdd.page_category_name);
    payload.append("page_content", content);
    payload.append("faq_id", formAdd.faq_id);
    if (id) {
      setIsLoading(true);
      updatePage(payload)
        .then((res) => {
          notification["success"]({
            message: "Notification",
            description: "Edit Page successfully!",
          });
          setIsLoading(false);
          history.push("/pages-management");
        })
        .catch((error) => {
          setIsLoading(false);
          notification["error"]({
            message: "System error",
            description: error,
          });
        });
    } else {
      setIsLoading(true);
      createPage(payload)
        .then((res) => {
          setIsLoading(false);
          notification["success"]({
            message: "Notification",
            description: "Create Page successfully!",
          });
          history.push("/pages-management");
        })
        .catch((error) => {
          setIsLoading(false);
          notification["error"]({
            message: "System error",
            description: error,
          });
        });
    }
  };
  const onFaqChange = (value) => {
    setAddForm({
      ...formAdd,
      faq_id: value,
    });
  };
  const onInputChange = (e) => {
    setAddForm({
      ...formAdd,
      [e.target.name]: e.target.value,
    });
  };

  const onFaqInputChange = (e) => {
    setFormFaq({
      ...formFaq,
      [e.target.name]: e.target.value,
    });
  };

  const addNewFaq = () => {
    // console.log("formFaq: ", formFaq);
    addFaq(formFaq)
      .then((res) => {
        success("Thành công");
        setFormFaq({
          faq_name: "",
          faq_question: "",
          faq_answer: "",
        });
        setAddFaqModalVisible(false);
        getFaqs();
      })
      .catch((err) => {
        error();
      });
  };

  const deleteFAQ = () => {
    if (formAdd.faq_id) {
      deleteFaqs(formAdd.faq_id)
        .then((res) => {
          getFaqs();
          success();
          setAddForm({
            ...formAdd,
            faq_id: "",
          });
          setConfirmModalVisible(false);
        })
        .catch((err) => {
          error();
        });
    }
  };


  const breadCrumbTitle = id ? "Edit Page" : "Create Page";
  return (
    <>
      <Spin spinning={isLoading}>
        <div className="page-content">
          <BreadCrumb
            title={breadCrumbTitle}
            pageTitle="Pages"
            slug="pages-management"
          />
          <div style={{ marginLeft: "10px" }}>
            <Form onSubmit={onSave}>
              <Row>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="page_title">
                      Title
                    </Label>
                    <Input
                      id="page_title"
                      name="page_title"
                      placeholder="Title"
                      type="page_title"
                      defaultValue={formAdd.page_title}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>

                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1">FAQs:</Label>
                    <div className="row">
                      <div className="col-9">
                        <Select
                          mode="multiple"
                          size="large"
                          style={{ width: "100%" }}
                          placeholder="Please select"
                          onChange={onFaqChange}
                          value={formAdd.faq_id || []}
                        >
                          {faqList?.map((item, index) => (
                            <Option key={item._id}>{item?.faq_name}</Option>
                          ))}
                        </Select>
                      </div>

                      <div className="col-3">
                        <Button
                          size="large"
                          type="primary"
                          onClick={() => setAddFaqModalVisible(true)}
                        >
                          Add FAQ
                        </Button>
                        <Button
                          size="large"
                          danger
                          className="ml-4"
                          onClick={() => setConfirmModalVisible(true)}
                        >
                          Delete FAQ
                        </Button>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="page_category_slug">
                      Slug
                    </Label>
                    <Input
                      id="page_category_slug"
                      name="page_category_slug"
                      placeholder="Slug"
                      type="page_title"
                      defaultValue={formAdd.page_category_slug}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="page_category_name">
                      Category Name:
                    </Label>
                    <Input
                      id="page_category_name"
                      name="page_category_name"
                      placeholder="Category"
                      type="page_title"
                      defaultValue={formAdd.page_category_name}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="page_category_name">
                      Content:
                    </Label>
                    <Editor
                      apiKey={"w17lpon88s3owkb87t8wnmyrb7dnvziqf3mrghzfk7ft8cpl"}
                      onInit={(evt, editor) =>
                        (editorContentRef.current = editor)
                      }
                      initialValue={formAdd?.page_content}
                      // value={formAdd?.page_content}
                      init={{
                        height: 200,
                        menubar: false,
                        file_picker_callback: function (cb, value, meta) {
                          var input = document.createElement("input");
                          input.setAttribute("type", "file");
                          input.setAttribute("accept", "image/*");
                          input.onchange = function () {
                            var file = this.files[0];
            
                            var reader = new FileReader();
                            reader.onload = function () {
                              var id = "blobid" + new Date().getTime();
                              var blobCache = editorContentRef.current.editorUpload.blobCache;
                              var base64 = reader.result.split(",")[1];
                              var blobInfo = blobCache.create(id, file, base64);
                              blobCache.add(blobInfo);
            
                              /* call the callback and populate the Title field with the file name */
                              cb(blobInfo.blobUri(), { title: file.name });
                            };
                            reader.readAsDataURL(file);
                          };
                          input.click();
                        },
                        paste_data_images: true,
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "code",
                          "help",
                          "wordcount",
                          "image"
                        ],
                        toolbar:
                          "undo redo | blocks | " +
                          "bold italic forecolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | link image | code",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="page_category_name">
                      Description:
                    </Label>
                    <Editor
                      apiKey={"w17lpon88s3owkb87t8wnmyrb7dnvziqf3mrghzfk7ft8cpl"}
                      onInit={(evt, editor) => editorDescriptionRef.current = editor}
                      initialValue={formAdd?.page_description}
                      // value={formAdd?.page_description}
                      init={{
                        height: 200,
                        menubar: false,
                        file_picker_callback: function (cb, value, meta) {
                          var input = document.createElement("input");
                          input.setAttribute("type", "file");
                          input.setAttribute("accept", "image/*");
                          input.onchange = function () {
                            var file = this.files[0];
            
                            var reader = new FileReader();
                            reader.onload = function () {
                              var id = "blobid1" + new Date().getTime();
                              var blobCache = editorDescriptionRef.current.editorUpload.blobCache;
                              var base64 = reader.result.split(",")[1];
                              var blobInfo = blobCache.create(id, file, base64);
                              blobCache.add(blobInfo);
            
                              /* call the callback and populate the Title field with the file name */
                              cb(blobInfo.blobUri(), { title: file.name });
                            };
                            reader.readAsDataURL(file);
                          };
                          input.click();
                        },
                        paste_data_images: true,
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "code",
                          "help",
                          "wordcount",
                          "image"
                        ],
                        toolbar:
                          "undo redo | blocks | " +
                          "bold italic forecolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | link image | code",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                    />

                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </div>
          <Row>
            <Col style={{ marginLeft: "10px", marginTop: "10px" }}>
              <Button style={{ marginRight: "10px" }} onClick={onBack}>Back</Button>
              <Button type="primary" onClick={onSave}>
                Save
              </Button>
            </Col>
          </Row>
        </div>
      </Spin>

      <Modal
        title="Add FAQ"
        visible={isAddFaqModalVisible}
        onOk={addNewFaq}
        onCancel={() => setAddFaqModalVisible(false)}
        okText="Save"
      >
        <div>
          <Form>
            <Row>
              <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="name">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="faq_name"
                    placeholder="Name"
                    type="text"
                    value={formFaq.faq_name}
                    onChange={onFaqInputChange}
                  />
                </FormGroup>
              </Col>

              <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="question">
                    Question
                  </Label>
                  <Input
                    id="question"
                    name="faq_question"
                    placeholder="Question"
                    type="text"
                    value={formFaq.faq_question}
                    onChange={onFaqInputChange}
                  />
                </FormGroup>
              </Col>

              <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="answer">
                    Answer
                  </Label>
                  <Input
                    id="answer"
                    name="faq_answer"
                    placeholder="Answer"
                    type="text"
                    value={formFaq.faq_answer}
                    onChange={onFaqInputChange}
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
        onOk={deleteFAQ}
        onCancel={() => setConfirmModalVisible(false)}
      >
        <p>Are you sure to delete this faq?</p>
      </Modal>
    </>
  );
};
export default CreateEditPage;

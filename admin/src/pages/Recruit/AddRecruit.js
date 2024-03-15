import {
  Select,
  Spin,
  DatePicker,
  Button,
  Input as InputAntd,
  notification,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  addRecruit,
  getpagingDomains as getAllDomains,
  getRecruitById,
  updateRecruit,
} from "../../helpers/helper";
import locale from "antd/lib/date-picker/locale/vi_VN";
import moment from "moment";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { uploadFileToBunny } from "../../helpers/api_bunny";
import ReactQuill from "react-quill";
import toSlug from "../../common/function";

const { Option } = Select;
const { TextArea } = InputAntd;
const initialData = {
  _id: "",
  title: "",
  slug: "",
  fromSalary: "",
  toSalary: "",
  numberMember: "",
  domain: "",
  location: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  description: "",
  status: 0,
  thumb: "",
  content: "",
};

function AddRecruit() {
  const [isLoading, setIsLoading] = useState(false);
  const [domains, setDomains] = useState([]);
  const [formAdd, setFormAdd] = useState(initialData);
  const history = useHistory();
  const editorContentRef = useRef(null);
  const { slug } = useParams();
  const location = useLocation();
  const id = location?.state?.id || "";
  const [description, setDescription] = useState("");

  const [expireDate, setExpireDate] = useState(
    moment().clone().add(1, "month")
  );

  const getDomains = async () => {
    const result = await getAllDomains(10000, 1, "");
    if (result) {
      setDomains(result?.data || []);
    }
  };

  const getRecruit = async (id) => {
    try {
      const result = await getRecruitById(id);

      const { data } = result;

      setFormAdd({
        id: data?.id,
        title: data?.title,
        slug: data?.slug || "",
        fromSalary: data?.fromSalary,
        toSalary: data?.toSalary,
        numberMember: data?.numberMember,
        domain: data?.domain,
        location: data?.location,
        contactName: data?.contact?.name,
        contactPhone: data?.contact?.phoneNumber,
        contactEmail: data?.contact?.email,
        status: data?.status,
        thumb: data?.thumb,
        content: data?.content,
      });

      setDescription(data?.description);
      setExpireDate(moment(data?.expireDate));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getRecruit(id);
    }
    getDomains();
  }, [id]);

  const onDomainChange = (value) => {
    setFormAdd({
      ...formAdd,
      domain: value,
    });
  };

  const onInputChange = async (e) => {
    formAdd[e.target.name] = e.target.value;
    setFormAdd(formAdd);

    if (e.target.name === "title") {
      setFormAdd({
        ...formAdd,
        slug: toSlug(e.target.value),
      });

      console.log(toSlug(e.target.value));
    }

    let file = e.target.files ? e.target.files[0] : null;

    if (file) {
      uploadFileToBunny(file).then((res) => {
        if (res.HttpCode === 201) {
          setFormAdd({
            ...formAdd,
            [e.target.name]: "https://cdn.baovietnam.com/" + file.name,
          });
        }
      });
    }
  };

  const onBack = () => {
    history.goBack();
  };

  const onSave = async () => {
    setIsLoading(true);
    const data = {
      title: formAdd.title || "",
      slug: formAdd.slug || "",
      fromSalary: formAdd.fromSalary || 0,
      toSalary: formAdd.toSalary || 0,
      numberMember: formAdd.numberMember || 0,
      domain: formAdd.domain || "",
      location: formAdd.location || "",
      contact: {
        name: formAdd.contactName || "",
        phoneNumber: formAdd.contactPhone || "",
        email: formAdd.contactEmail || "",
      },
      description: description || "",
      content: formAdd.content || "",
      status: formAdd.status || -1,
      thumb: formAdd.thumb || "",
      expireDate: expireDate.toDate(),
    };

    if (id) {
      // update

      updateRecruit(id, data)
        .then((res) => {
          if (res.success === true) {
            notification["success"]({
              message: "Notification",
              description: "Edit recruit successfully!",
            });
          }

          history.push("/recruits");
        })
        .catch((error) => {
          notification["error"]({
            message: "System error",
            description: error,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      //Lưu
      addRecruit(data)
        .then((res) => {
          if (res.status === -2) {
            throw new Error(res.error);
          }
          notification["success"]({
            message: "Notification",
            description: "Create Recruit successfully!",
          });
          history.push("/recruits");
        })
        .catch((error) => {
          notification["error"]({
            message: "System error",
            description: error,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleChangeEditorContent = async (value, editor) => {
    formAdd.content = value;
  };

  return (
    <React.Fragment>
      <Spin spinning={isLoading}>
        <div className="page-content">
          <BreadCrumb title="Thêm mới" pageTitle="Tuyển dụng" slug="recruits" />
          <div>
            <Form onSubmit={onSave}>
              <Row>
                <Col lg={12}>
                  <Label className="mb-1">Domain</Label>
                  <FormGroup>
                    <Select
                      allowClear
                      style={{ width: "100%" }}
                      placeholder="Chọn domain"
                      onChange={onDomainChange}
                      value={formAdd.domain || ""}
                    >
                      {domains &&
                        domains?.map((item) => (
                          <Option key={item._id}>{item?.host} </Option>
                        ))}
                    </Select>
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup rules={[{ required: true }]}>
                    <Label className="mb-1" for="title">
                      Tiêu đề
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Tiêu đề"
                      type="title"
                      defaultValue={formAdd.title || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="slug">
                      Đường dẫn tĩnh
                    </Label>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="Slug"
                      type="slug"
                      defaultValue={formAdd.slug || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup rules={[{ required: true }]}>
                    <Label className="mb-1" for="fromSalary">
                      Lương tối thiểu
                    </Label>
                    <Input
                      id="fromSalary"
                      name="fromSalary"
                      placeholder="Lương tối thiểu"
                      type="fromSalary"
                      defaultValue={formAdd.fromSalary || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup rules={[{ required: true }]}>
                    <Label className="mb-1" for="toSalary">
                      Lương tối đa
                    </Label>
                    <Input
                      id="toSalary"
                      name="toSalary"
                      placeholder="Lương tối đa"
                      type="toSalary"
                      defaultValue={formAdd.toSalary || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup rules={[{ required: true }]}>
                    <Label className="mb-1" for="numberMember">
                      Số lượng cần tuyển
                    </Label>
                    <Input
                      id="numberMember"
                      name="numberMember"
                      placeholder="Số lượng cần tuyển"
                      type="numberMember"
                      defaultValue={formAdd.numberMember || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup rules={[{ required: true }]}>
                    <Label className="mb-1" for="expireDate">
                      Hạn ứng tuyển
                    </Label>
                    <div>
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder="Chọn hạn ứng tuyển"
                        locale={locale}
                        format="DD/MM/YYYY"
                        id="expireDate"
                        value={expireDate}
                        showNow={false}
                        onChange={(e) => setExpireDate(e)}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup rules={[{ required: true }]}>
                    <Label className="mb-1" for="location">
                      Địa chỉ
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Địa chỉ"
                      type="location"
                      defaultValue={formAdd.location || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={4}>
                  <FormGroup rules={[{ required: true }]}>
                    <Label className="mb-1" for="contactName">
                      Người liên hệ
                    </Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      placeholder="Người liên hệ"
                      type="contactName"
                      defaultValue={formAdd.contactName || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={4}>
                  <FormGroup rules={[{ required: true }]}>
                    <Label className="mb-1" for="contactPhone">
                      Số điện thoại
                    </Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      placeholder="Số điện thoại"
                      type="contactPhone"
                      defaultValue={formAdd.contactPhone || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={4}>
                  <FormGroup rules={[{ required: true }]}>
                    <Label className="mb-1" for="contactEmail">
                      Email
                    </Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      placeholder="Email"
                      type="contactEmail"
                      defaultValue={formAdd.contactEmail || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup rules={[{ required: true }]}>
                    <Label className="mb-1" for="description">
                      Mô tả
                    </Label>
                    <TextArea
                      id="description"
                      name="description"
                      placeholder="Mô tả"
                      type="description"
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      value={description || ""}
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="content">
                      Nội dung
                    </Label>
                    <Editor
                      apiKey={
                        "w17lpon88s3owkb87t8wnmyrb7dnvziqf3mrghzfk7ft8cpl"
                      }
                      onInit={(evt, editor) =>
                        (editorContentRef.current = editor)
                      }
                      onEditorChange={handleChangeEditorContent}
                      initialValue={formAdd?.content || ""}
                      // value={formVal?.description}
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
                              var blobCache =
                                editorContentRef.current.editorUpload.blobCache;
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
                        file_picker_types: "image",
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
                          "image",
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
                    <Label className="mb-1" for="status">
                      Trạng thái
                    </Label>
                    <Select
                      value={formAdd.status}
                      // key={formAdd.status}
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        setFormAdd({
                          ...formAdd,
                          status: e,
                        })
                      }
                    >
                      <Option label="Đăng ngay" key={1} value={1}>
                        Đăng ngay
                      </Option>
                      <Option label="Nháp" key={-1} value={-1}>
                        Nháp
                      </Option>
                      <Option label="Chờ xét duyệt" key={0} value={0}>
                        Chờ xét duyệt
                      </Option>
                    </Select>
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="thumb">
                      Hình ảnh
                    </Label>
                    <div>
                      <label className="custom-file-upload">
                        <Input
                          id="thumb"
                          name="thumb"
                          placeholder="Image"
                          accept="image/*"
                          type="file"
                          defaultValue={formAdd.thumb || ""}
                          onChange={onInputChange}
                        />
                        Thêm hình ảnh
                      </label>
                    </div>
                    {formAdd.thumb && formAdd.thumb !== "" && (
                      <Col lg={2}>
                        <img
                          src={formAdd.thumb}
                          alt={formAdd.thumb}
                          style={{ width: "100%" }}
                        />
                      </Col>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col style={{ marginLeft: "10px", marginTop: "10px" }}>
                  <Button style={{ marginRight: "10px" }} onClick={onBack}>
                    Quay lại
                  </Button>
                  <Button type="primary" onClick={onSave}>
                    Lưu
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Spin>
    </React.Fragment>
  );
}

export default AddRecruit;

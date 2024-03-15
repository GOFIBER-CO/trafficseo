import React, { useEffect, useRef, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";

import { message } from "antd";
import { Button, Col, Container, Input, Row } from "reactstrap";
import "../../App.css";
import { getDieuKhoan, updateDieuKhoan } from "../../helpers/helper";

// import { Form } from "reactstrap";
import { Form } from "antd";
import { Editor } from "@tinymce/tinymce-react";

function DieuKhoanPage() {
  const [form] = Form.useForm();
  const editorDescriptionRef = useRef(null);
  const contentRef = useRef(null);
  // const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const getPagingLogs = () => {
    getDieuKhoan().then((res) => {
      form.setFieldValue("title", res?.data?.title);
      form.setFieldValue("content", res?.data?.content || "");
      // form.setFieldValue("description", res?.data?.description || "");
      setContent(res?.data?.content);
      // setDescription(res?.data?.description);
    });
  };
  useEffect(() => {
    getPagingLogs();
  }, []);

  const handlePostHome = async (values) => {
    if (contentRef.current) {
      values.content = contentRef?.current?.getContent() || "";
    }
    if (editorDescriptionRef?.current) {
      values.description = editorDescriptionRef?.current?.getContent() || "";
    }
    const rs = await updateDieuKhoan(values);
    if (rs?.status === 1) {
      return message.success("Lưu thành công");
    } else {
      return message.success("Lưu thành công");
    }
  };

  //
  // const handleChangeEditorDescription = async (value, editor) => {
  //   form.setFieldValue("description", value);
  // };
  // //
  const handleChangeEditorContent = async (value, editor) => {
    form.setFieldValue("content", value);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Điều Khoản Rút Tiền"
            pageTitle="Quản lý Điều Khoản Rút Tiền"
          />
          <Row className="mb-3">
            <Form layout="vertical" onFinish={handlePostHome} form={form}>
              <Form.Item
                label="Title"
                name={"title"}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <p style={{ fontWeight: "bold" }}>Content</p>
              <Editor
                apiKey={"inq28en58nysf40wc60roky9ar3xuxdpthtlfhjq20fccana"}
                onInit={(evt, editor) => {
                  contentRef.current = editor;
                }}
                initialValue={content}
                onEditorChange={handleChangeEditorContent}
                // value={formVal?.post_description}
                init={{
                  height: 300,
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
                        var blobCache =
                          editorDescriptionRef.current.editorUpload.blobCache;
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
                    "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link image | code",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />

              <Form.Item className="py-2">
                <Button type="submit">Lưu</Button>
              </Form.Item>
            </Form>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default DieuKhoanPage;

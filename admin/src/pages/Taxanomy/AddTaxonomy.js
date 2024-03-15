import React, { useEffect, useState, useRef } from "react";
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
import { Editor } from '@tinymce/tinymce-react';
import { message, Badge, Space, Table, Modal, Select } from "antd";
import { Link, useParams, useHistory, useLocation } from "react-router-dom";

import {
  addTaxonomy,
  addUser,
  getAllTaxonomies,
  getTaxonomy,
  getUser,
  updateTaxonomy,
  updateUser,
} from "../../helpers/helper";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const { Option } = Select;
const { Column } = Table;

const success = () => {
  message.success("Thành công");
};

const error = () => {
  message.error("Có lỗi xảy ra. Vui lòng thử lại!");
};

function AddTaxonomy() {
  const { id } = useParams();
  const [taxonomy, setTaxonomy] = useState(null);
  const [taxonomies, setTaxonomies] = useState([]);
  const editorContentRef = useRef(null);
  const editorDescriptionRef = useRef(null);
  const [formVal, setFormVal] = useState({
    tax_name: "",
    tax_slug: "",
    tax_parent: "",
    tax_type: "",
    tax_description: "",
  });
  const history = useHistory();
  useEffect(() => {
    if (id && id !== "new") {
      getTaxonomy(id).then((res) => {
        const { tax_name, tax_slug, tax_parent, tax_type, tax_description } =
          res;
        setTaxonomy(res)
        setFormVal({
          tax_name,
          tax_slug,
          tax_parent,
          tax_type,
          tax_description
        });
      });
    }

    getAllTaxonomies().then((res) => {
      setTaxonomies(res);
    });
  }, [id]);

  const reset = () => {
    setTimeout(() => {
      setFormVal({
        tax_name: "",
        tax_slug: "",
        tax_parent: "",
        tax_type: "",
        tax_description: "",
      });
    }, 200);
  };

  const onInputChange = (e) => {
    setFormVal({
      ...formVal,
      [e.target.name]: e.target.value,
    });
  };

  const addNewTaxonomy = () => {
    let desc = '';
    if (editorDescriptionRef.current) {
      desc = editorDescriptionRef.current.getContent() || '';
    }
    var data = {
      tax_name : formVal.tax_name,
      tax_description : desc,
      tax_parent : formVal.tax_parent || '',
      tax_slug : formVal.slug ? formVal.tax_slug : "",
      tax_type : formVal.tax_type,
      tax_ancestors : formVal.tax_ancestors || '',
    }
    if (taxonomy) {
      updateTaxonomy(taxonomy._id, data)
        .then((res) => {
          // reset();
          success();
          history.push('/taxonomy');
        })
        .catch((err) => {
          error();
        });
    } else {
      // const payload = new FormData();
      // payload.append('tax_name', formVal.tax_name);
      // payload.append('tax_description', desc);
      // payload.append('tax_type', formVal.tax_type);
      // payload.append('tax_slug', formVal.tax_slug ? formVal.tax_slug : "");
      // payload.append('tax_parent', formVal.tax_parent);
      // payload.append('tax_ancestors', formVal.tax_ancestors || '');
      addTaxonomy(data).then((res) => {
          // reset();
          success();
          history.push('/taxonomy');
        })
        .catch((err) => {
          error();
        });
    }
  };

  const onChangeTaxParent = (e) => {
    setFormVal({
      ...formVal,
      tax_parent: e,
    });
  };
  const onChangeTaxType = (e) => {
    setFormVal({
      ...formVal,
      tax_type: e,
    });
  };
  const onChangeTaxDescription = (e) => {
    setFormVal({
      ...formVal,
      tax_description: e,
    });
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title={taxonomy ? "Sửa" : "Thêm mới"}
            pageTitle="Chuyên mục"  slug='taxonomy'
          />
          <Row className="mb-3">
            <div className="mb-3">
              <Link to="/taxonomy">
                <div className="d-flex align-items-center">
                  <i className="ri-arrow-left-line"></i>
                  <div style={{ marginLeft: "6px" }}>Quay lại</div>
                </div>
              </Link>
            </div>
            <div>
              <div>
                <Form>
                  <Row>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="tax_name">
                          Tên danh mục
                        </Label>
                        <Input
                          id="tax_name"
                          name="tax_name"
                          placeholder="Name"
                          type="text"
                          defaultValue={formVal.tax_name}
                          onChange={onInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="tax_slug">
                          Đường dẫn tĩnh
                        </Label>
                        <Input
                          id="tax_slug"
                          name="tax_slug"
                          placeholder="Taxonomy slug"
                          defaultValue={formVal.tax_slug}
                          onChange={onInputChange}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="tax_parent">
                          Chuyên mục cha
                        </Label>
                        <Select
                          value={formVal.tax_parent}
                          style={{ width: "100%" }}
                          onChange={onChangeTaxParent}
                        >
                          {taxonomies.map((item, index) => {
                            return (
                              <Option key={item._id}>
                                {item.tax_name}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="tax_type">
                          {" "}
                          Loại
                        </Label>
                        <Select
                          value={formVal.tax_type}
                          style={{ width: "100%" }}
                          onChange={onChangeTaxType}
                        >
                          <Option value="tag">Thẻ</Option>
                          <Option value="category">Danh mục</Option>
                        </Select>
                      </FormGroup>
                    </Col>
                    <Col lg={12}>
                      <div>
                      <Editor
                      apiKey={"w17lpon88s3owkb87t8wnmyrb7dnvziqf3mrghzfk7ft8cpl"}
                      onInit={(evt, editor) => editorDescriptionRef.current = editor}
                      initialValue={formVal?.tax_description}
                      // value=
                      init={{
                        height: 200,
                        menubar: false,
                        plugins: [
                          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                          'bold italic forecolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | link image | code',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                      }}
                    />
                      {/* <ReactQuill
                        defaultValue={formVal.tax_description}
                        onChange={onChangeTaxDescription}
                      /> */}

                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div className="text-center mt-4">
                <Link to="/taxonomy">
                  <Button
                    outline
                    size="large"
                    className="mr-3"
                  >
                    Quay lại
                  </Button>
                </Link>
                <Button size="large" onClick={() => addNewTaxonomy()}>
                  Lưu
                </Button>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default AddTaxonomy;

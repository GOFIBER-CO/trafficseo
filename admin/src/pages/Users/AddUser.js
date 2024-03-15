import React, { useEffect, useState } from "react";
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
  FormFeedback,
} from "reactstrap";

import { message, Badge, Space, Table, Modal, Select } from "antd";
import { Link, useParams, useHistory } from "react-router-dom";
import {
  addUser,
  getUser,
  updateUser,
  getAllRole,
  getpagingDomains,
} from "../../helpers/helper";
import BreadCrumb from "../../Components/Common/BreadCrumb";
const { Option } = Select;
const { Column } = Table;

const success = () => {
  message.success("Thành công");
};

const error = () => {
  message.error("Có lỗi xảy ra. Vui lòng thử lại!");
};

function AddUser() {
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [domainList, setDomainList] = useState([]);
  const [role, setRole] = useState("");
  const history = useHistory();
  const [formVal, setFormVal] = useState({
    username: "",
    name: "",
    password: "",
    role: "",
    domains: [],
  });
  const getDomains = async () => {
    let domains = await getpagingDomains(99999, 1, "");
    setDomainList(domains.data);
  };
  const getRole = async () => {
    let roleList = await getAllRole();
    
    setRoleList(roleList.data);
  };
  useEffect(() => {
    if (id && id !== "new") {
      getUser(id).then((res) => {
        console.log(res, "asdasdasdas");
        setUser(res);
        setFormVal(res);
      });
    }
    getDomains();
    getRole();
  }, [id]);

  const reset = () => {
    setFormVal({
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      role: "",
      domains: [],
    });
  };

  const onInputChange = (e) => {
    setFormVal({
      ...formVal,
      [e.target.name]: e.target.value,
    });
  };

  const onRoleChange = (e) => {
    setFormVal({ ...formVal, role: e });
  };
  const onDomainsChange = (value) => {
    setFormVal({
      ...formVal,
      domains: value,
    });
  };
  const addNewUser = () => {
    setSubmitted(true);
    if (formVal.password?.length < 6) {
      return;
    }
    if (user) {
      updateUser(id, formVal)
        .then((res) => {
          // reset();
          success();
          history.push("/users");
        })
        .catch((err) => {
          error();
        });
    } else {
      addUser(formVal)
        .then((res) => {
          // reset();
          history.push("/users");
          success();
        })
        .catch((err) => {
          error();
        });
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title={user ? "Sửa thành viên" : "Thêm thành viên"}
            pageTitle="Quản lý thành viên"
            slug="users"
          />
          <Row className="mb-3">
            <div className="mb-3">
              <Link to="/users">
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
                        <Label className="mb-1" for="firstName">
                          Họ
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="First name"
                          value={formVal?.firstName}
                          onChange={onInputChange}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="lastName">
                          Tên
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="First name"
                          value={formVal?.lastName}
                          onChange={onInputChange}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="username">
                          Tên đăng nhập
                        </Label>
                        <Input
                          id="username"
                          name="username"
                          placeholder="Nhập tên đăng nhập"
                          type="text"
                          disabled={id !== "new" ? true : false}
                          value={formVal?.username}
                          onChange={onInputChange}
                          invalid={
                            submitted
                              ? formVal.username.length >= 6
                                ? false
                                : true
                              : false
                          }
                        />
                        <FormFeedback
                          invalid={
                            submitted
                              ? formVal?.username?.length >= 6
                                ? false
                                : true
                              : false
                          }
                        >
                          Abc
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="password">
                          {" "}
                          Mật khẩu
                        </Label>
                        <Input
                          id="password"
                          name="password"
                          placeholder="password"
                          disabled={id !== "new" ? true : false}
                          value={formVal?.password}
                          onChange={onInputChange}
                          type="password"
                          invalid={
                            !id && submitted
                              ? formVal.password?.length >= 6
                                ? false
                                : true
                              : false
                          }
                        />
                        <FormFeedback
                          invalid={
                            submitted
                              ? formVal?.password?.length >= 6
                                ? false
                                : true
                              : false
                          }
                        >
                          Mật khẩu chứa ít nhất có 6 kí tự
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="domains">
                          Domains
                        </Label>
                        <Select
                          mode="multiple"
                          size="large"
                          name="domains"
                          id="domains"
                          value={formVal?.domains}
                          onChange={onDomainsChange}
                          placeholder="Domains"
                          style={{ width: "100%" }}
                        >
                          {domainList &&
                            domainList?.map((item, index) => {
                              return (
                                <Option value={item._id} key={item._id}>
                                  {item.host}
                                </Option>
                              );
                            })}
                          {/* <Option value="Admin">Quản lý</Option>
                          <Option value="Editor">Biên tập viên </Option>
                          <Option value="Collaborators">Cộng tác viên</Option> */}
                        </Select>
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="role">
                          Phân quyền
                        </Label>
                        <Select
                          size="large"
                          name="role"
                          id="role"
                          value={formVal?.role}
                          defaultValue={role}
                          onChange={onRoleChange}
                          placeholder="Role"
                          style={{ width: "100%" }}
                        >
                          {roleList &&
                            roleList?.map((item, index) => {
                              return (
                                <Option value={item._id} key={item._id}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          {/* <Option value="Admin">Quản lý</Option>
                          <Option value="Editor">Biên tập viên </Option>
                          <Option value="Collaborators">Cộng tác viên</Option> */}
                        </Select>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div className="text-center mt-4">
                <Link to="/users">
                  <Button outline size="large" className="mr-3">
                    Quay lại
                  </Button>
                </Link>
                <Button size="large" onClick={() => addNewUser()}>
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

export default AddUser;

import React, { useState, useEffect, useRef } from "react";
import { isEmpty } from "lodash";
import { deleteImageBunny } from "../../helpers/api_bunny";
import { Input as InputAntd } from "antd";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

import LoadingBar from "react-top-loading-bar";

import { Upload } from "antd";
// import ImgCrop from 'antd-img-crop';
import axios from "axios";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { Toaster } from "react-hot-toast";

//redux
import { useSelector, useDispatch } from "react-redux";

// actions
import { editProfile, resetProfileFlag } from "../../store/actions";
import config from "../../config";
import { uploadFileToBunny } from "../../helpers/api_bunny";
import { Auth2FA } from "./2FA";
import { editUser } from "../../helpers/helper";
import { toast } from "react-toastify";

const UserProfile = () => {
  const dispatch = useDispatch();

  const [email, setemail] = useState("admin@gmail.com");
  const [idx, setidx] = useState("1");
  const refLoading = useRef(null);
  const [userName, setUserName] = useState("");
  const [avatarImg, SetAvatarimg] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState();
  const dataUser = JSON.parse(sessionStorage.getItem("authUser"));

  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onRemove = async () => {
    try {
      await axios.patch(config.api.API_URL_CLIENT + "/api/v1/user/editAvatar", {
        id: idx,
        image: "",
      });
      const image = await deleteImageBunny(fileList[0].name);
      if (image) {
        setFileList([]);
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        obj.avatar = "";
        sessionStorage.removeItem("authUser");
        sessionStorage.setItem("authUser", JSON.stringify(obj));
        toast.success("Delete Success");
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete Fail");
    }
  };

  const onPreview = async (file) => {
    let src = file.url;
    // console.log(file);
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // const onbeforeUpload = (file) =>{
  //   console.log("file");
  // }

  const { user, success, error } = useSelector((state) => ({
    user: state.Profile.user,
    success: state.Profile.success,
    error: state.Profile.error,
  }));

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const result = await uploadFileToBunny(file);
    if (result.Message == "File uploaded.") {
      try {
        const result = await axios.patch(
          config.api.API_URL_CLIENT + "/api/v1/user/editAvatar",
          { id: idx, image: file.name }
        );
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        obj.avatar = file.name;
        sessionStorage.removeItem("authUser");
        sessionStorage.setItem("authUser", JSON.stringify(obj));

        setFileList([
          {
            url: `https://agency88.b-cdn.net/${file.name}`,
            status: "done",
            name: file.name,
            uid: "1",
          },
        ]);
        toast.success("Upload Success");
      } catch (error) {
        toast.error("Upload Failed");
      }
    }
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: userName,
      firstname: firstName,
      lastname: lastName,
      idx: idx || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter Your UserName"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile(values));
    },
  });

  // const handleUpdateProfile = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("firstname", firstName);
  //   formData.append("lastname", lastName);
  //   formData.append("username", userName);
  //   formData.append("id", idx);
  //   try {
  //     refLoading.current.continuousStart();
  //     await axios.patch(
  //       config.api.API_URL_CLIENT + "/api/v1/user/editProfile",
  //       formData
  //     );
  //     toast.success("Edit Success");
  //     const obj = JSON.parse(sessionStorage.getItem("authUser"));
  //     obj.firstName = firstName;
  //     obj.lastName = lastName;
  //     sessionStorage.removeItem("authUser");
  //     sessionStorage.setItem("authUser", JSON.stringify(obj));
  //     setFirstName(obj.firstName);
  //     setLastName(obj.lastName);
  //   } catch (error) {
  //     refLoading.current.complete();
  //     toast.error("Edit Failed");
  //   } finally {
  //     refLoading.current.complete();
  //   }
  // };
  const updatepassword = async () => {
    try {
      if (!password) return toast.warning("Vui lòng nhập mật khẩu");
      const result = await editUser(idx, { password });
      if (result?.status === 1) {
        toast.success("Cập nhật mật khẩu thành công!");
        setPassword("");
        return;
      }
    } catch (error) {
      toast.error("Cập nhật mật khẩu thất bại!");
    }
  };
  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));

      if (!isEmpty(user)) {
        obj.firstName = user.firstName;
        sessionStorage.removeItem("authUser");
        sessionStorage.setItem("authUser", JSON.stringify(obj));
      }

      setUserName(obj.username);
      setFirstName(obj.firstName);
      setLastName(obj.lastName);
      setemail(obj.email);
      setidx(obj?.user._id || "1");
      SetAvatarimg(obj.avatar);
      setFileList(
        obj.avatar
          ? [
              {
                url: `https://agency88.b-cdn.net/${obj.avatar}`,
                status: "done",
                name: obj.avatar,
                uid: "1",
              },
            ]
          : []
      );
      setRole(obj.role);

      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, user]);

  document.title = "Profile | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <Toaster />
      <LoadingBar color="red" ref={refLoading} />
      <div className="page-content">
        <Container fluid>
          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col lg="12">
                    {error && error ? (
                      <Alert color="danger">{error}</Alert>
                    ) : null}
                    {success ? (
                      <Alert color="success">
                        Username Updated To {userName}
                      </Alert>
                    ) : null}

                    <Card>
                      <CardBody>
                        <div className="d-flex">
                          <div className="mx-3">
                            <Upload
                              customRequest={uploadImage}
                              listType="picture-card"
                              fileList={fileList}
                              onChange={onChange}
                              onPreview={onPreview}
                              onRemove={onRemove}
                              // beforeUpload={onbeforeUpload}
                            >
                              {fileList.length < 1 && "+ Upload"}
                            </Upload>
                            {/* </ImgCrop> */}
                          </div>
                          <div className="flex-grow-1 align-self-center">
                            <div className="text-muted">
                              <h5>{userName || "Admin"}</h5>
                              <p className="mb-1">Email Id : {email}</p>
                              <p className="mb-0">Id No : #{idx}</p>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <h4 className="card-title mb-4">Kích hoạt 2FA</h4>

                <Auth2FA />
                <h4 className="card-title mt-4 mb-4">Cập nhật mật khẩu</h4>

                <div className="form-group">
                  {/* <Label className="form-label">User Name</Label> */}
                  <InputAntd.Password
                    placeholder="Mật khẩu"
                    value={password}
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {/* {validation.touched.username && validation.errors.username ? (
                    <FormFeedback type="invalid">
                      {validation.errors.username}
                    </FormFeedback>
                  ) : null}
                  <div className="d-flex" style={{ marginTop: "15px" }}>
                    <div style={{ width: "100%" }}>
                      <Input
                        name="firstname"
                        type="text"
                        placeholder="Firstname"
                        value={validation.values.firstname || ""}
                        onChange={(e) => {
                          validation.handleChange(e);
                          setFirstName(e.target.value);
                        }}
                      />
                      {validation.touched.firstname &&
                      validation.errors.firstname ? (
                        <FormFeedback type="invalid">
                          {validation.errors.firstname}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div style={{ width: "100%", marginRight: "15px" }}>
                      <Input
                        className="ms-20px"
                        name="lastname"
                        type="text"
                        placeholder="Lastname"
                        style={{ marginLeft: "15px" }}
                        value={validation.values.lastname || ""}
                        onChange={(e) => {
                          validation.handleChange(e);
                          setLastName(e.target.value);
                        }}
                      />
                      {validation.touched.lastname &&
                      validation.errors.lastname ? (
                        <FormFeedback type="invalid">
                          {validation.errors.lastname}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                  <Input name="idx" value={idx} type="hidden" /> */}
                </div>

                <div className="text-center mt-4">
                  <Button onClick={(e) => updatepassword()} color="danger">
                    Đổi mật khẩu
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;

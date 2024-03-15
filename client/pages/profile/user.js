import { updateUser } from "@/api/profile";
import ProfileLayout from "@/component/Layout/ProfileLayout";
import PostLoadMore from "@/component/Posts/PostLoadMore";
import { AuthContext } from "@/context/AuthContext";
import { getInstance } from "@/helper/axios";
import styles from "@/styles/Profile.module.scss";
import { Button, Form, Input, Tooltip, Upload } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineLoading, AiOutlinePlus } from "react-icons/ai";
import { BsQuestionCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const User = () => {
  const [form] = Form.useForm();
  const { user, getLoggedinUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.avatar);
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setLoading(false);
      setImageUrl(info.file.response.pathFile);
    }
  };
  const beforeUpload = (file) => {
    const isImage = file.type.includes("image");
    if (!isImage) {
      message.error("Sai định dạng!");
    }

    return isImage;
  };

  useEffect(() => {
    if (user) {
      form.setFieldValue("username", user?.username);
      form.setFieldValue("email", user?.email);
      form.setFieldValue("telegram", user?.telegram);
      form.setFieldValue("telegramId", user?.telegramId);
      form.setFieldValue("avatar", normFile(user?.avatar));
      setImageUrl(user.avatar);
    }
  }, [user]);

  const uploadButton = (
    <div>
      {loading ? <PostLoadMore /> : <AiOutlinePlus />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleSubmit = async (val) => {
    const formData = {
      ...val,
      avatar: imageUrl,
    };
    try {
      const res = await updateUser(user._id, formData);
      if (res.status === 1) {
        toast.success("Cập nhật thông tin hồ sơ thành công");
        await getLoggedinUser();
      } else {
        toast.error("Cập nhật thông tin hồ sơ thất bại");
      }
    } catch (error) {
      console.log(error);
      toast.error("Thêm/Cập nhật thông tin hồ sơ thất bại");
    }
  };

  return (
    <ProfileLayout>
      <div className={` ${styles["container"]}`}>
        <div
          className="d-flex flex-column p-3 w-100"
          style={{ flex: 1, borderBottom: "1px solid #efefef" }}
        >
          <h3 className={styles["payment-header"]}>Hồ sơ của tôi</h3>
        </div>
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 8 }}
          onFinish={handleSubmit}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="row p-2">
            <div className=" col-8 d-flex flex-column justify-content-center">
              <div className="pt-2" style={{ flex: 1 }}>
                <Form.Item
                  name="username"
                  label="Họ và Tên"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ tên",
                    },
                  ]}
                >
                  <Input placeholder="Họ và Tên" name="username" />
                </Form.Item>
              </div>
              <div className="pt-2" style={{ flex: 1 }}>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[{ min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" }]}
                >
                  <Input.Password placeholder="Mật khẩu" name="password" />
                </Form.Item>
              </div>
              <div className="pt-2" style={{ flex: 1 }}>
                <Form.Item
                  name="telegram"
                  label="Telegram"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập telegram",
                    },
                  ]}
                >
                  <Input placeholder="Telegram" name="telegram" />
                </Form.Item>
              </div>
              <div className="pt-2" style={{ flex: 1 }}>
                <Form.Item
                  name="telegramId"
                  label={
                    <div className="d-flex gap-2 align-item-center">
                      TelegramId
                      <Tooltip
                        placement="top"
                        title={
                          <div style={{ color: "#000" }}>
                            {
                              <span>
                                Để lấy ID Telegram, mở ứng dụng Telegram và tìm
                                kiếm từ khóa{" "}
                                <span
                                  style={{ color: "blue", fontWeight: "bold" }}
                                >
                                  @TrafficSeoBot
                                </span>{" "}
                                . Bấm chọn{" "}
                                <span
                                  style={{ color: "blue", fontWeight: "bold" }}
                                >
                                  TrafficSeoBot
                                </span>{" "}
                                sau đó bấm bắt đầu, bạn sẽ nhận được ID.
                              </span>
                            }
                          </div>
                        }
                        color="white"
                      >
                        <BsQuestionCircleFill
                          size={20}
                          color="blue"
                          style={{ marginLeft: "5px", cursor: "pointer" }}
                        />
                      </Tooltip>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập telegram id",
                    },
                  ]}
                >
                  <Input placeholder="TelegramId" name="telegramId" />
                </Form.Item>
              </div>
              <div className="pt-2" style={{ flex: 1 }}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Email",
                    },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Email" name="email" disabled />
                </Form.Item>
              </div>
              {/* <div className="pt-2" style={{ flex: 1 }}>
                <Form.Item name="password" label="Mật khẩu">
                  <Input.Password placeholder="Mật khẩu" name="password" />
                </Form.Item>
              </div> */}
            </div>
            <div
              className={`col col-4 d-flex flex-column justify-content-center align-items-center`}
              style={{ borderLeft: "1px solid #ebebeb" }}
            >
              <Form.Item
                name="avatar"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  name="image"
                  action="https://api.trafficsseo.com/api/v1/upload"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  customRequest={({
                    action,
                    data,
                    file,
                    filename,
                    headers,
                    onError,
                    onProgress,
                    onSuccess,
                    withCredentials,
                  }) => {
                    // EXAMPLE: post form-data with 'axios'
                    // eslint-disable-next-line no-undef
                    const formData = new FormData();
                    formData.append("image", file);

                    getInstance()
                      .post(action, formData, {
                        headers: {
                          ...headers,
                          "Content-Type": "multipart/form-data",
                        },
                      })
                      .then(({ data: response }) => {
                        onSuccess(response, file);
                      })
                      .catch(onError);

                    return {
                      abort() {
                        console.log("upload progress is aborted.");
                      },
                    };
                  }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        width: "100%",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
              <p>Thay đổi ảnh đại diện</p>
            </div>
            <div className="col-8 d-flex justify-content-center align-items-center">
              <Button type="primary" htmlType="submit" className="w-25">
                Lưu
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </ProfileLayout>
  );
};

export default User;

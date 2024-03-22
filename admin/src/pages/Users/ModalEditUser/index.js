import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import {
  editUser,
  getAllRole,
  getInfoPaymentByUserId,
  getPagingTeam,
} from "../../../helpers/helper";
import { toast } from "react-toastify";
import { banks } from "../../../common/banks";
const ListAccept = [
  { label: "Đang chờ duyệt", value: 0 },
  { label: "Đã duyệt", value: 1 },
  { label: "Từ chối", value: -1 },
];
const ModalEditUser = ({ record, getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [imageUrl, setImageUrl] = useState();
  const [form] = Form.useForm();
  const [role, setRole] = useState({});
  const [team, setTeam] = useState();
  const [roleList, setRoleList] = useState([]);
  const [teams, setTeams] = useState([]);
  const [bank, setBank] = useState();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleGetRoleList = async () => {
    let res = await getAllRole();
    setRoleList(res?.role);
  };

  const getTeams = async () => {
    let res = await getPagingTeam("", 10000000, 1);

    setTeams(res?.data);
  };

  const getInfoPayment = async (userId) => {
    try {
      const result = await getInfoPaymentByUserId(userId);
      form.setFieldsValue(result);
      setBank(result?.bank || "");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      handleGetRoleList();
      form.setFieldsValue(record);
      setImageUrl(record?.avatar);
      setRole(record?.roleOfUser?._id);
      const listTeam = record?.team?.map((item) => item?._id);
      setTeam(listTeam);
      getTeams();
      getInfoPayment(record?._id);
    } else {
      form.setFieldValue({
        fullName: "",
        stk: "",
      });
      setBank("");
    }
  }, [record, isModalOpen]);
  const handleUpdateUser = (value) => {
    value.roleOfUser = role;
    value.team = team;
    value.bank = bank;
    editUser(record?._id, value)
      .then(() => {
        getData();
        handleCancel();
        return toast.success("Cập nhật thông tin thành công!");
      })
      .catch(() => {
        return toast.error("Cập nhật thông tin thất bại!");
      });
  };
  return (
    <>
      <EditOutlined
        style={{ color: "blue", fontSize: "20px" }}
        onClick={showModal}
      />

      <Modal
        footer={null}
        title="Chỉnh sửa thông tin thành viên"
        open={isModalOpen}
        onOk={handleOk}
        width={1000}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          layout="vertical"
          form={form}
          onFinish={handleUpdateUser}
        >
          <Row gutter={10}>
            <Col md={12}>
              {" "}
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label="Tên hiển thị"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="Telegram" name="telegram">
                <Input />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="Mật khẩu" name="password">
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="Phân quyền">
                <Select
                  value={role}
                  onChange={(value) => setRole(value)}
                  options={roleList?.map((item) => {
                    return {
                      value: item?._id,
                      label: item?.name,
                    };
                  })}
                />
              </Form.Item>
            </Col>
            {record?.roleOfUser?.name === "btv" && (
              <Col md={12}>
                <Form.Item label="Duyệt tài khoản" name={"isAccept"}>
                  <Select
                    options={ListAccept?.map((item) => {
                      return {
                        value: item?.value,
                        label: item?.label,
                      };
                    })}
                  />
                </Form.Item>
              </Col>
            )}
            <Col md={12}>
              <Form.Item label="Team">
                <Select
                  mode="multiple"
                  value={team}
                  onChange={(value) => setTeam(value)}
                  options={teams?.map((item) => {
                    return {
                      value: item?._id,
                      label: item?.name,
                    };
                  })}
                />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="IP Đăng Nhập" name="ipLogin">
                <Input placeholder="Nhập ip cho phép đăng nhập" />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item label="Ngân hàng">
                <Select
                  value={bank}
                  allowClear
                  placeholder="Chọn ngân hàng"
                  onChange={(e) => {
                    setBank(e);
                    if (!e) {
                      form.setFieldValue("stk", "");
                      form.setFieldValue("fullName", "");
                    }
                  }}
                  style={{ width: "100%" }}
                  options={banks?.map((item) => ({
                    value: item?.shortName,
                    label: item?.shortName + " - " + item?.name,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item label="Số tài khoản" name="stk">
                <Input disabled={!bank} />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item label="Tên chủ thẻ" name="fullName">
                <Input disabled={!bank} />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item>
                <Upload
                  name="avatar"
                  listType="picture-circle"
                  className="avatar-uploader"
                  beforeUpload={() => false}
                  previewFile={true}
                  disabled
                >
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        width: "200px",
                        height: "200px",
                      }}
                    />
                  )}
                </Upload>
              </Form.Item>
            </Col>

            <Col md={12}>
              <div
                className="d-flex"
                style={{
                  gap: "40px",
                  alignItems: "center",
                }}
              >
                <Form.Item
                  label="Tình trạng"
                  name="isActivated"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  label="Đăng bài viết"
                  name="acceptPost"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  label="Kiểm tra IP"
                  name="isCheckIpLogin"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalEditUser;

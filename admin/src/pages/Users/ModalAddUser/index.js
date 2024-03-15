import { Button as ButtonStrap } from "reactstrap";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Upload,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import {
  addUser,
  editUser,
  getAllRole,
  getPagingTeam,
} from "../../../helpers/helper";
import { toast } from "react-toastify";

const ModalAddUser = ({ getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [form] = Form.useForm();
  const [teams, setTeams] = useState([]);
  const [role, setRole] = useState("6448f54ae9437aa31191d165");

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const getRoles = () => {
    getAllRole(1000, 1).then((data) => {
      setRoles(data?.role);
    });
  };
  const getTeams = async () => {
    let res = await getPagingTeam("", 1000000, 1);
    setTeams(res?.data);
  };
  useEffect(() => {
    if (isModalOpen) {
      getTeams();
      getRoles();
    }
  }, [isModalOpen]);
  const handleUpdateUser = (value) => {
    value.roleOfUser = role;

    addUser(value)
      .then(() => {
        getData();

        handleCancel();
        return toast.success("Thêm mới thành viên thành công!");
      })
      .catch(() => {
        return toast.error("Thêm mới thành viên thất bại!");
      });
  };
  return (
    <>
      <ButtonStrap onClick={showModal}>Thêm mới</ButtonStrap>

      <Modal
        footer={null}
        title="Thêm mới thành viên"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          layout="vertical"
          form={form}
          onFinish={handleUpdateUser}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tên hiển thị"
            name="username"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên hiển thị!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="passwordForUser"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Phân quyền">
            <Select
              value={role}
              onChange={(value) => setRole(value)}
              options={roles?.map((item) => {
                return {
                  label: item?.name,
                  value: item?._id,
                };
              })}
            />
          </Form.Item>
          <Form.Item label="Team" name="team">
            <Select
              mode="multiple"
              defaultValue={[]}
              options={teams?.map((item) => {
                return {
                  label: item?.name,
                  value: item?._id,
                };
              })}
            />
          </Form.Item>
          <Form.Item
            label="Tình trạng"
            name="isActivated"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch defaultChecked />
          </Form.Item>

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
export default ModalAddUser;

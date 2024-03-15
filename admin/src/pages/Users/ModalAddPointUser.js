import { FcMoneyTransfer } from "react-icons/fc";
import { Button, Form, Input, Modal, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { upgradePoint } from "../../helpers/helper";
import { toast } from "react-toastify";
// import { editUser } from "../../../helpers/helper";

const ModalAddPointUser = ({ record, getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    form.setFieldsValue(record);
  }, [record]);
  const handleUpdateUser = (value) => {
    upgradePoint(record?._id, { point: value?.pointAdd })
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
      <Tooltip title="Cộng điểm cho người dùng">
        <FcMoneyTransfer
          style={{ color: "green", fontSize: "20px", cursor: "pointer" }}
          onClick={showModal}
        />
      </Tooltip>

      <Modal
        footer={null}
        title="Cộng điểm cho người dùng"
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
          <Form.Item label="_id" name="_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điểm"
            name="pointAdd"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập điểm!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cộng điểm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalAddPointUser;

import React, { useState } from "react";
import { Modal, notification } from "antd";
import { updateBrandById } from "../../helpers/helper";
import { Button, Input } from "reactstrap";
import { EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
const ModalEditBrand = ({ getData, record }) => {
  const [name, setName] = useState(record?.name);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const updateBrand = await updateBrandById(record?._id, { name: name });
      getData();

      toast.success("Cập nhật brand thành công!");
      return setIsModalOpen(false);
    } catch (error) {
      toast.error("Cập nhật brand thất bại!");
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <EditOutlined
        onClick={showModal}
        color="blue"
        size={20}
        style={{ color: "blue", fontSize: 20 }}
      />

      <Modal
        title="Cập nhật brand"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Nhập tên brand"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Modal>
    </>
  );
};
export default ModalEditBrand;

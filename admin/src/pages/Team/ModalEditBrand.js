import React, { useEffect, useState } from "react";
import { Modal, notification } from "antd";
import { updateBrandById, updateTeamById } from "../../helpers/helper";
import { Button, Input } from "reactstrap";
import { EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
const ModalEditBrand = ({ getData, record }) => {
  const [name, setName] = useState(record?.name);
  useEffect(() => {
    setName(record?.name);
  }, [record]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const updateBrand = await updateTeamById(record?._id, { name: name });
      getData();

      toast.success("Cập nhật team thành công!");
      return setIsModalOpen(false);
    } catch (error) {
      toast.error("Cập nhật team thất bại!");
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
        title="Cập nhật team"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Nhập tên team"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Modal>
    </>
  );
};
export default ModalEditBrand;

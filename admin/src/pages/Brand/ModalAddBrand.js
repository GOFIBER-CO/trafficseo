import React, { useState } from "react";
import { Modal } from "antd";
import { createdBrand } from "../../helpers/helper";
import { Button, Input } from "reactstrap";
import { toast } from "react-toastify";
const ModalAddBrand = ({ getData }) => {
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const addBrand = await createdBrand({ name: name });
      getData();
      toast.success("Tạo mới brand thành công!");
      return setIsModalOpen(false);
    } catch (error) {
      toast.error("Tạo mới brand thất bại!");
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button
        style={{ backgroundColor: "green", border: "none" }}
        onClick={showModal}
      >
        Thêm mới
      </Button>
      <Modal
        title="Tạo mới brand"
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
export default ModalAddBrand;

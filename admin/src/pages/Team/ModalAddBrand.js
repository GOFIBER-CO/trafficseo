import React, { useState } from "react";
import { Modal } from "antd";
import { createdBrand, createdTeam } from "../../helpers/helper";
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
      const addBrand = await createdTeam({ name: name });
      getData();
      toast.success("Tạo mới team thành công!");
      return setIsModalOpen(false);
    } catch (error) {
      toast.error("Tạo mới team thất bại!");
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
        title="Tạo mới team"
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
export default ModalAddBrand;

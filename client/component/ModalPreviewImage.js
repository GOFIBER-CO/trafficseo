import { Button, Modal } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import { BsImage } from "react-icons/bs";
const ModalPreviewImage = ({ url }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <BsImage color="blue" onClick={showModal} size={20} />

      <Modal
        title="Hình ảnh Bill"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={600}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <img src={url} alt="bill thanh toán" width={400} height={700} />
      </Modal>
    </>
  );
};
export default ModalPreviewImage;

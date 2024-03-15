import React, { useState } from "react";
import { Button, Modal, notification } from "antd";
import { rejectedPayment } from "../../../helpers/helper";
import { toast } from "react-toastify";
const ModalRejectedPayment = ({ id, handleCancelParent, getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const reject = await rejectedPayment(id, { reason: reason });
      setIsModalOpen(false);
      handleCancelParent();
      getData();
      return toast.success("Từ tối thanh toán thành công!");
      // return notification.success({
      //   message: "Từ tối thanh toán ",
      //   description: "Từ tối thanh toán thành công",
      // });
    } catch (error) {
      return toast.success("Từ tối thanh toán thất bại!");
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal} danger>
        Từ chối
      </Button>
      <Modal
        title="Từ chối thanh toán"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <textarea
          placeholder="Vui lòng nhập lý do"
          className="w-100 p-2"
          style={{ minHeight: "100px" }}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
    </>
  );
};
export default ModalRejectedPayment;

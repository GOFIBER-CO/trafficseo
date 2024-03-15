import React, { useState } from "react";
import { Button, Modal, notification } from "antd";
import { Button as ButtonStrap } from "reactstrap";
import { enableUpPostUser } from "../../helpers/helper";
import { toast } from "react-toastify";
const ModalAcceptPost = ({ listId, getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      if (listId?.length === 0) {
        return toast.warning("Vui lòng chọn người dùng!");
      }
      const update = await enableUpPostUser({ ids: listId });
      setIsModalOpen(false);
      getData();
      return toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      return toast.error("Cập nhật thông tin thất bại!");
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <ButtonStrap
        onClick={showModal}
        className="bg-success"
        style={{ border: "none" }}
      >
        Kích hoạt đăng bài
      </ButtonStrap>
      <Modal
        title="Cho phép người dùng đăng bài"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn có chắc chắn muốn cho người dùng đăng bài?</p>
      </Modal>
    </>
  );
};
export default ModalAcceptPost;

import React, { useState } from "react";
import { Button, Modal, notification } from "antd";
import { Button as ButtonStrap } from "reactstrap";
import { disableUpPostUser } from "../../helpers/helper";
import { toast } from "react-toastify";
const ModalDisableUpPost = ({ listId, getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      if (listId?.length === 0) {
        return toast.warning("Vui lòng chọn người dùng!");
      }
      const update = await disableUpPostUser({ ids: listId });
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
        className="bg-danger"
        style={{ border: "none" }}
      >
        Khóa đăng bài
      </ButtonStrap>
      <Modal
        title="Khóa chức năng đăng bài với người dùng đã chọn"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>
          Bạn có chắc chắn muốn khóa chức năng đăng bài với người dùng đã chọn?
        </p>
      </Modal>
    </>
  );
};
export default ModalDisableUpPost;

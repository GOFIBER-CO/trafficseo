import React, { useState } from "react";
import { Button, Modal, Tooltip } from "antd";
import { FaRegCheckSquare } from "react-icons/fa";
import { acceptPost } from "../../helpers/helper";
import { toast } from "react-toastify";
const ModalAcceptPost = ({ id, getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const data = await acceptPost(id);
      if (data?.status === 1) {
        setIsModalOpen(false);
        getData();
        return toast.success(data?.message || "Duyệt bài viết thành công!");
      } else {
        setIsModalOpen(false);
        return toast.error(data?.message || "Duyệt bài viết thất bại!");
      }
    } catch (error) {
      return toast.error("Duyệt bài viết thất bại!");
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Tooltip title="Duyệt bài viết">
        <FaRegCheckSquare
          color="green"
          size={20}
          onClick={showModal}
          cursor={"pointer"}
        />
      </Tooltip>

      <Modal
        title="Duyệt bài viết"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn có chắc chắn muốn duyệt bài viết này?</p>
      </Modal>
    </>
  );
};
export default ModalAcceptPost;

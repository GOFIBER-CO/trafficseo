import { deleteMultiPost } from "@/api/post";
import { Button, Modal } from "antd";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
const ModalDeleteMultiPost = ({ ids, getData, resetSelected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    deleteMultiPost(ids)
      .then(() => {
        toast.success("Xóa bài viết thành công!");
        getData();
        resetSelected();
      })
      .catch(() => {
        toast.error("Xóa bài viết thất bại!");
      });
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Button icon={<FaTrash />} danger onClick={showModal}>
        Xóa tất cả
      </Button>
      <Modal
        title="Xóa bài viết"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn có chắc chắn muốn xóa bài viết?</p>
      </Modal>
    </>
  );
};
export default ModalDeleteMultiPost;

import { deletePost } from "@/api/post";
import { Button, Modal } from "antd";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
const ModalDeletePost = ({ record, getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    deletePost(record?._id)
      .then((data) => {
        if (data?.status === -1) {
          toast.error(data?.message || "Xóa bài viết thất bại!");
        } else {
          toast.success("Xóa bài viết thành công!");
          getData();
        }
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
      <FaTrash onClick={showModal} size={20} cursor="pointer" color="red" />
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
export default ModalDeletePost;

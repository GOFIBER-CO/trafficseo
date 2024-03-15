import React, { useState } from "react";
import { Input, Modal, Tooltip } from "antd";
import { FaRegWindowClose } from "react-icons/fa";
import { rejectPost } from "../../helpers/helper";
import { toast } from "react-toastify";
const ModalRejectPost = ({ id, getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState("");
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const data = await rejectPost(id, note);
      if (data?.status === 1) {
        getData();
        setIsModalOpen(false);
        return toast.success(data?.message || "Từ chối bài viết thành công!");
      } else {
        return toast.error(data?.message || "Từ chối bài viết thất bại!");
      }
    } catch (error) {
      return toast.error("Từ chối bài viết thất bại!");
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Tooltip title="Từ chối bài viết">
        <FaRegWindowClose
          color="red"
          size={20}
          onClick={showModal}
          cursor={"pointer"}
        />
      </Tooltip>

      <Modal
        title="Từ chối bài viết"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Nhập lý do"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Modal>
    </>
  );
};
export default ModalRejectPost;

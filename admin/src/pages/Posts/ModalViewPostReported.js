import TextArea from "antd/lib/input/TextArea";
import React, { useCallback, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { createPost, updatePost } from "../../helpers/helper";
import { toast } from "react-toastify";
import { EyeOutlined } from "@ant-design/icons";
import { Col, Input, Row, Space } from "antd";
import Title from "antd/lib/typography/Title";

export default function ModalViewPostReported({ record, getData }) {
  const [postContent, setPostContent] = useState(record?.postId?.content);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const handleChange = useCallback((e) => {
    setPostContent(e.target.value);
  }, []);
  const toggle = useCallback(
    () => setOpenCreatePost(!openCreatePost),
    [openCreatePost]
  );
  const handleSubmit = useCallback(async () => {
    try {
      const editPost = await updatePost(record?._id, postContent);
      toggle();
      getData();
      toast.success("Cập nhật thành công!");
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  }, [postContent, toggle]);
  return (
    <>
      <EyeOutlined
        style={{ color: "blue", fontSize: "20px" }}
        onClick={toggle}
      />
      <Modal
        isOpen={openCreatePost}
        toggle={toggle}
        // className={className}
        centered
        backdrop={true}
        // keyboard={keyboard}
      >
        <ModalHeader className={"modal-header"} toggle={toggle}>
          Thông tin bài viết bị báo cáo
        </ModalHeader>
        <ModalBody>
          <Row gutter={[12]}>
            <Col md={12}>
              <Title level={5}>Tên người dùng</Title>
            </Col>
            <Col md={12}>
              <Title level={5}>Lý do</Title>
            </Col>
            {record?.details?.map((item) => (
              <>
                <Col md={12} key={item}>
                  <Input value={item?.userId?.username} />
                </Col>
                <Col md={12}>
                  <Input value={item?.reason} />
                </Col>
              </>
            ))}
          </Row>
          <TextArea
            disabled
            className={`w-100 h-100 post-content-input`}
            style={{ marginTop: "20px" }}
            rows={8}
            placeholder={`Điểm nhiều hơn 10k sẽ được ưu tiên hiển thị.
Nhập 3 link dạng: http://domain.com###keywords!!!.
Chú ý  '###' và '!!!' là cấu trúc bắt buộc có của đường link.`}
            value={postContent}
            onChange={handleChange}
          ></TextArea>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="w-100" onClick={toggle}>
            Trở về
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { TbReportAnalytics } from "react-icons/tb";
import { getPostReportedById } from "../../helpers/helper";
const ModalReportList = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataExtension, setDataExtension] = useState([]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const getData = async () => {
    const data = await getPostReportedById(id, "", 1000, 1);
    setData(data?.data?.[0]);
    setDataExtension(data?.dataExtension || []);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (isModalOpen) getData();
  }, [isModalOpen, id]);
  return (
    <>
      <TbReportAnalytics onClick={showModal} size={22} cursor={"pointer"} />

      <Modal
        title={`Danh sách report từ người dùng bài viết ${
          data?.postId?.content || ""
        }`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <div className="row">
          <div className="col-6">
            <span style={{ fontSize: 15, fontWeight: 500 }}>Từ người dùng</span>
            <div className="d-grid">
              {data?.details?.map((item) => (
                <span key={item} style={{ fontSize: 15, fontWeight: 500 }}>
                  Lý do {item?.reason} từ người dùng {item?.userId?.username}
                </span>
              ))}
            </div>
          </div>
          <div className="col-6">
            <span style={{ fontSize: 15, fontWeight: 500 }}>Từ extention</span>
            <div className="d-grid">
              {dataExtension?.map((item) => (
                <span key={item} style={{ fontSize: 15, fontWeight: 500 }}>
                  Từ người dùng {item?.username}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ModalReportList;

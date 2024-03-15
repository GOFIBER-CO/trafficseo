import { editPostUser } from "@/api/post";

import { Button, Col, Form, Input, Modal, Row, Select, Switch } from "antd";
import { useContext, useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import { AuthContext } from "@/context/AuthContext";
const ModalEditPost = ({ record, getData, brand }) => {
  useEffect(() => {
    form.setFieldsValue(record);
    setSelectedBrand(record?.brand?._id);
    setBrands(brand);
    setTrafficByDay(record?.quantityCurrent);
    setStartDate(new Date(record?.dateCompleted));
    setStatus(record?.status === 2 || record?.status === 6);
  }, [record, brand]);
  const { user } = useContext(AuthContext);
  const [brands, setBrands] = useState(brand);
  const [selectedBrand, setSelectedBrand] = useState(record?.brand);
  const [status, setStatus] = useState(
    record?.status === 2 || record?.status === 6
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [trafficByDay, setTrafficByDay] = useState({});
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {};
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async () => {
    editPostUser(record?._id, {
      content: form.getFieldValue("content"),
      quantityEveryDay: form.getFieldValue("quantityEveryDay"),
      quantityTotal: form.getFieldValue("quantityTotal"),
      status: status,
      brand: form.getFieldValue("brand"),
      dateCompleted: moment(form.getFieldValue("dateCompleted1")).toISOString(),
    })
      .then((data) => {
        if (data?.status === 1) {
          getData();
          toast.success("Cập nhật bài viết thành công!");
          setIsModalOpen(false);
          return;
        } else {
          return toast.error(data?.message || "Cập nhật bài viết thất bại!");
        }
      })
      .catch(() => {
        toast.error("Cập nhật bài viết thất bại!");
      });
  };
  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <BiEdit onClick={showModal} size={20} cursor="pointer" color="blue" />
      <Modal
        title="Chỉnh sửa bài viết"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
            <Form.Item label="Nội dung" name="content">
            <Input
              disabled={
                (record?.status > 0 && user?.role?.name === "btv") ||
                (record?.status > 1 && user?.role?.name === "leader")
              }
            />
          </Form.Item>
            <Form.Item label="Traffic mỗi ngày" name="quantityEveryDay">
            <Input
              disabled={
                (record?.status > 0 && user?.role?.name === "btv") ||
                (record?.status > 1 && user?.role?.name === "leader")
              }
            />
          </Form.Item>
          <Form.Item label="Traffic tổng" name="quantityTotal">
            <Input
              disabled={
                (record?.status > 0 && user?.role?.name === "btv") ||
                (record?.status > 1 && user?.role?.name === "leader")
              }
            />
          </Form.Item>
          <Form.Item label="Brand" name={"brand"}>
            <Select
              disabled={
                (record?.status > 0 && user?.role?.name === "btv") ||
                (record?.status > 1 && user?.role?.name === "leader")
              }
              value={selectedBrand}
              options={brands?.map((item) => {
                return {
                  label: item?.name,
                  value: item?._id,
                };
              })}
            ></Select>
          </Form.Item>
          <Form.Item label="Số lượng hoàn thành" name={"quantityCurrent"}>
            {Object.keys(trafficByDay || {})?.length > 0 ? (
              Object.keys(trafficByDay || {})?.map((item) => (
                <div key={item}>
                  <span style={{ fontSize: 15, fontWeight: "bold" }}>
                    {item}
                  </span>
                  :{" "}
                  <span
                    style={{ fontSize: 15, fontWeight: "bold", color: "green" }}
                  >
                    {trafficByDay[item]}{" "}
                  </span>
                </div>
              ))
            ) : (
              <span style={{ fontSize: 15, fontWeight: "bold" }}>Chưa có</span>
            )}
          </Form.Item>
       {/*   <Form.Item label="Dự kiến hoàn thành" name={"dateCompleted1"}>
            <ReactDatePicker
              disabled={record?.status !== 0}
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="p-1 border w-100"
              dateFormat={"dd-MM-yyyy"}
            ></ReactDatePicker>
          </Form.Item>*/}
          {(record?.status === 2 ||
            record?.status === 3 ||
            record?.status === 6) && (
            <Form.Item label="Trạng thái" name={"status"}>
              <Switch
                checked={status}
                onChange={(checked) => setStatus(checked)}
              />
            </Form.Item>
          )}

          <Form.Item className="d-flex gap-3">
            <Row gutter={[10, 10]}>
              <Col>
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Col>
              <Col>
                <Button type="default" onClick={() => handleCancel()}>
                  Trở về
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalEditPost;

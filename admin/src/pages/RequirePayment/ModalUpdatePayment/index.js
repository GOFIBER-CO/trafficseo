import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Upload,
  message,
} from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { updatePayment, uploadImage } from "../../../helpers/helper";
import ModalRejectedPayment from "../ModalRejectedPayment";
import { toast } from "react-toastify";
const ModalUpdatePayment = ({ record, getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    // setPermission(JSON.parse(sessionStorage.getItem("permission") || []));
    setUser(JSON.parse(sessionStorage.getItem("authUser") || []));
  }, []);
  useEffect(() => {
    form.setFieldsValue(record);
    setData(record);
    setFile(record?.image ? { url: record?.image } : null);
    setImageQr(
      `https://img.vietqr.io/image/${record?.infoPayment?.bank}-${
        record?.infoPayment?.stk
      }-compact2.jpg?amount=${
        record?.amount
      }&addInfo=${`Thanh toan tiền cho ${record?.user?.username}`}&accountName=${
        record?.infoPayment?.fullName
      }`
    );
  }, [record, isModalOpen]);
  console.log(user);
  const [file, setFile] = useState();
  const [form] = Form.useForm();
  const [data, setData] = useState({});
  const [imageQr, setImageQr] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const uploadImageServer = async () => {
    if (!file?.originFileObj) return null;
    const formData = new FormData();
    formData.append("image", file?.originFileObj);
    const result = await uploadImage(formData);
    return result?.pathFile;
  };
  const handleCancel = () => {
    form.resetFields();

    setIsModalOpen(false);
  };
  const handleUpdatePayment = async (value) => {
    try {
      let url = "";
      if (file?.originFileObj) {
        let result = await uploadImageServer();

        const update = await updatePayment(value?._id, {
          status: value?.status,
          image: result,
        });
      } else {
        const update = await updatePayment(value?._id, {
          status: value?.status,
          image: file?.url || "",
        });
      }
      toast.success("Cập nhật thanh toán thành công!");

      handleCancel();
      getData();
    } catch (error) {
      toast.error("Cập nhật thanh toán thất bại!");
    }
  };
  return (
    <>
      <EditOutlined
        size={20}
        style={{ color: "blue", fontSize: 20 }}
        onClick={showModal}
      />
      <Modal
        title="Cập nhật yêu cầu thanh toán"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          name="basic"
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          onFinish={handleUpdatePayment}
          autoComplete="off"
        >
          <Row gutter={10}>
            <Form.Item label="_id" name="_id" hidden>
              <Input disabled />
            </Form.Item>
            <Col md={12}>
              <Form.Item
                label="Người dùng"
                name="username"
                initialValue={data?.user?.username}
              >
                <Input value={data?.user?.username} disabled />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="Số điểm" name="points">
                <InputNumber
                  disabled
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="Số tiền" name="amount">
                <InputNumber
                  disabled
                  style={{ width: "100%" }}
                  defaultValue={data?.amount}
                  formatter={(value) =>
                    `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                label="Tên ngân hàng"
                name="bank"
                initialValue={data?.infoPayment?.bank}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label="Tên trên thẻ"
                name="fullName"
                initialValue={data?.infoPayment?.fullName}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label="Số tài khoản"
                name="stk"
                initialValue={data?.infoPayment?.stk}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item
                label="Trạng thái yêu cầu"
                name="status"
                initialValue={data?.infoPayment?.status}
              >
                <Radio.Group defaultValue={data?.infoPayment?.status}>
                  <Radio value={"pending"}>Chờ xử lý</Radio>
                  <Radio value={"completed"}>Đã hoàn thành</Radio>
                  <Radio disabled value={"rejected"}>
                    Từ chối
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="QRCODE" name="qrImage">
                <img src={imageQr} height={350} width={350} />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="Hình ảnh" name="image/pn">
                <Upload
                  name="file"
                  listType="picture"
                  fileList={file ? [{ ...file }] : []}
                  onChange={(file) => setFile(file.fileList?.[0] || null)}
                  beforeUpload={(file) => {
                    const isPNG =
                      file.type === "image/png" ||
                      file.type === "image/jpg" ||
                      file.type === "image/jpeg";
                    if (!isPNG) {
                      message.error(`${file.name} không phải là hình ảnh`);
                    }
                    return isPNG;
                  }}
                >
                  {!file && (
                    <Button icon={<UploadOutlined />}>Upload hình ảnh</Button>
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          {user?.user?.roleOfUser?.name !== "leader" && (
            <div className="d-flex gap-3">
              <>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Cập nhật
                  </Button>
                </Form.Item>
                <Form.Item>
                  <ModalRejectedPayment
                    id={data?._id}
                    handleCancelParent={handleCancel}
                    getData={getData}
                  />
                </Form.Item>
              </>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};
export default ModalUpdatePayment;

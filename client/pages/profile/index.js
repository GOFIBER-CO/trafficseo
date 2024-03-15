import {
  createRequest,
  deleteRequest,
  getInfoPayments,
  getRequest,
} from "@/api/profile";
import ProfileLayout from "@/component/Layout/ProfileLayout";
import ModalPreviewImage from "@/component/ModalPreviewImage";
import styles from "@/styles/Profile.module.scss";
import { useCheckAuth } from "@/utils/useCheckAuth";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";

const { Column } = Table;
const { TextArea } = Input;
const { useForm } = Form;

const status = {
  pending: {
    label: "Chờ xác nhận",
    color: "blue",
  },
  completed: {
    label: "Đã thanh toán",
    color: "green",
  },
  rejected: {
    label: "Từ chối",
    color: "red",
  },
};

const RequestManager = () => {
  const [tabActive, setTabActive] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [amount, setAmount] = useState(0);
  const [openCreateRequest, setOpenCreateRequest] = useState(false);
  const { user } = useCheckAuth();
  const [requestList, setRequestList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRequestList = async (pageSize, pageIndex, status) => {
    setLoading(true);
    const res = await getRequest(pageSize, pageIndex, status);
    setLoading(false);
    setRequestList(res?.data);
    setTotalPage(res?.totalDoc);
  };

  const [infoPaymentList, setInfoPaymentList] = useState([]);

  const getPayments = async () => {
    const res = await getInfoPayments(50, 1);

    setInfoPaymentList(
      res?.data.map((inforPayment) => {
        return {
          label: `STK: ${inforPayment.stk} - ${inforPayment.bank}`,
          value: inforPayment._id,
        };
      })
    );
  };
  useEffect(() => {
    getPayments();
  }, []);
  useEffect(() => {
    form.setFieldValue("amount", user?.point || 0);
    setAmount(user?.point || 0);
  }, [user]);
  useEffect(() => {
    getRequestList(pageSize, pageIndex, tabActive);
  }, [tabActive, pageIndex, pageSize]);

  const onClose = () => {
    setOpenCreateRequest(false);
    form.resetFields();
  };
  const onOpen = () => {
    setOpenCreateRequest(true);
  };
  const onDelete = async (val) => {
    try {
      const res = await deleteRequest(val);
      if (res.status === 1) {
        toast.success("Xóa yêu cầu thanh toán thành công");
        await getRequestList(pageSize, pageIndex, tabActive);
      } else {
        toast.error("Xóa yêu cầu thanh toán thất bại");
      }
    } catch (error) {
      toast.error("Xóa yêu cầu thanh toán thất bại");
    }
  };

  const [form] = useForm();
  const onPointChange = (e) => {
    form.setFieldValue("amount", user?.point || 0);
    setAmount(user?.point || 0);
  };
  const handleSubmit = async (value) => {
    try {
      if (user?.point < 100000) {
        return toast.warning("Thanh toán tối thiểu là 100,000");
      }
      const res = await createRequest({ ...value, points: user?.point });
      if (res.status === 1) {
        setRequestList([...requestList, res.payment]);
        toast.success("Tạo yêu cầu thành công");
      } else {
        toast.error(res?.message || "Tạo yêu cầu thất bại");
      }
      // }
    } catch (error) {
      toast.error("Tạo/Cập nhật yêu cầu thất bại");
    }
    onClose();
  };

  const onChangeTab = (tabNum) => {
    setTabActive(tabNum);
  };
  const handleOnChangeTable = ({ current, pageSize, total }) => {
    setPageIndex(current);
    setPageSize(pageSize);
  };

  return (
    <ProfileLayout>
      <div
        className={`d-flex justify-content-between align-items-center ${styles["container"]}`}
      >
        <div
          className={`${styles["tab-container"]} py-3 ${
            tabActive === 0 && styles["active"]
          }`}
          style={{ borderBottomLeftRadius: "0.5rem" }}
          onClick={() => onChangeTab(0)}
        >
          <span
            className="text-capitalize font-weight-normal"
            style={{ fontWeight: "bold" }}
          >
            Tất cả
          </span>
        </div>
        <div
          className={`${styles["tab-container"]} py-3 ${
            tabActive === 1 && styles["active"]
          }`}
          onClick={() => onChangeTab(1)}
        >
          <span className="text-capitalize" style={{ fontWeight: "bold" }}>
            Chờ thanh toán
          </span>
        </div>

        <div
          className={`${styles["tab-container"]} py-3 ${
            tabActive === 2 && styles["active"]
          }`}
          onClick={() => onChangeTab(2)}
        >
          <span className="text-capitalize" style={{ fontWeight: "bold" }}>
            Đã thanh toán
          </span>
        </div>
        <div
          className={`${styles["tab-container"]} py-3 ${
            tabActive === 3 && styles["active"]
          }`}
          style={{ borderBottomRightRadius: "0.5rem" }}
          onClick={() => onChangeTab(3)}
        >
          <span className="text-capitalize" style={{ fontWeight: "bold" }}>
            Từ chối
          </span>
        </div>
      </div>
      <div className={`d-flex justify-content-start align-items-center mt-3`}>
        <Button
          onClick={onOpen}
          className="bg-success text-white border-success"
        >
          Thêm yêu cầu
        </Button>
      </div>
      <div
        className={`d-flex justify-content-between align-items-center mt-3 ${styles["container"]}`}
      >
        <Table
          rowKey="_id"
          style={{ width: "100%" }}
          dataSource={requestList}
          loading={loading}
          pagination={{
            total: totalPage,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: pageSize,
            current: pageIndex,
          }}
          locale={{
            emptyText: <p className="text-dark">Bạn chưa có yêu cầu nào! </p>,
          }}
          onChange={(e) => handleOnChangeTable(e)}
        >
          <Column
            title="#"
            render={(val, rec, index) => {
              return index + 1;
            }}
          />
          <Column title="Số điểm" dataIndex="points" key="point" />{" "}
          <Column
            title="Số tiền"
            dataIndex="amount"
            key="monney"
            render={(val) =>
              val.toLocaleString("vi-Vn", {
                style: "currency",
                currency: "VND",
              })
            }
          />
          <Column
            title="Thông tin thanh toán"
            dataIndex="infoPayment"
            key="infoPayment"
            render={(val) => `${val?.stk} - ${val?.bank}`}
          />
          <Column
            title="Thời gian tạo"
            dataIndex="createdAt"
            key="createdAt"
            render={(val) => moment(val).format("DD MM YYYY")}
          />
          <Column
            title="Hình ảnh"
            dataIndex="image"
            key="image"
            render={(val) => val && <ModalPreviewImage url={val} />}
          />
          <Column
            title="Trạng thái"
            dataIndex="status"
            key="status"
            render={(val) => (
              <Tag color={status[val].color}>{status[val].label}</Tag>
            )}
          />
          <Column
            title="Hành động"
            key="action"
            render={(val, record) => (
              <Space size="middle">
                {/* <Popconfirm
                  title="Bạn có chắc chắn muốn xóa yêu cầu thanh toán này?"
                  onConfirm={() => {
                    onDelete(val._id);
                  }}
                  disabled={val.status !== "pending"}
                  okText="Có"
                  cancelText="Không"
                >
                  <AiOutlineDelete
                    size={24}
                    style={{ color: "red", cursor: "pointer" }}
                  />
                </Popconfirm> */}
              </Space>
            )}
          />
        </Table>
      </div>
      <Modal
        open={openCreateRequest}
        onCancel={onClose}
        title="Tạo yêu cầu thanh toán"
        // className={className}

        // backdrop={true}
        // keyboard={keyboard}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          // onFinishFailed={onFinishFailed}
          name="createPayment"
          autoComplete="off"
        >
          <Form.Item
            name="infoPaymentId"
            label="Phương thức thanh toán"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn phương thức thanh toán",
              },
            ]}
          >
            <Select options={infoPaymentList} />
          </Form.Item>
          {/* <Form.Item
            name="points"
            label="Số điểm quy đổi"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn điểm",
              },
            ]}
          >
            <Input placeholder="Nhập số điểm" onChange={onPointChange} />
            <Radio.Group
              options={point}
              name="points"
              style={{ display: "flex", flexDirection: "column" }}
              onChange={onPointChange}
              // optionType="button"
              buttonStyle="solid"
            />
          </Form.Item> */}
          <Form.Item name="amount" label="Thành tiền">
            {/* <Input
              placeholder="Thành tiền"
              name="amount"
              disabled
              allowClear={true}
              formatter={(value) =>
                `${parseInt(value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            /> */}
            <InputNumber
              placeholder="Thành tiền"
              name="amount"
              disabled
              allowClear={true}
              style={{ width: "100%", color: "black", fontWeight: 700 }}
              formatter={(value) =>
                `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" className="bg-success">
              Yêu cầu
            </Button>

            <Button
              type="primary"
              htmlType="button"
              onClick={onClose}
              //   onClick={() => handleRefreshCreate()}
            >
              Hủy bỏ
            </Button>
          </Space>
        </Form>
      </Modal>
    </ProfileLayout>
  );
};

export default RequestManager;

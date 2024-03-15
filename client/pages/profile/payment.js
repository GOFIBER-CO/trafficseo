import {
  createInfoPayment,
  deleteInfoPayment,
  updateInfoPayment,
  getInfoPayments,
} from "@/api/profile";
import ProfileLayout from "@/component/Layout/ProfileLayout";
import { bankName } from "@/helper/constant";
import { toLowerCaseNonAccentVietnamese } from "@/helper/tools";
import styles from "@/styles/Profile.module.scss";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";

const { Column } = Table;

const PaymentManager = () => {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const [openCreatePaymentInfor, setOpenCreatePaymentInfor] = useState(false);
  const [infoPaymentList, setInfoPaymentList] = useState([]);
  const [infoPaymentId, setInfoPaymentId] = useState();
  const [loading, setLoading] = useState(false);
  const getPayments = async (pageSize, pageIndex) => {
    setLoading(true);
    const res = await getInfoPayments(pageSize, pageIndex);
    setLoading(false);
    setInfoPaymentList(res?.data);
    setTotalPage(res?.totalDocs);
  };
  useEffect(() => {
    getPayments(pageSize, pageIndex);
  }, [pageIndex, pageSize]);

  const handleOnChangeTable = ({ current, pageSize, total }) => {
    setPageIndex(current);
    setPageSize(pageSize);
  };

  const onClose = () => {
    setOpenCreatePaymentInfor(false);
    form.resetFields();
    setInfoPaymentId();
  };
  const onOpen = () => {
    setOpenCreatePaymentInfor(true);
  };

  const [form] = Form.useForm();

  const onEdit = (val) => {
    setInfoPaymentId(val._id);
    form.setFieldsValue(val);

    onOpen();
  };
  const onDelete = async (val) => {
    try {
      await deleteInfoPayment(val);
      toast.success("Xóa thông tin thanh toán thành công");
      await getPayments();
    } catch (error) {
      toast.error("Xóa thông tin thanh toán thất bại");
    }
  };

  const handleName = (e) => {
    const nameCoverted = toLowerCaseNonAccentVietnamese(e.target.value);
    form.setFieldValue("fullName", nameCoverted.toUpperCase());
  };

  const handleSubmit = async (value) => {
    try {
      if (infoPaymentId) {
        const res = await updateInfoPayment(infoPaymentId, value);
        if (res.status === 1) {
          toast.success("Cập nhật thông tin thanh toán thành công");
          setInfoPaymentId();
          getPayments(pageSize, pageIndex);
        } else {
          toast.error("Cập nhật thông tin thanh toán thất bại");
        }
      } else {
        const res = await createInfoPayment(value);
        if (res.status === 1) {
          setInfoPaymentList([...infoPaymentList, res.data]);
          toast.success("Thêm thông tin thanh toán thành công");
        } else {
          toast.error(res?.message || "Thêm thông tin thanh toán thất bại");
        }
      }
    } catch (error) {
      toast.error("Thêm/Cập nhật thông tin thanh toán thất bại");
    }
    onClose();
  };

  return (
    <div>
      <ProfileLayout>
        <div
          className={`d-flex flex-column justify-content-between align-items-center py-3 ${styles["container"]}`}
        >
          <div
            className="d-flex align-items-center p-3 w-100"
            style={{ flex: 1, borderBottom: "1px solid #efefef" }}
          >
            <div className={styles["payment-header"]}>Thông tin thanh toán</div>
            <Button onClick={onOpen} className="bg-success text-white">
              Thêm thông tin thanh toán mới
            </Button>
          </div>
          <div className="py-2 w-100">
            <Table
              rowKey="_id"
              dataSource={infoPaymentList}
              style={{ width: "100%" }}
              loading={loading}
              pagination={{
                total: totalPage,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSize: pageSize,
                current: pageIndex,
              }}
              onChange={(e) => handleOnChangeTable(e)}
            >
              <Column
                title="#"
                render={(val, rec, index) => {
                  return index + 1;
                }}
              />
              <Column title="Họ Và Tên" dataIndex="fullName" key="fullName" />
              <Column title="Số tài khoản" dataIndex="stk" key="stk" />
              <Column title="Ngân hàng" dataIndex="bank" key="bank" />
              <Column
                title="Thời gian tạo"
                dataIndex="createdAt"
                key="createdAt"
                render={(val) => moment(val).format("DD MM YYYY")}
              />
              <Column
                title="Hành động"
                key="action"
                render={(val, record) => (
                  <Space size="middle">
                    <Tooltip title="Cập nhật">
                      {/* <i
                        className="ri-pencil-line action-icon"

                        // 
                      ></i> */}
                      <CiEdit
                        size={24}
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => onEdit(val)}
                      />
                    </Tooltip>

                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa phương thức thanh toán này?"
                      onConfirm={() => {
                        onDelete(val._id);
                      }}
                      okText="Có"
                      cancelText="Không"
                    >
                      <AiOutlineDelete
                        size={24}
                        style={{ color: "red", cursor: "pointer" }}
                      />
                    </Popconfirm>
                  </Space>
                )}
              />
            </Table>
          </div>
        </div>
      </ProfileLayout>
      <Modal
        open={openCreatePaymentInfor}
        onCancel={onClose}
        title={
          infoPaymentId
            ? "Cập nhật thông tin  thanh toán"
            : "Thêm thông tin  thanh toán"
        }
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          // onFinishFailed={onFinishFailed}
          name="createPaymentInfor"
          autoComplete="off"
        >
          <Form.Item
            name="fullName"
            label="Họ và Tên"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ tên",
              },
            ]}
          >
            <Input
              placeholder="Họ và Tên"
              name="fullName"
              allowClear={true}
              onChange={(e) => handleName(e)}
            />
          </Form.Item>
          <Form.Item
            name="stk"
            label="Số tài khoản"
            rules={[
              {
                required: true,
                message: "Vui lòng số tài khoản",
              },
            ]}
          >
            <Input placeholder="Số tài khoản" name="stk" allowClear={true} />
          </Form.Item>
          <Form.Item
            name="bank"
            label="Tên ngân hàng"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn tên ngân hàng",
              },
            ]}
          >
            <Select
              options={bankName.map((bank) => {
                return {
                  label: `${bank.shortName} - ${bank.name}`,
                  value: bank.shortName,
                };
              })}
            />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit">
              {infoPaymentId ? "Cập nhật" : "Thêm"}
            </Button>

            <Button type="primary" htmlType="button" onClick={() => onClose()}>
              Hủy bỏ
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentManager;

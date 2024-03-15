import { Button, Form, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { exportPermission, listConstanst } from "../constants";
import { createPermission } from "../../../helpers/helper";
const { Option } = Select;
const ModalAddPermission = ({ role, permissionList, success }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [listAdd, setListAdd] = useState([]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleFinish = async (values) => {
    let data = listAdd.find((item) => (item.name = values.name));
    let res = await createPermission(data);
    if (res?.success) {
      toast.success("Thêm quyền hạn thành công!");
      success();
      handleCancel();
    } else {
      toast.error("Thêm quyền hạn không thành công!");
    }
  };

  const handleGetPermissionAdd = () => {
    let listAdd = [];
    Object.keys(listConstanst).map((item) => {
      if (!permissionList?.find((itemPer) => itemPer.name === item)) {
        let data = {
          role: role?._id,
          name: item,
          view: false,
          edit: false,
          del: false,
        };
        listAdd.push(data);
      }
    });
    setListAdd(listAdd);
  };
  useEffect(() => {
    setListAdd([]);
    form.resetFields();
    handleGetPermissionAdd();
  }, [role, permissionList]);
  return (
    <>
      <Button type="primary" style={{ marginTop: "10px" }} onClick={handleOpen}>
        Thêm
      </Button>
      <Modal
        title={`Thêm phân quyền cho ${role?.name}`}
        open={open}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          name="Add permission"
          form={form}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
        >
          <Form.Item label="Phân quyền" name="name">
            <Select>
              {listAdd?.map((item, index) => {
                return (
                  <Option
                    key={index}
                    value={item.name}
                    label={exportPermission(item.name)}
                  >
                    {exportPermission(item.name)}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalAddPermission;

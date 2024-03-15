import { Col, Row, Select, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Label } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";

import { FcCheckmark } from "react-icons/fc";
import { MdOutlineClose } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { exportPermission } from "./constants";
import ModalAddPermission from "./ModalAddPermission";
import EditPermission from "./EditPermission";
import { toast } from "react-toastify";
import {
  deletePermission,
  getAllRole,
  getPermissionByRole,
} from "../../helpers/helper";
const { Option } = Select;
const Permission = () => {
  const [roleList, setRoleList] = useState([]);
  const [role, setRole] = useState("");
  const [permission, setPermission] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGetRoleList = async () => {
    let res = await getAllRole();
    setRoleList(res?.role);
    setRole(res?.role?.[0]._id);
  };
  useEffect(() => {
    handleGetRoleList();
  }, []);

  const handleGetPermissionByRole = async () => {
    setLoading(true);
    let res = await getPermissionByRole(role);
    setPermission(res?.data);
    setLoading(false);
  };
  useEffect(() => {
    handleGetPermissionByRole();
  }, [role]);
  const handleDelete = async (value) => {
    let res = await deletePermission(value?._id);
    if (res.success) {
      toast.success("Xóa quyền hạn thành công!");
      handleGetPermissionByRole();
    } else {
      toast.error("Xóa quyền hạn không thành công");
    }
  };
  const onSuccess = () => {
    handleGetPermissionByRole();
  };
  const columns = [
    {
      title: "Tên phân quyền",
      dataIndex: "name",
      render: (value) => {
        return exportPermission(value);
      },
    },
    {
      title: "Xem",
      dataIndex: "view",
      render: (value) => {
        return (
          <>
            {value ? (
              <FcCheckmark />
            ) : (
              <MdOutlineClose style={{ color: "red" }} />
            )}
          </>
        );
      },
    },
    {
      title: "Thêm",
      dataIndex: "add",
      render: (value) => {
        return (
          <>
            {value ? (
              <FcCheckmark />
            ) : (
              <MdOutlineClose style={{ color: "red" }} />
            )}
          </>
        );
      },
    },
    {
      title: "Sửa",
      dataIndex: "edit",
      render: (value) => {
        return (
          <>
            {value ? (
              <FcCheckmark />
            ) : (
              <MdOutlineClose style={{ color: "red" }} />
            )}
          </>
        );
      },
    },
    {
      title: "Xóa",
      dataIndex: "del",
      render: (value) => {
        return (
          <>
            {value ? (
              <FcCheckmark />
            ) : (
              <MdOutlineClose style={{ color: "red" }} />
            )}
          </>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <>
            <Tooltip title="Sửa phân quyền" showArrow>
              <EditPermission permission={record} success={onSuccess} />
            </Tooltip>
            <AiFillDelete
              style={{ color: "red", cursor: "pointer", marginLeft: "10px" }}
              onClick={() => handleDelete(record)}
            />
          </>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb
          title="Quản lý quyền hạn"
          pageTitle="Permissions"
          slug="permissions"
        />

        <Row>
          <Col lg={3}>
            <Label> Phân quyền</Label>
            <Select
              defaultActiveFirstOption
              style={{ width: "100%" }}
              onChange={(e) => setRole(e)}
              value={role}
            >
              {roleList?.map((item) => {
                return (
                  <Option key={item?._id} label={item?.name} value={item?._id}>
                    {item?.name}
                  </Option>
                );
              })}
            </Select>
            <ModalAddPermission
              role={roleList?.find((item) => item._id === role)}
              permissionList={permission}
              success={onSuccess}
            />
          </Col>
        </Row>
        <Row
          style={{
            alignItems: "start",
            display: "flex",
            flexFlow: "column",
          }}
        >
          <Table
            loading={loading}
            style={{ width: "100%", marginTop: "10px" }}
            columns={columns}
            dataSource={permission}
            pagination={false}
          />
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Permission;

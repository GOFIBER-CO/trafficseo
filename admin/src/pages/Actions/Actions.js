import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import toast, { Toaster } from "react-hot-toast";
import LoadingBar from "react-top-loading-bar";
import { Space, Table, Modal, Select, Popconfirm } from "antd";
import { getAllRole, addNewRole, deleteRole } from "../../helpers/helper";
import { useEffect, useRef, useState } from "react";
import AddRole from "./AddRoles";
const { Column } = Table;
const Roles = () => {
  const refLoading = useRef();
  const [roles, setRoles] = useState([]);
  const [addRoleForm, setAddRoleForm] = useState({});
  const getRoles = () => {
    getAllRole().then((res) => {
      setRoles(res.docs);
    });
  };
  const openAddRoleForm = () => {
    setAddRoleForm({ ...addRoleForm, isOpen: true });
  };
  const closeAddRoleForm = () => {
    setAddRoleForm({ ...addRoleForm, isOpen: false });
  };
  const addRole = async (roleName) => {
    try {
      refLoading.current.continuousStart();
      const result = await addNewRole(roleName);
      setRoles([...roles, result.role]);
      toast.success("Add success");
    } catch (error) {
      console.log(error);
      toast.error("Add Failed");
      refLoading.current.complete();
    } finally {
      refLoading.current.complete();
    }
  };

  const deleteRoles = async (id) => {
    try {
      refLoading.current.continuousStart();
      const result = await deleteRole(id);
      if (result.message == "success") {
        toast.success("Delete success");
        setRoles(roles.filter((role) => role._id != id));
      } else {
        toast.error("Delete Failed");
      }
    } catch (error) {
      refLoading.current.complete();
      toast.error("Delete Failed");
      console.log(error);
    } finally {
      refLoading.current.complete();
    }
  };

  useEffect(() => {
    getRoles();
  }, []);
  return (
    <>
      <Toaster />
      <LoadingBar color="red" ref={refLoading} />
      <div style={{ padding: "94px 12px 60px" }} className="roles-page-wrapper">
        <div style={{ padding: "0 12px" }} className="roles-page">
          <BreadCrumb title="Quyền hạn" pageTitle="Quản lí quyền hạn" />
          <Row>
            <Col lg="12">
              <div className="text-right">
                <Button
                  onClick={() => {
                    openAddRoleForm();
                  }}
                >
                  Thêm mới
                </Button>
              </div>
            </Col>
          </Row>
          <div className="roles-page__table" style={{ marginTop: "20px" }}>
            <Table rowKey="_id" dataSource={roles}>
              <Column
                title="#"
                key="index"
                render={(val, rec, index) => {
                  return index + 1;
                }}
              />
              <Column
                title="Tên Quyền"
                dataIndex="roleName"
                key="roleName"
                render={(val) => {
                  return val ?? "---";
                }}
              />
              <Column
                title="Hoạt động"
                key="action"
                dataIndex="_id"
                render={(val, record) => (
                  <Space size="middle">
                    <Popconfirm
                      title="Are you sure to delete this user?"
                      onConfirm={() => deleteRoles(val)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <i className="ri-delete-bin-line action-icon"></i>
                    </Popconfirm>
                  </Space>
                )}
              />
            </Table>
          </div>
        </div>
        {addRoleForm.isOpen && (
          <AddRole addFunc={addRole} closeFunc={closeAddRoleForm} />
        )}
      </div>
    </>
  );
};

export default Roles;

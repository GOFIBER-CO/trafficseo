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
import { Space, Table, Modal, Select, Popconfirm, Pagination } from "antd";
import { getAllRole, addNewRole, deleteRole } from "../../helpers/helper";
import { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
const { Column } = Table;
const Roles = () => {
  const refLoading = useRef();
  const [roleName, setRoleName] = useState("");
  const [roles, setRoles] = useState([]);
  const [addRoleForm, setAddRoleForm] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalItem, settotalItem] = useState(1);

  const getRoles = () => {
    getAllRole(pageSize, pageIndex).then((data) => {
      setRoles(data?.role);
      settotalItem(data?.role?.length);
    });
  };
  const openAddRoleForm = () => {
    setAddRoleForm({ ...addRoleForm, isOpen: true });
  };
  const closeAddRoleForm = () => {
    setAddRoleForm({ ...addRoleForm, isOpen: false });
    setRoleName("");
  };
  const addRole = async (roleName) => {
    try {
      refLoading.current.continuousStart();

      await addNewRole(roleName);
      getRoles();
      toast.success("Add success");
      closeAddRoleForm();
    } catch (error) {
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
      getRoles();
      toast.success("Delete success");
    } catch (error) {
      refLoading.current.complete();
      toast.error("Delete Failed");
    } finally {
      refLoading.current.complete();
    }
  };

  useEffect(() => {
    getRoles();
  }, [pageSize, pageIndex]);
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
            <Table rowKey="_id" dataSource={roles} pagination={false}>
              <Column
                title="#"
                key="index"
                render={(val, rec, index) => {
                  return index + 1;
                }}
              />
              <Column
                title="Tên Quyền"
                dataIndex="name"
                key="name"
                // render={(val) => {
                //   return val ?? "---";
                // }}
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
                      <FaTrash size={18} color="red" cursor={"pointer"} />
                    </Popconfirm>
                  </Space>
                )}
              />
            </Table>
            <Pagination
              // showTotal={showTotal}
              style={{ marginTop: "30px" }}
              current={pageIndex}
              defaultCurrent={pageIndex}
              total={totalItem}
              pageSize={pageSize}
              showSizeChanger
              onChange={(page, pageSize) => {
                setPageIndex(page);
                setPageSize(pageSize);
              }}
            />
          </div>
        </div>
        {addRoleForm.isOpen && (
          <div className="add-role">
            <div className="add-role-wrapper">
              <h3>Thêm mới</h3>
              <Form>
                <Row>
                  <Col lg={12}>
                    <FormGroup>
                      <Label className="mb-1" for="role">
                        Tên
                      </Label>
                      <Input
                        id="role"
                        name="role"
                        placeholder="Role"
                        type="text"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={() => closeAddRoleForm()}
                    style={{ backgroundColor: "#b51b04", border: "none" }}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => addRole(roleName)}
                    style={{ marginLeft: "10px" }}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            </div>
          </div>
          // <AddRole addFunc={addRole} closeFunc={closeAddRoleForm} />
        )}
      </div>
    </>
  );
};

export default Roles;

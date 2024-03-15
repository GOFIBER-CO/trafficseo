import React, { useCallback, useEffect, useRef, useState } from "react";

//import Components
import BreadCrumb from "../../Components/Common/BreadCrumb";
import toast, { Toaster } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar'
import {v4} from 'uuid'

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

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { Badge, Checkbox, message, Space, Table, Modal, Select, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import {  editRolePermission, getAllPermissions, getAllRole, getAllUsers } from "../../helpers/helper";
const { Option } = Select;
const { Column } = Table;



const UsersPermission = () => {
  document.title = "Users Permission";
  const [permissions, setPermission] = useState([])
  const [roles, setRoles] = useState([])
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState(0);
  const [userFlag, setUserFlag] = useState(false);
  const [role, setRole] = useState("")
  const [thisRole, setThisRole] = useState({})
  const refLoading = useRef()

  const getUsers = () => {
    getAllUsers().then((res) => {
      setUsers(res);
    });
  }

  const getRoles = () =>{
    getAllRole().then(result =>{
      setRoles(result.roles)
    })
  }

  const getPermission = (                                                                                                                                             ) => {
    getAllPermissions().then(result => {
      result.permissions = [{_id: v4(), fieldName: 'Check all', name: 'Check All', type: 'checkall'},...result.permissions]
      setPermission(result.permissions)
    })
  }

  console.log(permissions)

  const handleChangeRole = (name) => {
    setRole(name)
    let roleCurrent = {}
    roles.map((_role) => {
      console.log(_role)
      if(_role.name == name){
        roleCurrent = _role
        console.log(_role.name, name)
      }
    })
    setThisRole(roleCurrent)
    console.log(roleCurrent)
  }
  console.log(thisRole)

  const handleChangeCheckBox = (fieldName, option, checked) =>{
      if(!thisRole.permission.find(element => element.fieldName == fieldName)){
        const newThisRole = {}
        newThisRole.fieldName = fieldName
        if(option == 'add'){
          newThisRole.add = checked
        }else if(option == 'edit'){
          newThisRole.edit = checked
        }else if(option == 'delete'){
          newThisRole.delete = checked
        }
        setThisRole({...thisRole, permission: [...thisRole.permission, newThisRole]})
      }else{
        const newThisRole = thisRole.permission.map((item) => {
          if(item.fieldName == fieldName){
            if(option == 'add'){
              item.add = checked
            }else if(option == 'edit'){
              item.edit = checked
            }else if(option == 'delete'){
              item.delete = checked
            }
          }
          return item
        })
        setThisRole({...thisRole, permission: newThisRole})
      }
  }

  const handleChangeCheckAll = (option, checked) =>{
    if(checked){
      setThisRole({...thisRole,permission: thisRole.permission.map((item) => {
        if(option == 'add'){
          item.add = checked
        }else if(option == 'edit'){
          item.edit = checked
        }else if(option == 'delete'){
          item.delete = checked
        }
        return item
       })})
    }else{
      setThisRole({...thisRole,permission: thisRole.permission.map((item) => {
        if(option == 'add'){
          item.add = checked
        }else if(option == 'edit'){
          item.edit = checked
        }else if(option == 'delete'){
          item.delete = checked
        }
        return item
       })})
    }
  }
  console.log(thisRole)

  const handleSaveButton = async () => {
    try {
      refLoading.current.continuousStart()
      const result = await editRolePermission(thisRole.permission, thisRole._id) 
      if(result.message == 'success'){
        const newRoles = roles.map((_role) => {
          if(_role._id == thisRole._id){
            _role.permission = thisRole.permission
          }
          return _role
        })
        setRoles(newRoles)
        toast.success("Save success")
      }
    } catch (error) {
      console.log(error)
      toast.error("Save failed")
      refLoading.current.complete()
    } finally {
      refLoading.current.complete()
    }
  }
  console.log(roles)

  useEffect(() => {
    if (!userFlag)
    getRoles();
    getUsers();
    getPermission();
    setUserFlag(true);
    setStatus(0);
  }, [status, userFlag]);

  if (!users || users.length === 0)
    return null;

  let flagCheckAllAdd = true
  let flagCheckAllEdit = true
  let flagCheckAllDelete = true

  thisRole?.permission?.map(item => {
    thisRole.permission.map(item => {
      if(!item.add){
        flagCheckAllAdd = false
      }
      if(!item.edit){
        flagCheckAllEdit = false
      }
      if(!item.delete){
        flagCheckAllDelete = false
      }
    })
  })

  return (
    <React.Fragment>
      <Toaster/>
      <LoadingBar color = "red" ref={refLoading}/>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Users" pageTitle="Users Permission" />
            <Form>
              <Row className="mb-3">
                <Col lg="6">
                  <div>
                      <Row>
                        <Col lg={6}>
                          <FormGroup>
                            <Label className="mb-1" for="username">
                              Quyền 
                            </Label>
                            <Select
                              size="large"
                              name="username"
                              id="username"
                              placeholder="Chọn Quyền"
                              style={{ width: "100%" }}
                              onChange={handleChangeRole}
                            >
                              {
                                roles.map(_role => {return <Option key={_role.name} value={_role.name}>{_role.name}</Option>})
                              }
                            </Select>
                          </FormGroup>
                        </Col>
                      </Row>
                  </div>
                </Col>

                <Col lg="6">
                  <div className="text-right">
                    {thisRole.name && <Button onClick = {()=>handleSaveButton()}>Save</Button>}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  {thisRole.name &&
                  <Table 
                    rowKey='id' 
                    dataSource={permissions}
                    pagination={{pageSize: 20}}
                  >
                    <Column
                      title=""
                      render={(val, rec, index) => {
                        return val.name;
                      }}
                    />
                    <Column
                      title="Thêm"
                      render={(val, record) => {
                        let flag = false;
                        thisRole?.permission?.map((_permission) => {
                          if(_permission.fieldName == val.fieldName && _permission.add){
                            flag = true
                          }
                        })
                        console.log(val.type)
                        return(
                          <Checkbox onChange={!val.type ? (e)=>handleChangeCheckBox(val.fieldName, 'add', e.target.checked): (e)=>handleChangeCheckAll('add', e.target.checked)} name={val.name} key={val.id} checked = {val.type ? flagCheckAllAdd : flag}/>
                        )
                      }}
                    />
                    <Column
                      title="Sửa"
                      render={(val, record) => {
                        let flag = false;
                        thisRole?.permission?.map((_permission) => {
                          if(_permission.fieldName == val.fieldName && _permission.edit){
                            flag = true
                          }
                        })
                        return (
                          <Checkbox onChange={!val.type ? (e)=>handleChangeCheckBox(val.fieldName, 'edit', e.target.checked) : (e)=>handleChangeCheckAll('edit', e.target.checked)} name={val.name} key={val.id} checked = {flagCheckAllEdit}/>
                        )
                      }}
                    />
                    <Column
                      title="Xoá"
                      render={(val, record) => {
                        let flag = false;
                        thisRole?.permission?.map((_permission) => {
                          if(_permission.fieldName == val.fieldName && _permission.delete){
                            flag = true
                          }
                        })
                        return (
                          <Checkbox onChange={!val.type ? (e)=>handleChangeCheckBox(val.fieldName, 'delete', e.target.checked): (e)=>handleChangeCheckAll('delete', e.target.checked)} name={val.name} key={val.id} checked = {flagCheckAllDelete}/>
                        )
                      }}
                    />               
                  </Table>}
                </Col>
              </Row>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UsersPermission;

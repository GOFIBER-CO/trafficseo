import { React, useState, useEffect } from "react";
import "../../App.css";
import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import { Space, Table, Popconfirm, Tooltip, message, Pagination } from "antd";
import { Drawer } from "antd";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Form } from "antd";
import { deleteDomains, insertDomains } from "../../helpers/helper";
import { getpagingDomains, updateDomains } from "./../../helpers/helper";
const { Column } = Table;

function Domains() {
  const [visibleForm, setVisibleForm] = useState(false);
  const [form] = Form.useForm();
  const [drawerTitle, setDrawerTitle] = useState("");
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalItem, settotalItem] = useState(1);
  const [dataEdit, setDataEdit] = useState("");
  const [id, setId] = useState("");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState([]);
  // console.log(data, "data");

  const onClose = () => {
    setDataEdit("");
    setId("");
    form.resetFields();
    setVisibleForm(false);
  };

  const onFinish = async (data) => {
    const dataDomains = {
      domains: data.host,
    };
    // console.log(dataDomains);

    if (!data._id) {
      const dataDomain = await insertDomains(dataDomains);

      dataDomain.__v === 0
        ? message.success(`Save Success! `)
        : message.error(`Save Failed!`);

      getDataDomains();
      // eslint-disable-next-line no-unused-expressions

      if (!dataDomain.__v) {
        onClose();
      }
    } else {
      //update
      const updateData = await updateDomains(data._id, dataDomains);
      updateData.__v === 0
        ? message.success(`Update Success! ${updateData.message}`)
        : message.error(`Update Failed! ${updateData.message}`);
      getDataDomains();
      if (updateData.__v === 1) {
        onClose();
      }
      // console.log(data,'data');
    }
  };

  const handleRefreshCreate = async () => {
    form.resetFields();
  };

  const getDataDomains = async () => {
    getpagingDomains(pageSize, pageIndex, filter).then((data) => {
      setData(data.data);
      setError(data.data);
      setPageSize(data.pageSize);
      setTotalPage(data.totalPages);
      settotalItem(data.totalItem);
    });
  };
  useEffect(() => {
    getDataDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex]);

  function onFinishFailed() {
    // message.error("Save failed!");
  }

  const showDrawer = () => {
    setVisibleForm(true);
  };

  const onEdit = (key) => {
    const dataEdit = data.filter((item) => item._id === key);
    // console.log(dataEdit,'edit');
    setDataEdit(dataEdit[0].host);
    setId(dataEdit[0]._id);
    form.setFieldsValue({
      host: dataEdit[0].host,
      _id: dataEdit[0]._id,
    });
    showDrawer();
    setDrawerTitle("Chỉnh sửa Domains");
  };

  const onSearch = () => {
    getDataDomains();
  };
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="DOMAIN" pageTitle="Quản lí Domain" />
          <Row className="mb-3">
            <Drawer
              title={drawerTitle}
              placement={"right"}
              width={"30%"}
              onClose={onClose}
              visible={visibleForm}
              bodyStyle={{
                paddingBottom: 80,
              }}
              style={{ marginTop: "70px" }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Row>
                  <Col sm={4} hidden={true}>
                    <Form.Item name="_id" label="Id">
                      <Input name="_id" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="host"
                      label="Domains"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập Domains!",
                        },
                        {
                          type: "Doamins",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Domains"
                        name="host"
                        allowClear={true}
                        onChange={(e) =>
                          form.setFieldsValue({
                            host: e.target.value,
                          })
                        }
                        value={dataEdit}
                        defaultValue={dataEdit}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                    {!id && (
                      <Button
                        type="primary"
                        htmlType="button"
                        onClick={() => handleRefreshCreate()}
                      >
                        Refresh
                      </Button>
                    )}
                  </Space>
                </Form.Item>
              </Form>
            </Drawer>
            <Col lg="5">
              <div>
                <InputGroup>
                  <Input
                    // value={searchText}
                    onChange={(e) => {
                      setFilter(e.target.value);
                    }}
                    placeholder="Tìm kiếm..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setFilter(e.target.value);
                        getDataDomains();
                      }
                    }}
                  />
                  <InputGroupText
                    style={{ cursor: "pointer" }}
                    onClick={onSearch}
                  >
                    <i className="ri-search-line"></i>
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>

            <Col lg="7">
              <div className="text-right">
                <Button
                  onClick={() => {
                    setDrawerTitle("Thêm Domains Mới");
                    showDrawer();
                    // console.log(visibleForm);
                    form.resetFields();
                  }}
                >
                  Thêm mới
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Table
                rowKey="_id"
                dataSource={data}
                pagination={false}
                // style={{height:'400px'}}
              >
                {/* <Column
                  title="#"
                  render={(val, rec, index) => {
                    return index + 1;
                  }}
                /> */}

                <Column title="Domain" dataIndex="host" key="host" />
                <Column
                  title="Action"
                  key="action"
                  render={(val, record) => (
                    <Space size="middle">
                      <Tooltip title="Edit">
                        <i
                          className="ri-pencil-line action-icon"
                          style={{ color: "blue" }}
                          onClick={() => onEdit(val._id)}
                        ></i>
                      </Tooltip>

                      <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => {
                          deleteDomains(val._id).then(() => {
                            getDataDomains();
                          });
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <i className="ri-delete-bin-line action-icon"></i>
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
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
export default Domains;

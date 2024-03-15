import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import ValidateIPaddress from "../../common/validIp";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import {
  Space,
  Table,
  Select,
  Popconfirm,
  message,
  Pagination,
  Modal,
  Upload,
} from "antd";

import "../../App.css";
import {
  addWhitelist,
  getWhitelist,
  editWhitelist,
  removeWhitelist,
} from "../../helpers/helper";
import { AiFillFileExcel } from "react-icons/ai";
import { Drawer } from "antd";
// import { Form } from "reactstrap";
import { Form } from "antd";
import { Tooltip } from "antd";
import { update } from "lodash";
const { Dragger } = Upload;

const { Column } = Table;
function Whitelist() {
  const [whitelist, setWhitelist] = useState([]);
  const [id, setId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [form] = Form.useForm();
  const [visibleForm, setVisibleForm] = useState(false);
  const [modalExcel, setModalExcel] = useState(false);
  const getPagingWhitelist = () => {
    let dataReq = {
      pageSize: pageSize || 10,
      pageIndex: pageIndex || 1,
      search: searchText || "",
    };

    getWhitelist(dataReq).then((res) => {
      setWhitelist(res.data);
      setTotalPage(res.total);
    });
  };
  useEffect(() => {
    getPagingWhitelist(10, 1);
    setPageIndex(1);
  }, []);
  useEffect(() => {
    getPagingWhitelist();
  }, [pageSize, pageIndex]);
  const onClose = () => {
    setVisibleForm(false);
  };
  const onFinish = async (data) => {
    if (ValidateIPaddress(data.ip)) {
      const dataReq = {
        ip: data.ip,
        note: data.note,
      };
      if (!data.id) {
        //Save
        const dataRes = await addWhitelist(dataReq);
        dataRes.status === 1
          ? message.success(` ${dataRes.message}`)
          : message.error(`Save Failed! ${dataRes.message}`);
        if (dataRes.status === 1) {
          onClose();
        }
      } else {
        //Update
        console.log(`co id`);
        const dataRes = await editWhitelist(data.id, dataReq);
        console.log("dataRes: ", dataRes);
        dataRes.status === 1
          ? message.success(`Update Success!`)
          : message.error(`Update Failed!`);
        if (dataRes.status === 1) {
          onClose();
        }
      }
      setSearchText("");
      form.resetFields();
      getPagingWhitelist();
    } else {
      message.error("Nhập đúng định dạng IP!");
    }
  };
  const handleRefreshCreate = async () => {
    form.resetFields();
  };
  const onEdit = (key) => {
    const dataEdit = whitelist.filter((item) => item._id === key);
    form.setFieldsValue({
      ip: dataEdit[0].ip,
      note: dataEdit[0].note,
      id: dataEdit[0]._id,
    });
    showDrawer();
    setDrawerTitle("Chỉnh Sửa Whitelist");
  };
  const onDelete = async (key) => {
    const result = await removeWhitelist(key);
    result?.isSuccessed === true
      ? message.success(`${result.message}`)
      : message.error(`${result.message}`);
    getPagingWhitelist();
  };
  const showDrawer = () => {
    setVisibleForm(true);
  };
  const onInputChange = (e) => {
    setSearchText(e.target.value);

    console.log("searchText: ", searchText);
    // let dataReq = {
    //   pageSize: pageSize,
    //   pageIndex: pageIndex,
    //   search: e.target.value || "",
    // };
  };
  const onSearch = () => {
    if (!searchText) {
      getPagingWhitelist();
    }
    getPagingWhitelist();
  };
  const onFinishFailed = () => {
    // message.error("Save failed!");
  };
  const handleOnChangeTable = ({ current, pageSize, total }) => {
    setPageIndex(current);
    setPageSize(pageSize);
    getPagingWhitelist();
  };

  const exportExcel = async () => {
    const dataReq = {
      pageSize: 10000,
      pageIndex: 1,
      search: "",
    };
    const listWhitelist = await getWhitelist(dataReq);
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const whitelistExcel = listWhitelist?.data?.map((ip, index) => {
      return {
        STT: index + 1,
        "Địa chỉ IP": ip.ip,
        "Ghi chú": ip.note,
      };
    });
    const ws = XLSX.utils.json_to_sheet(whitelistExcel);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "whitelist" + fileExtension);
  };

  const [file, setFile] = useState({});

  const handleDownloadExcelExample = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = "example.xlsx";
    const customData = [];
    customData.push({ "Địa chỉ IP": "", "Ghi chú": "" });
    const ws = XLSX.utils.json_to_sheet(customData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileExtension);
  };
  const importExcelt = (e) => {
    setFile({});
    setModalExcel(true);
  };
  const props = {
    name: "file",
    accept: ".xlsx",
    multiple: false,
    customRequest(e) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile({
          uid: new Date().getMilliseconds(),
          name: e.file.name,
          status: "done",
          url: reader.result,
          file: e.file,
        });
      };
      if (e.file) {
        reader.readAsDataURL(e.file);
        readExcel(e.file);
      }
      setTimeout(() => {
        e.onSuccess("ok");
      }, 0);
    },
    onDrop(e) {},
  };

  const readExcel = async (file) => {
    const fileReader = await new FileReader();
    fileReader.readAsArrayBuffer(file);
    let data;
    fileReader.onload = (e) => {
      const bufferArray = e?.target.result;
      const wb = XLSX.read(bufferArray, { type: "buffer" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      data = XLSX.utils.sheet_to_json(ws);
      const fileName = file.name.split(".")[0];
    };
    fileReader.onloadend = async (e) => {
      await handleImportFile(data).then(() => {
        getPagingWhitelist();
      });
    };
  };
  const handleImportFile = async (data) => {
    const dataReq = {
      pageSize: 10000,
      pageIndex: 1,
      search: "",
    };
    const oldData = await getWhitelist(dataReq);
    data &&
      data.map((item) => {
        const check = oldData?.data?.filter((x) => x.ip === item["Địa chỉ IP"]);
        if (check.length === 0) {
          const newIp = {
            ip: item["Địa chỉ IP"],
            note: item["Ghi chú"],
          };
          addWhitelist(newIp);
        } else {
          if (check[0]?.note !== item.note) {
            const updatedIp = {
              ip: item["Địa chỉ IP"],
              note: item["Ghi chú"],
            };
            console.log(updatedIp, "asdasdasd");
            const id = oldData?.data?.filter((ip) => ip?.ip === updatedIp.ip);
            console.log(id, "asssss");
            editWhitelist(id[0]._id, updatedIp);
          }
        }
      });
  };

  const closeExcelModal = () => {
    setModalExcel(false);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Whitelist" pageTitle="Quản lý Whitelist" />
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
                    <Form.Item name="id" label="Id">
                      <Input name="id" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="ip"
                      label="Địa chỉ IP"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập địa chỉ!",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Địa chỉ IP"
                        name="ip"
                        allowClear={true}
                        onChange={(e) =>
                          form.setFieldsValue({
                            ip: e.target.value,
                          })
                        }
                      />
                    </Form.Item>

                    <Form.Item name="note" label="Ghi chú">
                      <Input placeholder="Ghi chú!" name="note" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>

                    <Button
                      type="primary"
                      htmlType="button"
                      onClick={() => handleRefreshCreate()}
                    >
                      Refresh
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Drawer>
            <Col lg="5">
              <div>
                <InputGroup style={{ marginBottom: "1rem" }}>
                  <Input
                    value={searchText}
                    onChange={(e) => {
                      onInputChange(e);
                    }}
                    placeholder="Tìm kiếm..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        console.log(e.target.value);
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
            <Col style={{ width: "130px" }} lg="2">
              <div>
                <Button
                  style={{ backgroundColor: "rgb(243 149 51)", border: "none" }}
                  onClick={() => importExcelt()}
                >
                  Nhập excel
                </Button>
              </div>
            </Col>
            <Col style={{ width: "130px" }} lg="2">
              <div>
                <Button
                  style={{ backgroundColor: "#026e39", border: "none" }}
                  onClick={() => exportExcel()}
                >
                  Xuất excel
                </Button>
              </div>
            </Col>

            <Col lg="3">
              <div className="text-right">
                <Button
                  onClick={() => {
                    setDrawerTitle("Thêm whitelist");
                    showDrawer();
                    console.log(visibleForm);
                    form.resetFields();
                  }}
                >
                  Thêm whitelist
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Table
                rowKey="_id"
                dataSource={whitelist}
                pagination={false}
                onChange={(e) => handleOnChangeTable(e)}
              >
                <Column
                  title="#"
                  render={(val, rec, index) => {
                    return index + 1;
                  }}
                />
                <Column title="Địa chỉ IP" dataIndex="ip" key="ip" />
                <Column title="Ghi chú" dataIndex="note" key="note" />
                <Column
                  title="Hoạt động"
                  key="action"
                  render={(val, record) => (
                    <>
                      <Space size="middle">
                        <Tooltip title="Edit">
                          <i
                            className="ri-pencil-line action-icon"
                            style={{ color: "blue" }}
                            onClick={() => onEdit(val._id)}
                          ></i>
                        </Tooltip>

                        <Popconfirm
                          title="Bạn có chắc muốn xóa ip này?"
                          onConfirm={() => onDelete(val._id)}
                          okText="Xóa"
                          cancelText="Hủy bỏ"
                        >
                          <i className="ri-delete-bin-line action-icon"></i>
                        </Popconfirm>
                      </Space>
                    </>
                  )}
                />
              </Table>
            </Col>
            <Col style={{ marginTop: "1rem" }}>
              <Pagination
                defaultCurrent={1}
                total={totalPage}
                pageSize={pageSize}
                onChange={(page, pageSize) => {
                  setPageSize(pageSize);
                  setPageIndex(page);
                }}
                showSizeChanger
              />
            </Col>
          </Row>

          <Modal
            open={modalExcel}
            onOk={closeExcelModal}
            onCancel={closeExcelModal}
            footer={
              <>
                <Button onClick={closeExcelModal}>Cancel</Button>
                <Button type="primary" onClick={closeExcelModal}>
                  Hoàn thành
                </Button>
              </>
            }
          >
            <Button
              style={{ background: "green", color: "white" }}
              onClick={handleDownloadExcelExample}
            >
              Download file mẫu
            </Button>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <AiFillFileExcel />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other band files
              </p>
            </Dragger>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default Whitelist;

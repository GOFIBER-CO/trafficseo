import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Input,
  InputGroup,
  Form,
  FormGroup,
  Label,
  Button,
  InputGroupText,
} from "reactstrap";
import { Popconfirm, Space, Tooltip } from "antd";
import "../../App.css";
import { deleteFP, searchFP } from "../../helpers/helper";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Table } from "antd";

const { Column } = Table;

function FPList() {
  const [FPs, setFPs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const getFPs = (size, index, search = "") => {
    searchFP(size, index, search).then((res) => {
      setFPs(res.fps);
      setTotalPage(res.totalPages);
    });
  };

  useEffect(() => {
    getFPs(10, 1);
    setPageIndex(1);
  }, []);

  const handleOnChangeTable = ({ current, pageSize }) => {
    setPageIndex(current);
    setPageSize(pageSize);
    getFPs(pageSize, current, searchText);
  };

  const onInputChange = (e) => {
    setSearchText(e.target.value);
    getFPs(10, 1, e.target.value);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="FP" pageTitle="Quản lý FP" />
          <Row className="mb-3">
            <Col lg="5">
              <div>
                <InputGroup>
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
                  <InputGroupText>
                    <i className="ri-search-line"></i>
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>

            <Col lg="7">
              <div className="text-right">
                <Button
                  onClick={() => {
                    // setDrawerTitle("Thêm danh mục mới");
                    // showDrawer();
                    // form.resetFields();
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
                dataSource={FPs}
                pagination={{
                  total: totalPage,
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
                <Column
                  title="Visitor ID"
                  dataIndex="visitorId"
                  key="visitorId"
                />
                <Column title="IP" dataIndex="ip" key="ip" />
                <Column title="Domain" dataIndex="origin" key="origin" />
                <Column
                  title="Browser"
                  dataIndex="browserName"
                  key="browserName"
                />
                <Column
                  title="Location"
                  dataIndex="ipLocation"
                  key="ipLocation"
                  render={({ city, country }) => (
                    <>
                      {city?.name}, {country?.name}
                    </>
                  )}
                />
                <Column
                  title="Action"
                  key="action"
                  render={(val, record) => (
                    <Space size="middle">
                      {/* <Tooltip title="View">
                        <i
                          className="ri-eye-line action-icon"
                          style={{ color: "blue" }}
                          onClick={() => onEdit(val._id)}
                        ></i>
                      </Tooltip> */}

                      {/* <Tooltip title="Edit">
                        <i
                          className="ri-pencil-line action-icon"
                          style={{ color: "blue" }}
                          //   onClick={() => onEdit(val._id)}
                        ></i>
                      </Tooltip> */}

                      <Popconfirm
                        title="Are you sure to delete this fp?"
                        onConfirm={() => {
                          deleteFP(val._id).then(() => {
                            getFPs(pageSize, pageIndex, searchText);
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
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default FPList;

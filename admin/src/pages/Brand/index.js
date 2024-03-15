import { Pagination, Popconfirm, Select, Space, Spin, Table } from "antd";
import React, { useEffect } from "react";
import { Button, Col, Container, Input, InputGroup, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useState } from "react";
import { deleteBrand, getPagingBrand } from "../../helpers/helper";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import ModalAddBrand from "./ModalAddBrand";
import ModalEditBrand from "./ModalEditBrand";
import { toast } from "react-toastify";

const { Column } = Table;
export default function BrandManagement() {
  const [searchInput, setSearchInput] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [data, setData] = useState([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const getData = async () => {
    const brands = await getPagingBrand(searchInput, pageSize, pageIndex, sort);
    const { data, totalDocs } = brands;
    setData(data);
    setTotalDocs(totalDocs);
  };
  const deleteBrandById = async (val) => {
    try {
      await deleteBrand(val?._id);
      getData();
      return toast.success("Xóa brand thành công!");
    } catch (error) {
      return toast.error("Xóa brand lỗi!");
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <React.Fragment>
      <Spin spinning={false}>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb title="Danh sách hậu đài" pageTitle="Quản lý hậu đài" />
            <Row className="mb-3">
              <Col className="mt-2" lg="2">
                <div>
                  <label>Tên brand</label>
                  <InputGroup>
                    <Input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Tìm kiếm..."
                    />
                  </InputGroup>
                </div>
              </Col>

              <Col className="mt-2" lg="2">
                <div>
                  <label>Sắp xếp theo</label>
                  <Select
                    placeholder="Sắp xếp theo"
                    onChange={(value) => setSort(value)}
                    defaultValue={sort}
                    options={[
                      {
                        label: "Thời gian",
                        value: "createdAt",
                      },
                      {
                        label: "Tên",
                        value: "name",
                      },
                    ]}
                    style={{ width: "100%" }}
                  />
                </div>
              </Col>

              <Col className="mt-2 d-flex gap-3" lg="12">
                <div>
                  <Button onClick={() => getData()}>Tìm kiếm</Button>
                </div>

                <ModalAddBrand getData={getData} />
                {/* <Button
                  style={{ backgroundColor: "#018749", border: "none" }}
                  // onClick={() => exportExcel()}
                >
                  Xuất excel
                </Button> */}
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Table dataSource={data} pagination={false}>
                  <Column title="Tên brand" dataIndex="name" key="name" />

                  <Column
                    title="Thời gian tạo"
                    dataIndex="createdAt"
                    key="createdAt"
                    render={(_) => moment(_).format("HH:mm DD-MM-YYYY")}
                  />

                  <Column
                    title="Hoạt động"
                    key="action"
                    render={(val, record) => (
                      <Space size="middle">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                          }}
                        >
                          <ModalEditBrand record={record} getData={getData} />
                          <Popconfirm
                            title="Bạn có chắc muốn xóa brand?"
                            onConfirm={() => deleteBrandById(val)}
                            // onCancel={cancel}
                            okText="Đồng ý"
                            cancelText="Không"
                          >
                            <DeleteOutlined
                              style={{ color: "red", fontSize: "20px" }}
                            />
                          </Popconfirm>
                        </div>
                      </Space>
                    )}
                  />
                </Table>
                <Pagination
                  style={{ float: "right", marginTop: "10px" }}
                  total={totalDocs}
                  showTotal={(total) => `Total ${total} items`}
                  showSizeChanger
                  defaultPageSize={pageSize}
                  current={pageIndex}
                  onChange={(page, pageSize) => {
                    setPageIndex(page);
                    setPageSize(pageSize);
                  }}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </Spin>
    </React.Fragment>
  );
}

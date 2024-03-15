import {
  notification,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Input, InputGroup, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  deleteRecruit,
  getAllDomains,
  getAllRecruits,
} from "../../helpers/helper";

const { Option } = Select;

const { Column } = Table;

function RecruitList() {
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [domains, setDomains] = useState([]);
  const [recruits, setRecruits] = useState([]);

  const [domainId, setDomainId] = useState("");
  const [status, setStatus] = useState();

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPageSize, setTotalPageSize] = useState(0);

  const getDomains = async () => {
    try {
      const result = await getAllDomains();
      const { data } = result;
      //   console.log("data", data);
      setDomains(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecruits = async (
    pageSize,
    pageIndex,
    searchInput,
    domain,
    status
  ) => {
    try {
      setIsLoading(true);
      const result = await getAllRecruits(
        pageSize,
        pageIndex,
        searchInput,
        domain,
        status
      );
      if (result) {
        setRecruits(result?.data || []);
        setTotalPageSize(result?.count || 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDomains();
  }, []);

  useEffect(() => {
    getRecruits(pageSize, pageIndex, searchInput, domainId, status);
  }, [pageSize, pageIndex]);

  const confirm = (recruit) => {
    deleteRecruit(recruit._id)
      .then((res) => {
        notification["success"]({
          message: "Notification",
          description: "Delete recruit successfully!",
        });
        getRecruits(pageSize, pageIndex, searchInput);
      })
      .catch((error) => {
        notification["error"]({
          message: "System error",
          description: error,
        });
      });
  };

  const searchRecruit = () => {
    getRecruits(pageSize, pageIndex, searchInput, domainId, status);
  };

  return (
    <React.Fragment>
      <Spin spinning={isLoading}>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb title="Tuyển dụng" pageTitle="Quản lý bài viết" />
            <Row className="mb-3">
              <Col lg="2">
                <div>
                  <InputGroup>
                    <Input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Tìm kiếm..."
                    />
                  </InputGroup>
                </div>
              </Col>
              <Col lg="2">
                <div>
                  <Select
                    allowClear={true}
                    style={{ width: "100%" }}
                    placeholder="Domain"
                    onChange={(e) => setDomainId(e)}
                  >
                    {domains &&
                      domains?.map((item) => (
                        <Option label={item.host} key={item._id}>
                          {item?.host}{" "}
                        </Option>
                      ))}
                  </Select>
                </div>
              </Col>
              <Col lg="2">
                <div>
                  <Select
                    allowClear={true}
                    style={{ width: "100%" }}
                    onChange={(value) => setStatus(value)}
                    placeholder="Trạng thái"
                  >
                    <Option label="Đã đăng" key={1}>
                      Đã đăng
                    </Option>
                    <Option label="Nháp" key={-1}>
                      Nháp
                    </Option>
                    <Option label="Chờ xét duyệt" key={0}>
                      Chờ xét duyệt
                    </Option>
                  </Select>
                </div>
              </Col>
              <Col lg="6">
                <Row>
                  <Col style={{ width: "130px" }} lg="6">
                    <div>
                      <Button onClick={() => searchRecruit()}>Tìm kiếm</Button>
                    </div>
                  </Col>
                  <Col style={{ width: "130px" }} lg="6">
                    <div className="">
                      <Link to="/recruits/create">
                        <Button>Thêm mới</Button>
                      </Link>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <Table rowKey="_id" dataSource={recruits} pagination={false}>
                  <Column
                    title="#"
                    render={(val, rec, index) => {
                      return index + 1;
                    }}
                  />
                  <Column title="Tiêu đề" dataIndex="title" key="title" />
                  <Column
                    title="Domain"
                    dataIndex="domain"
                    key="domain"
                    render={(item) => {
                      return <>{item?.host}</>;
                    }}
                  />

                  <Column
                    title="Lương"
                    dataIndex=""
                    key="salary"
                    render={(item) => {
                      return (
                        <>
                          {item?.fromSalary} - {item?.toSalary}
                        </>
                      );
                    }}
                  />

                  <Column
                    title="Hạn tuyển dụng"
                    dataIndex="expireDate"
                    key="expireDate"
                    render={(item) => {
                      return <>{moment(new Date(item)).format("DD/MM/YYYY")}</>;
                    }}
                  />

                  <Column
                    title="Trạng thái"
                    dataIndex="status"
                    key="status"
                    render={(item) => {
                      let rs = "";
                      if (item === -1) {
                        rs = "Chờ xét duyệt";
                      }
                      if (item === 1) {
                        rs = "Đã đăng";
                      }
                      if (item === 0) {
                        rs = "Nháp";
                      }
                      return <>{rs}</>;
                    }}
                  />
                  <Column
                    title="Hình ảnh"
                    dataIndex="thumb"
                    key="thumb"
                    render={(image) => (
                      <img
                        src={image}
                        alt="recruit_image"
                        style={{ width: "50%" }}
                      />
                    )}
                  />
                  <Column
                    title="Hoạt động"
                    key="action"
                    render={(val, record) => (
                      <Space size="middle">
                        <Link
                          to={{
                            pathname: "/recruits/edit/" + val.slug,
                            state: { id: val._id, domain: val?.domain?._id },
                          }}
                        >
                          <i className="ri-pencil-line action-icon"></i>
                        </Link>
                        <Popconfirm
                          title="Are you sure to delete this recruit?"
                          onConfirm={() => confirm(val)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <i className="ri-delete-bin-line action-icon"></i>
                        </Popconfirm>
                      </Space>
                    )}
                  />
                </Table>
                <div className="text-right">
                  <Pagination
                    className="mt-4"
                    pageSize={pageSize}
                    onChange={(page, pageSize) => {
                      setPageIndex(page !== 0 ? page : 1);
                      setPageSize(pageSize);
                    }}
                    showTotal={(total) => `Tổng ${total} bài viết`}
                    total={totalPageSize}
                    showSizeChanger
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Spin>
    </React.Fragment>
  );
}

export default RecruitList;

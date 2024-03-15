import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Dropdown,
  DropdownToggle,
} from "reactstrap";

import { getPayments } from "../../helpers/helper";
import moment from "moment";
const STATUS = {
  pending: "Chưa thanh toán",
  completed: "Đã thanh toán",
  rejected: "Từ chối thanh toán",
};
const TopPages = () => {
  const [isTopPageDropdown, setTopPageDropdown] = useState(false);
  const [data, setData] = useState([]);
  const toggleDropdown = () => {
    setTopPageDropdown(!isTopPageDropdown);
  };

  const getData = async () => {
    const data = await getPayments("", 10, 1);

    // setTotalDocs(data?.totalDocs);
    setData(data?.data);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <React.Fragment>
      <Col xl={12} md={12}>
        <Card className="card-height-100">
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">
              Danh sách thông báo rút tiền
            </h4>
            <div className="flex-shrink-0">
              <Dropdown
                isOpen={isTopPageDropdown}
                toggle={toggleDropdown}
                className="card-header-dropdown"
              >
                <DropdownToggle
                  tag="a"
                  className="text-reset dropdown-btn"
                  role="button"
                >
                  <span className="text-muted fs-16">
                    <Link to="/requirePayment">Xem tất cả</Link>
                  </span>
                </DropdownToggle>
              </Dropdown>
            </div>
          </CardHeader>
          <CardBody>
            <div className="table-responsive table-card">
              <table className="table align-middle table-borderless table-centered table-nowrap mb-0">
                <thead className="text-muted table-light">
                  <tr>
                    <th scope="col" style={{ width: "62" }}>
                      Nội dung
                    </th>
                    <th scope="col">Thời gian</th>
                    <th scope="col">Người dùng</th>
                    <th scope="col">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {(data || []).map((item, index) => (
                    <tr key={index}>
                      <td>
                        Người dùng{" "}
                        <span style={{ fontWeight: 500 }}>
                          {item?.user?.username}
                        </span>{" "}
                        vừa tạo yêu cầu rút{" "}
                        <span style={{ fontWeight: 500, color: "green" }}>
                          {item?.amount?.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </td>
                      <td>
                        {moment(item?.createdAt).format("HH:mm DD-MM-yyyy")}
                      </td>
                      <td>{item?.user?.username}</td>
                      <td
                        style={{
                          fontWeight: 500,
                          color:
                            item?.status === "pending"
                              ? "blue"
                              : item?.status === "completed"
                              ? "green"
                              : "red",
                        }}
                      >
                        {STATUS[item?.status]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data?.length !== 0 ? (
                <span
                  style={{
                    textAlign: "center",
                    width: "100%",
                    display: "block",
                    cursor: "pointer",
                    color: "blue",
                  }}
                >
                  <Link to="/requirePayment">Xem thêm</Link>
                </span>
              ) : (
                <span
                  style={{
                    textAlign: "center",
                    width: "100%",
                    display: "block",
                    cursor: "pointer",
                    color: "blue",
                  }}
                >
                  Không có thông báo nào !
                </span>
              )}
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default TopPages;

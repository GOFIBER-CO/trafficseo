import { Col, Container, Row } from "reactstrap";
import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link, useParams } from "react-router-dom";
import { getUser } from "../../helpers/helper";
import UserProfile from "../Authentication/user-profile";

const UserDetail = () => {
  const params = useParams();
  const [user, setUser] = useState();
  // console.log("params: ", params);
  useEffect(() => {
    getUser(params["id"]).then((res) => {
      console.log(res);
      setUser(res);
    });
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Chi tiết thành viên"
            pageTitle="Thành viên"
            slug="users"
          />

          <Row>
            <Col lg={12}>
              <div className="mb-3">
                <Link to="/users">
                  <div className="d-flex align-items-center">
                    <i className="ri-arrow-left-line"></i>
                    <div style={{ marginLeft: "6px" }}>Quay lại</div>
                  </div>
                </Link>
              </div>
            </Col>
            <Col lg={3}>
              <div className="shadow rounded p-3 border">
                <div className="d-flex align-items-center justify-content-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/1246/1246351.png?ga=GA1.2.1648574692.1653643602"
                    width="40%"
                    alt=""
                  />
                </div>

                <div className="mt-3">
                  <h3 className="text-center mb-1">
                    {user?.username ?? "---"}
                  </h3>
                  {/* <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Reprehenderit, eligendi dolorum sequi illum qui unde
                    aspernatur non deserunt
                  </p> */}
                </div>
              </div>
            </Col>

            <Col lg={9}>
              {/* Right Side */}
              <div>
                {/* Profile tab */}
                <UserProfile />
                {/* About Section */}
                <div className="bg-white p-3 shadow rounded border">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="mr-3">
                      <i className="ri-user-line text-lg"></i>
                    </div>
                    <h5 className="mb-0 font-bold text-xl">Thông tin</h5>
                  </div>
                  <div className="px-2">
                    <div className="row gy-3">
                      <div className="col-6">
                        <div className="row">
                          <div className="col">
                            <span className="font-medium text-grey">Tên</span>
                          </div>
                          <div className="col">{user?.name ?? "---"}</div>
                        </div>
                      </div>

                      {/* <div className="col-6">
                        <div className="row">
                          <div className="col font-medium text-grey">
                            Họ
                          </div>
                          <div className="col">{user?.lastName ?? "---"}</div>
                        </div>
                      </div> */}
                      <div className="col-6">
                        <div className="row">
                          <div className="col font-medium text-grey">
                            Giới tính
                          </div>
                          <div className="col">{user?.Gender ?? "---"}</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="row">
                          <div className="col font-medium text-grey">SĐT</div>
                          <div className="col">{user?.phone ?? "---"}</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="row">
                          <div className="col font-medium text-grey">
                            {" "}
                            Địa chỉ
                          </div>
                          <div className="col">{user?.address ?? "---"}</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="row">
                          <div className="col font-medium text-grey">Email</div>
                          <div className="col">{user?.Email ?? "---"}</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="row">
                          <div className="col font-medium text-grey">
                            Sinh nhật
                          </div>
                          <div className="col">{user?.dob ?? "---"}</div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="row gy-4">
                          <div className="col">
                            <div className="row">
                              <div className="col">First Name</div>
                              <div className="col">Jane</div>
                            </div>
                          </div>

                          <div className="col">
                            <div className="row">
                              <div className="col">First Name</div>
                              <div className="col">Jane</div>
                            </div>
                          </div>
                        </div>

                        <div className="row gy-4">
                          <div className="col">
                            <div className="row">
                              <div className="col">First Name</div>
                              <div className="col">Jane</div>
                            </div>
                          </div>

                          <div className="col">
                            <div className="row">
                              <div className="col">First Name</div>
                              <div className="col">Jane</div>
                            </div>
                          </div>
                        </div>

                        <div className="row gy-4">
                          <div className="col">
                            <div className="row">
                              <div className="col">First Name</div>
                              <div className="col">Jane</div>
                            </div>
                          </div>

                          <div className="col">
                            <div className="row">
                              <div className="col">First Name</div>
                              <div className="col">Jane</div>
                            </div>
                          </div>
                        </div> */}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserDetail;

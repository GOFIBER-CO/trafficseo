import { Spin } from "antd";
import React from "react";
import { Button, Container, Input } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getIpLoginAdmin, updateIpLoginAdmin } from "../../helpers/helper";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ConfigIpAdminLogin() {
  const [ip, setIP] = useState("");
  const getData = async () => {
    const data = await getIpLoginAdmin();

    setIP(data?.ip);
  };
  const updatePayment = async () => {
    try {
      await updateIpLoginAdmin({ ip });
      getData();
      return toast.success("Cập nhật thành công");
    } catch (error) {
      return toast.error("Cập nhật thất bại");
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
            <BreadCrumb
              title="Cấu hình IP đăng nhập"
              pageTitle="Cấu hình IP đăng nhập"
            />
            <div>
              <label>IP cho phép đăng nhập account ADMIN</label>
              <Input
                value={ip}
                className="mb-2"
                placeholder="IP cho phép đăng nhập"
                onChange={(e) => setIP(e.target.value)}
              />
              <Button onClick={updatePayment}>Cập nhật</Button>
            </div>
          </Container>
        </div>
      </Spin>
    </React.Fragment>
  );
}

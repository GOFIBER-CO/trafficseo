import { Spin } from "antd";
import React from "react";
import { Button, Container, Input } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getMaxPayment, updateMaxPayment } from "../../helpers/helper";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ConfigPayment() {
  const [maxPayment, setMaxPayment] = useState(0);
  const getData = async () => {
    const data = await getMaxPayment();
    setMaxPayment(data?.quantity);
  };
  const updatePayment = async () => {
    try {
      await updateMaxPayment({ quantity: maxPayment });
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
              title="Cấu hình số lần rút tiền"
              pageTitle="Cấu hình số lần rút tiền"
            />
            <div>
              <label>Số lần rút tiền tối đa / tuần</label>
              <Input
                value={maxPayment}
                className="mb-2"
                placeholder="Số lần rút tiền"
                onChange={(e) => setMaxPayment(e.target.value)}
              />
              <Button onClick={updatePayment}>Cập nhật</Button>
            </div>
          </Container>
        </div>
      </Spin>
    </React.Fragment>
  );
}

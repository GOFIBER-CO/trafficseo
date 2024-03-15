import { Spin } from "antd";
import React from "react";
import { Button, Container, Input } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getLinkHelp, updateLinkHelp } from "../../helpers/helper";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ConfigLink() {
  const [maxPayment, setMaxPayment] = useState(0);
  const getData = async () => {
    const data = await getLinkHelp();
    setMaxPayment(data?.link);
  };
  const updatePayment = async () => {
    try {
      await updateLinkHelp({ link: maxPayment });
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
              title="Link hướng dẫn sử dụng"
              pageTitle="Link hướng dẫn sử dụng"
            />
            <div>
              <label>Đường link hướng dẫn sử dụng</label>
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

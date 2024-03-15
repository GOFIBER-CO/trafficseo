import { Spin, Switch } from "antd";
import React from "react";
import { Button, Container, Input } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  getIpLoginAdmin,
  getStatusMission,
  updateIpLoginAdmin,
  updateStatusMission,
} from "../../helpers/helper";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ConfigMission() {
  const [status, setStatus] = useState();
  const getData = async () => {
    const data = await getStatusMission();

    setStatus(data?.status || false);
  };
  const updateMission = async () => {
    try {
      await updateStatusMission({ status });
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
              title="Cấu hình trạng thái nhiệm vụ"
              pageTitle="Cấu hình trạng thái nhiệm vụ"
            />
            <div>
              <label>Trạng thái nhiệm vụ</label>
              <div className="w-100 mb-3">
                <Switch checked={status} onChange={(e) => setStatus(e)} />
              </div>
              <Button onClick={updateMission}>Cập nhật</Button>
            </div>
          </Container>
        </div>
      </Spin>
    </React.Fragment>
  );
}

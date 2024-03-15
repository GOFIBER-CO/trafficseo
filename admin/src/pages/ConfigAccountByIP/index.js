import { Spin, Switch, Tooltip } from "antd";
import React from "react";
import { Button, Container, Input } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  getIndexSearch,
  getMaxAccountIP,
  updateIndexSearch,
  updateMaxAccountIP,
} from "../../helpers/helper";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
const formatNumber = (value) => new Intl.NumberFormat().format(value);
const NumericInput = (props) => {
  const { value, onChange } = props;
  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      onChange(inputValue);
    }
  };

  // '.' at the end or only '-' in the input box.
  const handleBlur = () => {
    let valueTemp = value;
    if (value.charAt(value.length - 1) === "." || value === "-") {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp.replace(/0*(\d+)/, "$1"));
  };
  const title = value ? (
    <span className="numeric-input-title">
      {value !== "-" ? formatNumber(Number(value)) : "-"}
    </span>
  ) : (
    "Bạn vui lòng nhập số !"
  );
  return (
    <Tooltip
      trigger={["focus"]}
      title={title}
      placement="topLeft"
      overlayClassName="numeric-input"
    >
      <Input
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Input a number"
        maxLength={16}
      />
    </Tooltip>
  );
};
export default function ConfigAccountByIP() {
  const [status, setStatus] = useState();
  const getData = async () => {
    const data = await getMaxAccountIP();

    setStatus(data?.quantity || 0);
  };
  const updateMission = async () => {
    try {
      const result = await updateMaxAccountIP({ index: parseInt(status) });
      if (result?.status === 1) {
        getData();
        return toast.success("Cập nhật thành công");
      } else {
        return toast.error(result?.message || "Cập nhật thất bại");
      }
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
              title="Cấu hình số account theo IP"
              pageTitle="Cấu hình số account theo IP"
            />
            <div>
              <label>Số account tối đa</label>
              <div className="w-100 mb-3">
                <NumericInput
                  value={status}
                  onChange={(value) => setStatus(value)}
                ></NumericInput>
              </div>
              <Button onClick={updateMission}>Cập nhật</Button>
            </div>
          </Container>
        </div>
      </Spin>
    </React.Fragment>
  );
}

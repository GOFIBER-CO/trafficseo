import { Spin } from "antd";
import React from "react";
import { Button, Container, Input } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  getMaxPayment,
  getQuantityResetPost,
  updateMaxPayment,
  updateQuantityResetPost,
} from "../../helpers/helper";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ConfigPost() {
  const [quantityPost, setQuantityPost] = useState(0);
  const getData = async () => {
    const data = await getQuantityResetPost();
    setQuantityPost(data?.quantity);
  };
  const updatePayment = async () => {
    try {
      await updateQuantityResetPost({ quantity: quantityPost });
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
              title="Cấu hình lần xoay vòng bài viết trong ngày"
              pageTitle="Cấu hình lần xoay vòng bài viết trong ngày"
            />
            <div>
              <label>Số lần xoay vòng bài viết / ngày</label>
              <Input
                onChange={(e) => setQuantityPost(e.target.value)}
                className="mb-2"
                placeholder="Xoay vòng bài viết"
                type="select"
                value={quantityPost}
              >
                <option value={1}>
                  1 - ( Hệ thống sẽ chạy vào lúc 12h mỗi ngày )
                </option>
                <option value={2}>
                  2 - ( Hệ thống sẽ chạy vào lúc 8h và 16h mỗi ngày )
                </option>
                <option value={3}>
                  3 - ( Hệ thống sẽ chạy vào lúc 6h, 12h và 18h mỗi ngày )
                </option>
                <option value={5}>
                  5 - ( Hệ thống sẽ chạy vào lúc 4h, 8h, 12h, 16h và 20h mỗi
                  ngày )
                </option>
              </Input>

              <Button onClick={updatePayment}>Cập nhật</Button>
            </div>
          </Container>
        </div>
      </Spin>
    </React.Fragment>
  );
}

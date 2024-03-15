import ProfileLayout from "@/component/Layout/ProfileLayout";
import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Profile.module.scss";
import { getPointLogs } from "@/api/profile";
import moment from "moment";

const { Column } = Table;

const Point = () => {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLogs = async (pageSize, pageIndex) => {
    setLoading(true);
    const res = await getPointLogs(pageSize, pageIndex);
    setLoading(false);
    setLogs(res.data);
    setTotalPage(res.totalDoc);
  };

  useEffect(() => {
    getLogs(pageSize, pageIndex);
  }, [pageIndex, pageSize]);

  const handleOnChangeTable = ({ current, pageSize, total }) => {
    setPageIndex(current);
    setPageSize(pageSize);
  };

  return (
    <ProfileLayout>
      <div
        className={`d-flex flex-column justify-content-between align-items-center py-3 ${styles["container"]}`}
      >
        <div
          className="d-flex align-items-center p-3 w-100"
          style={{ flex: 1, borderBottom: "1px solid #efefef" }}
        >
          <h4 className={styles["payment-header"]}>Lịch sử điểm</h4>
          {/* <Button>Thêm thông tin thanh toán mới</Button> */}
        </div>
        <div className="py-2 w-100">
          <Table
            rowKey="_id"
            dataSource={logs}
            style={{ width: "100%" }}
            loading={loading}
            pagination={{
              total: totalPage,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSize: pageSize,
              current: pageIndex,
            }}
            onChange={(e) => handleOnChangeTable(e)}
          >
            <Column
              title="#"
              render={(val, rec, index) => {
                return index + 1;
              }}
            />
            <Column title="Số điểm" dataIndex="point" key="point" />
            <Column
              title="Keyword"
              dataIndex="post"
              key="post"
              render={(val) => val?.content?.split("###")?.[0]}
            />
            <Column
              title="Domain"
              dataIndex="post"
              key="post"
              render={(val) => val?.content?.split("###")?.[1]}
            />
            <Column title="Địa chỉ IP" dataIndex="ip" key="ip" />
            <Column
              title="Thời gian tạo"
              dataIndex="createdAt"
              key="createdAt"
              render={(val) => moment(val).format("DD MM YYYY")}
            />
          </Table>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Point;

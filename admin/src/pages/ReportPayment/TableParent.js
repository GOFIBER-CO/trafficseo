import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Space, Table } from "antd";
import TableNested from "./TableNested";
const items = [
  {
    key: "1",
    label: "Action 1",
  },
  {
    key: "2",
    label: "Action 2",
  },
];
const TableParent = ({ data }) => {
  const expandedRowRender = ({ user, details }) => {
    // const data = [];
    // Object.keys(details)?.map((item) =>
    //   data.push({ brand: item, total: details[item] })
    // );
    return <TableNested data={details} />;
  };
  const columns = [
    {
      title: "Team",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      sorter: (a, b) => a.total - b.total,
      render: (_) =>
        _?.toString()?.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + " VND",
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
          //   defaultExpandedRowKeys: ["0"],
        }}
        dataSource={data}
      />
    </>
  );
};
export default TableParent;

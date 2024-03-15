import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Space, Table } from "antd";
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
const TableNested = ({ data }) => {
  const expandedRowRender = ({ user, details }) => {
    const columns = [
      {
        title: "Brand",
        dataIndex: "brand",
        key: "brand",
      },
      {
        title: "Tổng tiền",
        dataIndex: "total",
        key: "total",
        sorter: (a, b) => a.total - b.total,
        render: (_) =>
          _?.toString()?.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
          " VND",
      },
    ];

    const data = [];
    Object.keys(details)?.map((item) =>
      data.push({ brand: item, total: details[item] })
    );
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };
  const columns = [
    {
      title: "User",
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
export default TableNested;

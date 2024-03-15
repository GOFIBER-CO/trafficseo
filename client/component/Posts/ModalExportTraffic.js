import React, { useState } from "react";
import { Button, Modal, Tooltip, notification } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import moment from "moment";
import { getTrafficPost } from "@/api/post";
import { toast } from "react-toastify";
const ExcelJS = require("exceljs");
const ModalExportTraffic = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const exportExcel = async (data) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Danh_sach_traffic_cua_bai_viet`);
    sheet.properties.defaultRowHeight = 20;

    let optionBorder = {
      top: { color: { argb: "000000" }, style: "thin" },
      left: { color: { argb: "000000" }, style: "thin" },
      bottom: { color: { argb: "000000" }, style: "thin" },
      right: { color: { argb: "000000" }, style: "thin" },
    };
    let optionbold = {
      name: "Time New Romans",
      family: 4,
      size: 12,
      bold: true,
    };

    sheet.getRow(1).values = [
      "STT",
      "Người dùng",
      "IP",
      "User Agent",
      "Thời gian",
    ];
    for (let i = 1; i <= 5; i++) {
      sheet.getCell(1, Number(i)).border = optionBorder;
      sheet.getCell(1, Number(i)).font = optionbold;
    }

    sheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    sheet.columns = [
      { key: "stt" },
      { key: "user", width: 30, border: optionBorder },
      { key: "ip", width: 50, border: optionBorder },
      {
        key: "userAgent",
        width: 100,
        border: optionBorder,
      },

      { key: "createdAt", width: 20, border: optionBorder },
    ];
    //Add dataSet
    let dataSetExport = [];
    data?.data?.map((item, index) => {
      const arrayIp = item?.ip?.split(",");
      let a = {
        stt: item?.index || index + 1,
        user: item?.user?.username,
        ip: arrayIp?.[0],
        userAgent: item?.userAgent,

        createdAt: moment(item?.createdAt)
          .format("HH:ss DD-MM-yyyy")
          ?.toString(),
      };
      dataSetExport.push(a);
      sheet.addRow(a);
    });

    //saver
    workbook.xlsx.writeBuffer().then(function (dataSet) {
      const blob = new Blob([dataSet], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Danh_sach_traffic_cua_bai_viet.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const data = await getTrafficPost(id);

      exportExcel(data);
    } catch (error) {
      toast.error("Xuất danh sách bị lỗi!!!");
    }
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Tooltip title="Xuất danh sách traffic">
        <FileExcelOutlined
          style={{ color: "green", fontSize: "20px" }}
          onClick={showModal}
        />
      </Tooltip>
      <Modal
        title="Xuất excel"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn có chắc chắn muốn xuất excel danh sách traffic ?</p>
      </Modal>
    </>
  );
};
export default ModalExportTraffic;

import React, { useState } from "react";
import { Modal } from "antd";
import { Button as ButtonStrap } from "reactstrap";
import ExcelJS from "exceljs";
import DatePicker from "react-datepicker";
import vi from "date-fns/locale/vi";
import { getTopUser } from "../../helpers/helper";
import moment from "moment";
const ModalTopPointUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date("2023/04/01"));
  const [endDate, setEndDate] = useState(new Date());
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    exportExcel().then(() => setIsModalOpen(false));
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const getData = async () => {
    const data = await getTopUser({
      startDate: moment(startDate)?.toISOString(),
      endDate: moment(endDate)?.toISOString(),
    });
    return data?.data;
  };

  const exportExcel = async () => {
    const data = await getData();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(
      `Top_dua_thuong_Trafficseo_${moment(startDate)
        ?.format("DD-MM")
        .toString()}_${moment(endDate)?.format("DD-MM").toString()}`
    );
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
      "Top",
      "Tên người dùng",
      "Email",
      "Tổng nhiệm vụ đã thực hiện",
    ];
    for (let i = 1; i <= 4; i++) {
      sheet.getCell(1, Number(i)).border = optionBorder;
      sheet.getCell(1, Number(i)).font = optionbold;
    }

    sheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    sheet.columns = [
      { key: "top", width: 30, border: optionBorder },
      { key: "name", width: 30, border: optionBorder },
      {
        key: "email",
        width: 30,
        border: optionBorder,
      },
      {
        key: "totalPosts",
        width: 30,
        border: optionBorder,
      },
    ];
    //Add dataSet
    let dataSetExport = [];
    let nf = new Intl.NumberFormat("en-US");
    data?.map((item, index) => {
      let a = {
        top: `Top ${index + 1}`,
        name: item?.username,
        email: item?.email,
        totalPosts: item?.totalPosts,
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
      anchor.download = `Top_dua_thuong_Trafficseo_${moment(startDate)
        ?.format("DD-MM")
        .toString()}_${moment(endDate)?.format("DD-MM").toString()}`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <>
      <ButtonStrap
        type="primary"
        style={{ backgroundColor: "green", borderColor: "green" }}
        onClick={showModal}
      >
        Top đua thưởng
      </ButtonStrap>
      <Modal
        title="Xuất excel các người dùng top đua thưởng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <label>Thời gian</label>
          <div className="d-flex gap-3">
            <DatePicker
              className="p-2 border"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat={"dd-MM-yyyy"}
              locale={vi}
            />
            <DatePicker
              className="p-2 border"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              dateFormat={"dd-MM-yyyy"}
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              locale={vi}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ModalTopPointUser;

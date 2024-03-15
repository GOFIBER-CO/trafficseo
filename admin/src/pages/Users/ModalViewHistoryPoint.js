import { Button, Modal } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";
import { Table } from "antd";
import {
  getPagingPointLogAdminMiddle2PaymentExcel,
  getPointLogs,
  getPointLogsMiddlePayment,
} from "../../helpers/helper";
import { DatePicker } from "antd";
import { RiFileExcel2Fill } from "react-icons/ri";
import ExcelJS from "exceljs";
const { Column } = Table;

const ModalViewHistoryPoint = ({ id, paymentId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [date, setDate] = useState([]);
  const [logs, setLogs] = useState([]);
  const [payment, setPayment] = useState([]);
  const [moneyByBrand, setMoneyByBrand] = useState({});

  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const exportExcelBrand = async () => {
    setLoadingButton(true);
    const data = [];
    Object.keys(moneyByBrand)?.map((item) => {
      Object.keys(moneyByBrand[item])?.map((itemChild) => {
        data?.push({
          username: item,
          brand: itemChild,
          money: moneyByBrand[item][itemChild],
        });
      });
    });
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`So_tien_theo_Brand`);
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

    sheet.getRow(1).values = ["STT", "Tên người dùng", "Brand", "Số tiền"];
    for (let i = 1; i <= 4; i++) {
      sheet.getCell(1, Number(i)).border = optionBorder;
      sheet.getCell(1, Number(i)).font = optionbold;
    }

    sheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    sheet.columns = [
      { key: "stt" },
      { key: "username", width: 30, border: optionBorder },
      { key: "brand", width: 30, border: optionBorder },
      {
        key: "money",
        width: 30,
        border: optionBorder,
      },
    ];
    //Add dataSet
    let dataSetExport = [];
    data?.map((item, index) => {
      const arrayIp = item?.ip?.split(",");
      let a = {
        stt: item?.index || index + 1,
        username: item?.username,
        brand: item?.brand,
        money: item?.money,
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
      anchor.download = "So_tien_theo_Brand.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
      setLoadingButton(false);
    });
  };

  const exportExcel = async () => {
    setLoadingButton(true);
    let dataReq = {
      pageSize: 9999999,
      pageIndex: pageIndex || 1,
      user: id,
      id: paymentId,
    };
    const result = await getPagingPointLogAdminMiddle2PaymentExcel(dataReq);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Lich_su_diem_cua_nguoi_dung`);
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
      "Keyword",
      "Domain",
      "Người đăng",
      "Team",
      "Số điểm",
      "Địa chỉ IP",
      "Thời gian",
    ];
    for (let i = 1; i <= 8; i++) {
      sheet.getCell(1, Number(i)).border = optionBorder;
      sheet.getCell(1, Number(i)).font = optionbold;
    }

    sheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    sheet.columns = [
      { key: "stt" },
      { key: "keyword", width: 30, border: optionBorder },
      { key: "domain", width: 30, border: optionBorder },
      { key: "username", width: 30, border: optionBorder },
      { key: "team", width: 30, border: optionBorder },

      {
        key: "point",
        width: 30,
        border: optionBorder,
      },
      {
        key: "ip",
        width: 100,
        border: optionBorder,
      },

      { key: "createdAt", width: 20, border: optionBorder },
    ];
    //Add dataSet
    let dataSetExport = [];
    result?.data?.map((item, index) => {
      const arrayIp = item?.ip?.split(",");
      let a = {
        stt: item?.index || index + 1,
        keyword: item?.post?.content?.split("###")?.[0],
        domain: item?.post?.content?.split("###")?.[1],
        username: item?.post?.user?.username,
        team: item?.post?.user?.team,
        point: item?.point,
        ip: arrayIp?.[0],

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
      anchor.download = "Lich_su_diem_nguoi_dung.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
      setLoadingButton(false);
    });
  };
  const getLogs = async (pageSize, pageIndex) => {
    setLoading(true);
    let dataReq = {
      pageSize: pageSize || 10,
      pageIndex: pageIndex || 1,
      user: id,
      startDate: date[0] ? moment(date[0])?.toISOString() : "",
      endDate: date[1] ? moment(date[1])?.toISOString() : "",
      id: paymentId,
    };
    const res = await getPointLogsMiddlePayment(dataReq);
    setLoading(false);
    setLogs(res.data);
    setPayment(res?.payment);
    setTotalPage(res.totalDoc);
    setMoneyByBrand(res?.moneyByUserBrand);
  };

  useEffect(() => {
    if (isModalOpen) getLogs(pageSize, pageIndex);
  }, [pageIndex, pageSize, id, date, isModalOpen]);

  const handleOnChangeTable = ({ current, pageSize, total }) => {
    setPageIndex(current);
    setPageSize(pageSize);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <span
        type="primary"
        onClick={showModal}
        style={{
          color: "blue",
          fontWeight: 500,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        Xem
      </span>
      <Modal
        title="Lịch sử điểm của người dùng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1200}
        footer={null}
      >
        <div className="d-flex align-items-center gap-2 mb-2 w-100">
          <span>
            {payment?.length === 2 &&
              `Khoảng thời gian giữa 2 lần rút tiền là ${moment(
                payment?.[1]?.createdAt
              ).format("HH:mm DD-MM-YYYY")} đến ngày ${moment(
                payment?.[0]?.createdAt
              ).format("HH:mm DD-MM-YYYY")}`}
            {payment?.length === 1 &&
              `Đây là lần rút tiền đầu tiên của người dùng này ${moment(
                payment?.[0]?.createdAt
              ).format("HH:mm DD-MM-YYYY")}`}
          </span>
        </div>
        <div className="d-grid w-100 mb-2">
          <span style={{ fontSize: 15, fontWeight: 700 }}>
            Tính tiền theo team
          </span>
          <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
            {Object.keys(moneyByBrand)?.map((item) => (
              <div
                className="d-grid border border-secondary p-2"
                key={item}
                style={{ width: "230px" }}
              >
                <span style={{ fontWeight: 500 }}>{item}</span>
                <span>
                  {Object.keys(moneyByBrand[item])?.map((itemChild, index) => {
                    return (
                      <p key={index} style={{ color: "green" }}>
                        {itemChild}:{" "}
                        {moneyByBrand[item][itemChild]?.toLocaleString(
                          "it-IT",
                          {
                            style: "currency",
                            currency: "VND",
                          }
                        )}
                      </p>
                    );
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 mb-2">
          <Button
            style={{
              display: "flex",
              gap: 5,
              height: "38px",
              alignItems: "center",
            }}
            icon={<RiFileExcel2Fill size={20} color="green" />}
            loading={loadingButton}
            onClick={exportExcelBrand}
          >
            Xuất excel tiền theo team
          </Button>

          <Button
            style={{
              display: "flex",
              gap: 5,
              height: "38px",
              alignItems: "center",
            }}
            icon={<RiFileExcel2Fill size={20} color="green" />}
            loading={loadingButton}
            onClick={exportExcel}
          >
            Xuất excel lịch sử điểm
          </Button>
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

            <Column
              title="Người đăng"
              dataIndex="post"
              key="post"
              render={(val) => val?.user?.username}
            />

            <Column
              title="Team"
              dataIndex="post"
              key="post"
              render={(val) => val?.user?.team}
            />
            <Column title="Địa chỉ IP" dataIndex="ip" key="ip" />
            <Column
              title="Thời gian tạo"
              dataIndex="createdAt"
              key="createdAt"
              render={(val) => moment(val).format("HH:mm DD-MM-YYYY")}
            />
          </Table>
        </div>
      </Modal>
    </>
  );
};
export default ModalViewHistoryPoint;

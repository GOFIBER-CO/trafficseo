import ProfileLayout from "@/component/Layout/ProfileLayout";
import {
  Col,
  ConfigProvider,
  DatePicker,
  Input,
  Row,
  Select,
  Button,
  Space,
  Table,
} from "antd";
import React, { use, useContext, useEffect, useState } from "react";
import styles from "@/styles/Profile.module.scss";
import { FaCopy, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { Typography } from "antd";
import { getCommission, getCommissionTotal } from "@/api/profile";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import { AuthContext } from "@/context/AuthContext";

dayjs.locale("vi");
const monthFormat = "MM/YYYY";

export default function InvitedUserPage() {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [data, setData] = useState([]);
  const [commissionTotal, setCommissionTotal] = useState(0);
  const [generalData, setGeneralData] = useState({});
  const [month, setMonth] = useState("");

  const [year, setYear] = useState(new Date().getFullYear());
  const handleCopyClipBoard = () => {
    navigator.clipboard.writeText(
      `https://trafficsseo.com/login?referralCode=${user?.referralCode}`
    );
    return toast.success("Sao chép đường dẫn giới thiệu thành công!");
  };

  const getCommissionData = async () => {
    setLoading(true);
    const res = await getCommission(pageSize, pageIndex, month, year);
    if (res?.status === 1) {
      setData(res?.commissionDetailList);
      setTotalPage(res?.totalDocs);
      setCommissionTotal(res?.commissionsTotal);
    }
    setLoading(false);
    // console.log("🚀 ~ file: invitedUser.js:28 ~ getCommissionData ~ res:", res)
  };
  const getCommissionTotalData = async () => {
    setLoading(true);
    const res = await getCommissionTotal();
    setGeneralData({
      userReceivedCodeList: res?.userReceivedCodeList,
    });
    setLoading(false);
  };

  useEffect(() => {
    getCommissionTotalData();
  }, []);
  useEffect(() => {
    getCommissionData();
  }, [pageSize, pageIndex, month, year]);
  //
  const handleOnChangeTable = (e) => {
    setPageIndex(e?.current);
  };
  const handleSearch = () => {
    getCommissionData();
  };
  const columns = [
    {
      title: "Tên",
      width: "50%",
      dataIndex: "_id",
      key: "fullName",
      render: (_) => _?.fullName,
    },
    {
      title: "Hoa hồng nhận được",
      width: "50%",
      dataIndex: "totalCopies",
      key: "totalCopies",
      render: (value) =>
        `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ`,
    },
  ];
  return (
    <ConfigProvider locale={locale}>
      <ProfileLayout>
        <div
          className={`d-flex flex-column justify-content-between align-items-center py-3 ${styles["container"]}`}
        >
          <div
            className="d-flex align-items-center p-3 w-100"
            style={{ flex: 1, borderBottom: "1px solid #efefef" }}
          >
            <h4 className={styles["payment-header"]}>Người dùng đã mời</h4>
          </div>
          <Row style={{ width: "100%", paddingTop: "10px" }} gutter={[20, 20]}>
            <Col xl={12} md={8} sm={0}></Col>
            <Col xl={12} md={16} sm={24}>
              <Input
                addonBefore="Link giới thiệu"
                addonAfter={<FaCopy onClick={handleCopyClipBoard} />}
                style={{ cursor: "pointer" }}
                value={`https://trafficsseo.com/login?referralCode=${user?.referralCode}`}
              />
            </Col>
            <Col md={5}>
              <div className="search-box w-100 d-flex gap-2">
                <DatePicker
                  format={monthFormat}
                  picker="month"
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    console.log(dayjs(value).get("month"));
                    setMonth(
                      dayjs(value).get("month") !== NaN
                        ? dayjs(value).get("month") + 1
                        : ""
                    );
                    setYear(
                      dayjs(value).get("year") || new Date().getFullYear()
                    );
                  }}
                  placeholder="Thời gian"
                />
              </div>
            </Col>
            <Col md={3}>
              <div className="search-box w-100 d-flex gap-2">
                <Button
                  icon={<FaSearch />}
                  style={{ width: "100%" }}
                  type="primary"
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
              </div>
            </Col>
            <Col md={8}></Col>
            <Col md={8}>
              <div
                style={{
                  border: "1px solid black",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <p level={4} style={{ fontSize: "15px", fontWeight: 500 }}>
                  Số người dùng đã mời: {generalData?.userReceivedCodeList}{" "}
                </p>
                <span level={4} style={{ fontSize: "15px", fontWeight: 500 }}>
                  Số tiền đã nhận được:{" "}
                  {commissionTotal
                    ?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  đ
                </span>
              </div>
            </Col>
          </Row>

          <div className="py-2 w-100">
            <Table
              columns={columns}
              rowKey="_id"
              dataSource={data}
              style={{ width: "100%" }}
              loading={loading}
              pagination={{
                total: totalPage,
                // showSizeChanger: true,
                // showQuickJumper: true,
                pageSize: pageSize,
                current: pageIndex,
              }}
              onChange={(e) => handleOnChangeTable(e)}
            />
          </div>
        </div>
      </ProfileLayout>
    </ConfigProvider>
  );
}

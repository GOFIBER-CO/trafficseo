import Head from "next/head";

import Header from "@/component/Header";
import Posts from "@/component/Posts";
import ChatSidebar from "@/component/ChatSidebar";
import AdvertiseSidebar from "@/component/AdvertiseSidebar";
import Layout from "@/component/Layout";
import { useCheckAuth } from "@/utils/useCheckAuth";
import HeaderNonLogin from "@/component/HeaderNonLogin";
import Link from "next/link";
import { CountUp } from "use-count-up";
import {
  getDieuKhoan,
  getDieuKien,
  getNotificationHome,
  getNotificationReferral,
  getPostHome,
  updateFingerPrint,
} from "@/api/post";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { useContext, useEffect, useState } from "react";
import { FcRules } from "react-icons/fc";
import { AuthContext } from "@/context/AuthContext";

import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";

export default function Home() {
  const { user, loading } = useCheckAuth();
  const { isLoading, error, data, getData } = useVisitorData(
    { extendedResult: true },
    { immediate: true }
  );
  const { getLoggedinUser } = useContext(AuthContext);
  const [dataPost, setDataPost] = useState({});
  const [dieuKhoan, setDieuKhoan] = useState({});
  const [dieuKien, setDieuKien] = useState({});
  const [notificationReferral, setNotificationReferral] = useState({});
  const [notificationHome, setNotificationHome] = useState({});
  const [countView, setCountView] = useState(704430876);
  const [countUrl, setCountUrl] = useState(221770);
  const [countWeb, setCountWeb] = useState(58406);
  const [countMember, setCountMember] = useState(68509);
  const [countKeyword, setCountKeyword] = useState(155538);
  const getDataPostHome = async () => {
    const rs = await getPostHome();
    setDataPost(rs?.data);
  };
  useEffect(() => {
    if (data && user) {
      const formData = new FormData();
      formData.append("visitorId", data?.visitorId);
      formData.append("ip", data.ip);
      updateFingerPrint(formData);
      // getData({ ignoreCache: true });
    }
  }, [data]);
  const getDataNotification = async () => {
    const rs = await getNotificationHome();
    setNotificationHome(rs?.data);
    const dataDieuKhoan = await getDieuKhoan();
    setDieuKhoan(dataDieuKhoan?.data);
    const dataDieuKien = await getDieuKien();
    setDieuKien(dataDieuKien?.data);

    const notificationReferral = await getNotificationReferral();
    setNotificationReferral(notificationReferral?.data);
  };
  const [modal, setModal] = useState(true);

  const toggle = () => setModal(!modal);
  const [modalDieuKhoan, setModalDieuKhoan] = useState(false);

  const toggleDieuKhoan = () => setModalDieuKhoan(!modalDieuKhoan);

  const [modalDieuKien, setModalDieuKien] = useState(false);

  const toggleDieuKien = () => setModalDieuKien(!modalDieuKien);

  const [modalNotificationReferral, setModalNotificationReferral] =
    useState(false);

  const toggleNotificationReferral = () =>
    setModalNotificationReferral(!modalNotificationReferral);
  useEffect(() => {
    getDataPostHome();
    getDataNotification();
    let interval = null;
    let intervalUrl = null;
    let intervalWeb = null;
    let intervalMember = null;
    let intervalKeyword = null;
    const timer = setTimeout(() => {
      interval = setInterval(() => {
        setCountView((data) => data + Math.round(1 + Math.random() * 7));
      }, 300);

      intervalUrl = setInterval(() => {
        setCountUrl((data) => data + Math.round(1 + Math.random() * 4));
      }, 1000);
      intervalWeb = setInterval(() => {
        setCountWeb((data) => data + Math.round(1 + Math.random() * 3));
      }, 1500);
      intervalMember = setInterval(() => {
        setCountMember((data) => data + Math.round(1 + Math.random() * 3));
      }, 5000);
      intervalKeyword = setInterval(() => {
        setCountKeyword((data) => data + Math.round(1 + Math.random() * 6));
      }, 500);
    }, 3200);
    getLoggedinUser();
    return () => {
      clearInterval(intervalUrl);
      clearInterval(intervalWeb);
      clearInterval(intervalMember);
      clearInterval(intervalKeyword);
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);
  return (
    <>
      {user ? (
         <Layout>
          <Head>
            <title>TRAFFIC SEO</title>

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />

            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Modal
            isOpen={modal}
            toggle={toggle}
            centered
            size="xl"
            id="notificationHome"
          >
            <ModalHeader toggle={toggle}>
              <div className="d-flex">
                {/* <FcRules /> */}
                <h4 className="text-primary gap-2 d-flex align-items-center">
                  <FcRules />
                  {notificationHome?.title}
                </h4>
              </div>
            </ModalHeader>
            <ModalBody>
              <div
                dangerouslySetInnerHTML={{ __html: notificationHome?.content }}
              ></div>
            </ModalBody>
          </Modal>

          {/* modal điều khoản rút tiền */}
          <Modal
            isOpen={modalDieuKhoan}
            toggle={toggleDieuKhoan}
            centered
            size="lg"
          >
            <ModalHeader toggle={toggleDieuKhoan}>
              <div className="d-flex">
                {/* <FcRules /> */}
                <h4 className="text-primary gap-2 d-flex align-items-center">
                  <FcRules />
                  {dieuKhoan?.title}
                </h4>
              </div>
            </ModalHeader>
            <ModalBody>
              <div
                dangerouslySetInnerHTML={{ __html: dieuKhoan?.content }}
              ></div>
            </ModalBody>
          </Modal>
          {/* end */}

          {/* modal điều kiện rút tiền */}
          <Modal
            isOpen={modalDieuKien}
            toggle={toggleDieuKien}
            centered
            size="lg"
          >
            <ModalHeader toggle={toggleDieuKien}>
              <div className="d-flex">
                <h4 className="text-primary gap-2 d-flex align-items-center">
                  <FcRules />
                  {dieuKien?.title}
                </h4>
              </div>
            </ModalHeader>
            <ModalBody>
              <div
                dangerouslySetInnerHTML={{ __html: dieuKien?.content }}
              ></div>
            </ModalBody>
          </Modal>
          {/* thông báo mời người nhận hoa hồng */}
          <Modal
            isOpen={modalNotificationReferral}
            toggle={toggleNotificationReferral}
            centered
            size="lg"
          >
            <ModalHeader toggle={toggleNotificationReferral}>
              <div className="d-flex">
                <h4 className="text-primary gap-2 d-flex align-items-center">
                  <FcRules />
                  {notificationReferral?.title}
                </h4>
              </div>
            </ModalHeader>
            <ModalBody>
              <div
                dangerouslySetInnerHTML={{
                  __html: notificationReferral?.content,
                }}
              ></div>
            </ModalBody>
          </Modal>
          {/* end */}
          <main className="bg-gray-100" style={{ minHeight: "100vh" }}>
            <div className="d-flex justify-content-center">
              {loading || (!loading && !user) ? (
                <></>
              ) : (
                <>
                  <ChatSidebar />
                  <Posts user={user} />
                  <AdvertiseSidebar
                    toggleDieuKhoan={toggleDieuKhoan}
                    toggleDieuKien={toggleDieuKien}
                    nameDieuKien={dieuKien?.title}
                    nameDieuKhoan={dieuKhoan?.title}
                    nameNotificationReferral={notificationReferral?.title}
                    toggleNotificationReferral={toggleNotificationReferral}
                  />
                </>
              )}
            </div>
          </main>
        </Layout>
      ) : (
        <div id="layout-main">
          <HeaderNonLogin />
          <div id={"body-main"}>
            <div className="full_screen">
              <div id="stars"></div>
              <div id="stars2"></div>
              <div className="container">
                <div class="header_content">
                  <h1>
                    <span id="ctl00_ContentPlaceHolderHeader_labH1">
                      Tăng traffic website - Tăng view Youtube - Kiểm tra thứ
                      hạng từ khóa
                    </span>
                  </h1>
                  <div>
                    <div
                      id="ctl00_ContentPlaceHolderHeader_signupbtn2"
                      style={{ margin: "20px 0" }}
                    >
                      <Link class="big-btn" href="/login">
                        <i class="icon icon-register"></i>ĐĂNG KÝ NGAY
                      </Link>
                      <div></div>
                    </div>
                    <div
                      id="ctl00_ContentPlaceHolderHeader_signupbtn2"
                      style={{ margin: "20px 0" }}
                    >
                      <Link
                        class="big-btn"
                        href="https://t.me/+CCVNoYj4hYRhYmY9"
                        target="_blank"
                        style={{ padding: "5px 10px" }}
                      >
                        <img src="/help.png" height={28} /> THAM GIA CỘNG ĐỒNG
                        TRAFFIC
                      </Link>
                    </div>
                  </div>
                  <div></div>
                  <div class="home_member">
                    <CountUp
                      end={countMember}
                      duration={3}
                      isCounting
                      thousandsSeparator={","}
                    />
                    &nbsp;THÀNH VIÊN
                  </div>
                  <div class="home_stat">
                    <div class="home_stat_column_left">
                      <span
                        id="ctl00_ContentPlaceHolderHeader_labWebsite"
                        class="count"
                        style={{ fontWeight: "bold", fontSize: "40px" }}
                      >
                        <CountUp
                          end={countWeb}
                          duration={3}
                          isCounting
                          thousandsSeparator={","}
                        />
                      </span>
                      <br />
                      WEBSITE
                    </div>
                    <div class="home_stat_column_left">
                      <span
                        id="ctl00_ContentPlaceHolderHeader_labUrl"
                        class="count"
                        style={{ fontSize: "40px", fontWeight: "bold" }}
                      >
                        <CountUp
                          end={countUrl}
                          duration={3}
                          isCounting
                          thousandsSeparator={","}
                        />
                      </span>
                      <br />
                      URL
                    </div>
                    <div class="home_stat_column_left">
                      <span
                        id="ctl00_ContentPlaceHolderHeader_labView"
                        class="count"
                        style={{ fontSize: "40px", fontWeight: "bold" }}
                      >
                        <CountUp
                          end={countView}
                          duration={3}
                          isCounting
                          thousandsSeparator={","}
                        />
                      </span>
                      <br />
                      VIEW
                    </div>
                    <div class="home_stat_column_right">
                      <span
                        id="ctl00_ContentPlaceHolderHeader_labKeyword"
                        class="count"
                        style={{ fontSize: "40px", fontWeight: "bold" }}
                      >
                        <CountUp
                          end={countKeyword}
                          duration={3}
                          isCounting
                          thousandsSeparator={","}
                        />
                      </span>
                      <br />
                      TỪ KHÓA
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="pt-4">
                <div class="row justify-content-center">
                  <div class="col-md-12">
                    <div
                      class="section-heading text-justify"
                      data-aos="fade-up"
                    >
                      <h2 className="fs-20 text-center">{dataPost?.title}</h2>
                      <div
                        className="text-center"
                        dangerouslySetInnerHTML={{
                          __html: dataPost?.description,
                        }}
                      />
                      <div
                        className="font-weight-norma"
                        dangerouslySetInnerHTML={{ __html: dataPost?.content }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

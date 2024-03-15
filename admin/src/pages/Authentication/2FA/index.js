import { Button, Image, Input, Modal, Switch } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  enable2FA,
  disable2FA,
  verify2FA,
  getQR,
} from "../../../helpers/helper";
export const Auth2FA = () => {
  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [check, setIsCheck] = useState(false);
  const [QR, setQR] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const showModal = async () => {
    if (!check) {
      let res = await getQR(user.id);

      setQR(res?.qrcode);
      setSecret(res?.secret);
    }
    setIsModalOpen(true);
  };
  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("authUser"))?.user);
  }, []);
  const handleOk = async () => {
    if (check) {
      if (!password) return toast.error("Vui lòng nhập mật khẩu!");
      let res = await disable2FA(user.id, { password });
      setPassword("");
      if (res?.status === 1) {
        toast.success(res.message);
        setIsCheck(false);
      } else {
        toast.error(res.message);
      }
    } else {
      try {
        if (!token) {
          return toast.error("Vui lòng nhập mã xác thực!");
        }
        let res = await enable2FA(user.id, { token });
        setToken("");
        if (res?.status) {
          toast.success(res.message);
          setIsCheck(true);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        return toast.error("Kích hoạt 2FA thất bại!");
      }
    }
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const init2Fa = () => {
    if (user?.isEnable2FaAuthenticate) {
      setIsCheck(true);
      setSecret(user.secret);
    } else {
      setIsCheck(false);
    }
  };

  useEffect(() => {
    init2Fa();
  }, [user]);
  return (
    <>
      <Switch onClick={showModal} checked={check} />
      {!check && (
        <Modal
          title="Xác thực 2 bước"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Sử dụng QR Code</p>
          <Image src={QR} />
          <br />
          SECRET: <strong>{secret}</strong>
          <br />
          <label>Mã xác thực</label>
          <Input
            placeholder="Nhập mã xác thực"
            onChange={(e) => setToken(e.target.value)}
          />
        </Modal>
      )}
      {check && (
        <Modal
          title="Xác thực 2 bước"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Bạn có chắc muốn tắt xác thực 2FA?</p>
          <Input
            placeholder="Nhập mật khẩu"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Modal>
      )}
    </>
  );
};

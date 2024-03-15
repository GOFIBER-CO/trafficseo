import { Button, Form, Input } from "antd";
import { Link, useHistory, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import ReactCodeInput from "react-code-input";
import { LockFilled } from "@ant-design/icons";
import Title from "antd/es/typography/Title";

import { toast } from "react-toastify";
import { checkAuth, verify2FA, verify2FALogin } from "../../helpers/helper";
import { useEffect } from "react";
export const TwoFactor = () => {
  const history = useHistory();
  const [token, setToken] = useState("");
  const [user, setUser] = useState();
  const onFinish = async () => {
    try {
      let res = await verify2FALogin(user?._id, { token: token });
      console.log(res);
      if (res?.status === 1) {
        sessionStorage.setItem("verify", true);
        history.push("/");
      }
    } catch (error) {
      toast.error("Xác thực thất bại!");
    }
    // auth.authenticate2FA(token, navigate);
  };
  const getData = async () => {
    const user = await checkAuth();
    if (!user?.user) {
      history.push("/login");
    }
    if (user?.verify2Fa === true) {
      history.push("/dashboard");
    }
    setUser(user?.user);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="two-factor-page-wrapper" style={{ padding: "40px" }}>
      <div className="two-factor--page">
        <div style={{ width: "100%" }}>
          <Title
            level={2}
            style={{ textAlign: "center", padding: "10px", fontWeight: "bold" }}
          >
            XÁC THỰC 2 YẾU TỐ
          </Title>
        </div>
        <div
          className="two-factor--page-logo"
          style={{
            width: "100%",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            width={300}
            height={300}
            alt="gif"
            src="/2fa.gif"
            style={{
              borderRadius: "20px",
            }}
          />
        </div>
        <Form
          style={{ marginTop: "25px" }}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Hãy nhập mã xác thực",
              },
            ]}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <ReactCodeInput
              type="number"
              fields={6}
              isValid={true}
              onChange={(value) => setToken(value)}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              // loading={auth.buttonLoading}
              icon={<LockFilled />}
            >
              Xác thực
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

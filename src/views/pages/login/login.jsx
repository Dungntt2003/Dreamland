import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex } from "antd";
import { Link } from "react-router-dom";
import loginApi from "api/loginApi";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "context/authContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CoverImage from "assets/image/cover-img.jpeg";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = (values) => {
    const params = {
      email: values.email,
      password: values.password,
    };
    const Login = async () => {
      try {
        const response = await loginApi.login(params);
        localStorage.setItem("token", response.data.token);
        login(response.data.token);
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/homepage");
        }, 2000);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
      }
    };
    Login();
  };

  return (
    <div className="register-wrap-container login-container">
      <div style={{ display: "flex", width: "100%" }}>
        <img src={CoverImage} alt="cover image" className="login-cover-image" />
        <div
          className="register-container"
          style={{ width: "100%", marginTop: "0" }}
        >
          <div
            className="header2 register-header"
            style={{ textTransform: "uppercase" }}
          >
            {t("login")}
          </div>
          <div className="register-form-container" style={{ width: "100%" }}>
            <Form
              name="login"
              style={{ width: "65%", margin: "auto" }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                  {
                    required: true,
                    message: "Hãy nhập email!",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                type="password"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập mật khẩu",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder={t("password")}
                />
              </Form.Item>
              <Form.Item>
                <Flex
                  justify="space-between"
                  align="center"
                  className="login-item-special"
                >
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>{t("remember_me")}</Checkbox>
                  </Form.Item>
                  <Link to="/register" className="link">
                    {t("forgot_password")}
                  </Link>
                </Flex>
              </Form.Item>

              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  className="button"
                >
                  {t("login")}
                </Button>
                {t("or")}{" "}
                <Link to="/register" className="link">
                  {t("register_now")}!
                </Link>
              </Form.Item>
            </Form>
          </div>
          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default Login;

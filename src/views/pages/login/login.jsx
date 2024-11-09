import "./login.scss";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex } from "antd";
import { Link } from "react-router-dom";
import loginApi from "api/loginApi";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "context/authContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        navigate("/homepage");
      }, 2000);
    }
  }, [isAuthenticated]);
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
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.error, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    };
    Login();
  };

  return (
    <div className="register-container">
      <div className="header2 register-header">ĐĂNG NHẬP</div>
      <div className="register-form-container">
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
            rules={[
              {
                required: true,
                message: "Hãy nhập mật khẩu",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Nhớ tài khoản</Checkbox>
              </Form.Item>
              <Link to="/register" className="link">
                Quên mật khẩu
              </Link>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" className="button">
              Đăng nhập
            </Button>
            hoặc{" "}
            <Link to="/register" className="link">
              Đăng ký ngay!
            </Link>
          </Form.Item>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;

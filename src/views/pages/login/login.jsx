import "./login.scss";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex } from "antd";
import { Link } from "react-router-dom";
const Login = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
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
    </div>
  );
};

export default Login;

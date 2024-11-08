import "./register.scss";
// import { useTranslation } from "react-i18next";
import { Button, Checkbox, Form, Input, Select, Image, Upload } from "antd";
import { useEffect, useState } from "react";
import publicApi from "api/publicApi";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Register = () => {
  const [provinces, setProvinces] = useState([]);
  const [check, setCheck] = useState(false);
  const [text1, setText1] = useState("CCCD mặt trước");
  const [text2, setText2] = useState("CCCD mặt sau");
  useEffect(() => {
    const getProvinces = async () => {
      try {
        const response = await publicApi.getListProvinces();
        setProvinces(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProvinces();
  });
  const onFinish = (values) => {
    console.log("Success:", values);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    if (fileList[0]?.originFileObj) {
      formData.append("cccd_front", fileList[0].originFileObj);
    }
    if (fileList1[0]?.originFileObj) {
      formData.append("cccd_end", fileList1[0].originFileObj);
    }

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onChangeRegisterType = (value) => {
    if (value === "company") {
      setText1("Giấy phép kinh doanh mặt trước");
      setText2("Giấy phép kinh doanh mặt sau");
    }
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      +84
    </Form.Item>
  );
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const handleCheck = (e) => {
    setCheck(e.target.checked);
  };
  const options = provinces.map((item) => {
    return { value: item.name, label: item.name };
  });
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [fileList1, setFileList1] = useState([]);
  const [previewOpen1, setPreviewOpen1] = useState(false);
  const [previewImage1, setPreviewImage1] = useState("");
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = (info) => setFileList(info.fileList);

  const handlePreview1 = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage1(file.url || file.preview);
    setPreviewOpen1(true);
  };
  const handleChange1 = (info) => setFileList1(info.fileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  return (
    <div className="register-container">
      <div className="header2 register-header">ĐĂNG KÝ TÀI KHOẢN</div>
      <div className="register-form-container">
        <Form
          name="basic"
          className="register-form"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          // layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="register-wrap-item">
            <Form.Item
              className="register-item"
              label="Họ và tên"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập họ và tên!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="register-item"
              name="phone"
              label="SĐT"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập số điện thoại!",
                },
              ]}
            >
              <Input
                addonBefore={prefixSelector}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
          </div>

          <div className="register-wrap-item">
            <Form.Item
              className="register-item"
              name="email"
              label="E-mail"
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
              <Input />
            </Form.Item>

            <Form.Item
              className="register-item"
              label="Địa chỉ"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập địa chỉ!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn tỉnh/thành phố"
                optionFilterProp="label"
                onChange={onChange}
                onSearch={onSearch}
                options={options}
              />
            </Form.Item>
          </div>

          <div className="register-wrap-item">
            <Form.Item
              className="register-item"
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập mật khẩu!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              className="register-item"
              name="confirm"
              label="Nhập lại mật khẩu"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Hãy nhập lại mật khẩu!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Nhập lại mật khẩu không trùng khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </div>

          <Form.Item
            name="business-register"
            valuePropName="checked"
            onChange={handleCheck}
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Đăng ký kinh doanh</Checkbox>
          </Form.Item>

          {check === true && (
            <>
              <Form.Item
                label="Đối tượng đăng ký"
                name="register_type"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn đối tượng kinh doanh!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn đối tượng kinh doanh"
                  optionFilterProp="label"
                  onChange={onChangeRegisterType}
                  onSearch={onSearch}
                  options={[
                    { value: "person", label: "Cá nhân" },
                    { value: "company", label: "Tổ chức" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Loại hình kinh doanh"
                name="business_type"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn loại hình kinh doanh!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn loại hình kinh doanh"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={[
                    { value: "hotel", label: "Cơ sở lưu trú" },
                    { value: "restaurant", label: "Cơ sở ẩm thực" },
                    { value: "shop", label: "Gian hàng trực tuyến" },
                  ]}
                />
              </Form.Item>

              <Form.Item label={text1} name="cccd_front">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{
                      display: "none",
                    }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </Form.Item>

              <Form.Item label={text2} name="cccd_end">
                <Upload
                  listType="picture-card"
                  fileList={fileList1}
                  onPreview={handlePreview1}
                  onChange={handleChange1}
                >
                  {fileList1.length >= 1 ? null : uploadButton}
                </Upload>
                {previewImage1 && (
                  <Image
                    wrapperStyle={{
                      display: "none",
                    }}
                    preview={{
                      visible: previewOpen1,
                      onVisibleChange: (visible) => setPreviewOpen1(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage1(""),
                    }}
                    src={previewImage1}
                  />
                )}
              </Form.Item>
            </>
          )}

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Nhớ tài khoản</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" className="button">
              Đăng ký
            </Button>
            <div className="register-had-account" style={{ marginTop: "16px" }}>
              Bạn đã có tài khoản?{" "}
              <Link to="/login" className="link">
                Đăng nhập
              </Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;

import "./register.scss";
// import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Image,
  Upload,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import publicApi from "api/publicApi";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import loginApi from "api/loginApi";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import RegisterIng from "assets/image/register-img.jpg";

const Register = () => {
  const navigate = useNavigate();
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
  }, []);
  const onFinish = (values) => {
    // console.log(values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("phone", "0" + values.phone);
    formData.append("address", values.address);
    formData.append("email", values.email);
    formData.append("password", values.password);
    if (values.business_register) {
      switch (values.business_type) {
        case "hotel":
          formData.append("role", "hotel_admin");
          break;
        case "restaurant":
          formData.append("role", "restaurant_admin");
          break;
        case "shop":
          formData.append("role", "food_admin");
          break;
      }
      formData.append("business_type", values.register_type);
    } else formData.append("role", "user");

    if (fileList[0]?.originFileObj) {
      formData.append("front_image", fileList[0].originFileObj);
    }
    if (fileList1[0]?.originFileObj) {
      formData.append("back_image", fileList1[0].originFileObj);
    }

    const register = async () => {
      try {
        const response = await loginApi.register(formData);
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
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
    register();
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
  const beforeUpload = (file) => {
    setFileList([...fileList, file]);
    return false;
  };
  const beforeUpload1 = (file) => {
    setFileList1([...fileList1, file]);
    return false;
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      +84
    </Form.Item>
  );

  // const handleCheck = (e) => {
  //   setCheck(e.target.checked);
  // };
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
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handlePreview1 = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage1(file.url || file.preview);
    setPreviewOpen1(true);
  };
  const handleChange1 = ({ fileList: newFileList1 }) => {
    setFileList1(newFileList1);
  };
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
    <div className="register-wrap-container">
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
                label={
                  <Tooltip title="Số điện thoại từ 9-11 chữ số">
                    <span>SĐT</span>
                  </Tooltip>
                }
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập số điện thoại!",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Số điện thoại chỉ được chứa chữ số!",
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
                  // onChange={onChange}
                  // onSearch={onSearch}
                  options={options}
                />
              </Form.Item>
            </div>

            <div className="register-wrap-item">
              <Form.Item
                className="register-item"
                label={
                  <Tooltip title="Mật khẩu có 6-16 ký tự, ít nhất có 1 ký tự đặc biệt">
                    <span>Mật khẩu</span>
                  </Tooltip>
                }
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập mật khẩu!",
                  },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,16}$/,
                    message:
                      "Mật khẩu phải có 6-16 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!",
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

            {/* <Form.Item
              name="business_register"
              valuePropName="checked"
              onChange={handleCheck}
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Checkbox>Đăng ký kinh doanh</Checkbox>
            </Form.Item> */}

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
                    // onSearch={onSearch}
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
                    // onChange={onChange}
                    // onSearch={onSearch}
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
                    beforeUpload={beforeUpload}
                  >
                    {Array.isArray(fileList) && fileList.length >= 1
                      ? null
                      : uploadButton}
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
                    beforeUpload={beforeUpload1}
                  >
                    {Array.isArray(fileList1) && fileList1.length >= 1
                      ? null
                      : uploadButton}
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
              <div
                className="register-had-account"
                style={{ marginTop: "16px" }}
              >
                Bạn đã có tài khoản?{" "}
                <Link to="/login" className="link">
                  Đăng nhập
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
        <ToastContainer />
      </div>
      <div className="register-img">
        <img
          src={RegisterIng}
          alt="register-bg"
          style={{ width: "100%", borderRadius: "30px" }}
        />
      </div>
    </div>
  );
};

export default Register;

import "./personalInfo.scss";
import { Input, Form, Select, Button, Upload, Image } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import publicApi from "api/publicApi";
import { PlusOutlined } from "@ant-design/icons";
import userApi from "api/userApi";
import {
  faSignature,
  faPhone,
  faUser,
  faLocationCrosshairs,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "antd/es/form/Form";
const PersonalInfo = () => {
  const [form] = useForm();
  const [provinces, setProvinces] = useState([]);
  const [user, setUser] = useState({});
  const { id } = useParams();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await userApi.getUserInfo(id);
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };
    getInfo();
  }, [id]);
  useEffect(() => {
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
  }, [user, form]);

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
    if (user.ava) {
      setFileList([
        {
          uid: "-1",
          name: "avatar.png",
          status: "done",
          url: `http://localhost:8000/uploads/${user.ava}`,
        },
      ]);
    } else {
      setFileList([
        {
          uid: "-1",
          name: "avatar.png",
          status: "done",
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSmfNz_xBm4r3YYDB-3kixci-vNwsnhQuHS4KmSGDkzpVGQqt8V7LM7jXjbRVZThCmvGQ&usqp=CAU",
        },
      ]);
    }
  }, []);
  const options = provinces.map((item) => {
    return { value: item.name, label: item.name };
  });
  const beforeUpload = (file) => {
    setFileList([...fileList, file]);
    return false;
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
  const handleChangeAva = () => {
    const formData = new FormData();
    if (fileList[0]?.originFileObj) {
      formData.append("file", fileList[0].originFileObj);
    }
    const updateAvatar = async () => {
      try {
        const response = await userApi.updateAva(id, formData);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    updateAvatar();
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
  const onFinish = (values) => {
    // console.log(values);
    const updateUserInformation = async () => {
      try {
        const response = await userApi.updateInfo(id, values);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    updateUserInformation();
  };
  return (
    <div className="container-wrap-padding">
      <div className="header2 register-header">Thông tin cá nhân</div>
      <div className="personal-wrap">
        <div className="personal-container">
          <div className="personal-ava">
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
            <Button
              className="button"
              style={{ marginTop: "16px" }}
              onClick={handleChangeAva}
            >
              Cập nhật ảnh
            </Button>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </div>
          <div className="personal-info">
            <Form
              form={form}
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              className="personal-form"
              onFinish={onFinish}
              initialValues={{
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
              }}
            >
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: "Hãy nhập tên mới" }]}
              >
                <Input prefix={<FontAwesomeIcon icon={faSignature} />} />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true }]}
              >
                <Input disabled prefix={<FontAwesomeIcon icon={faUser} />} />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Hãy nhập số điện thoại mới" },
                  {
                    pattern: /^\d+$/,
                    message: "Số điện thoại chỉ bao gồm chữ số",
                  },
                  {
                    min: 9,
                    message: "Số điện thoại yêu cầu ít nhất 9 số",
                  },
                  {
                    max: 11,
                    message: "Số điện thoại không được vượt qua 11 số",
                  },
                ]}
              >
                <Input prefix={<FontAwesomeIcon icon={faPhone} />} />
              </Form.Item>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: "Hãy chọn địa chỉ mới" }]}
              >
                <Select
                  prefix={<FontAwesomeIcon icon={faLocationCrosshairs} />}
                  showSearch
                  optionFilterProp="label"
                  options={options}
                />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  className="button personal-info-btn"
                >
                  Cập nhật thông tin
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;

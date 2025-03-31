import "./schedule-edit.scss";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Input, DatePicker, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import repoApi from "api/repoApi";
const ScheduleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = useForm();
  const [repo, setRepo] = useState([]);
  const { RangePicker } = DatePicker;
  const dateFormat = "YYYY/MM/DD";
  const { TextArea } = Input;

  useEffect(() => {
    const getFullRepo = async () => {
      try {
        const response = await repoApi.getADemoRepo(id);
        setRepo(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFullRepo();
  }, [id]);

  useEffect(() => {
    form.setFieldsValue({
      name: repo.name,
      description: repo.description,
      destination: "Tỉnh Hà Giang",
      numberPeople: repo.numberPeople,
      rangeDate:
        repo.startDate && repo.endDate
          ? [dayjs(repo.startDate), dayjs(repo.endDate)]
          : [],
    });
  }, [repo, form]);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const handleRepoEdit = () => {
    navigate(`/schedule/${id}`);
  };
  return (
    <div className="schedule-edit-background">
      <div className="schedule-edit-overlay"></div>
      <div
        style={{
          float: "right",
        }}
      >
        <Button className="button" onClick={handleRepoEdit}>
          Chỉnh sửa lịch trình
        </Button>
      </div>
      <div className="schedule-edit-content">
        <div className="header2 register-header">CHỈNH SỬA MÔ TẢ LỘ TRÌNH</div>
        <div className="register-form-container">
          <Form
            form={form}
            name="basic"
            className="edit-trip-form"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            onFinish={onFinish}
          >
            <div className="register-wrap-item">
              <Form.Item
                className="register-item"
                label="Tên lộ trình"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên lộ trình!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className="register-item"
                name="description"
                label="Mô tả lộ trình"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập mô tả",
                  },
                  {
                    max: 500,
                    message: "Mô tả quá dài, tối đa 500 ký tự!",
                  },
                ]}
              >
                <TextArea rows={3} placeholder="Nhập mô tả ở đây" />
              </Form.Item>
            </div>

            <Form.Item
              className="register-item"
              label="Điểm đến"
              name="destination"
              rules={[
                {
                  required: true,
                  message: "Hãy chọn điểm đến!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn tỉnh/thành phố"
                optionFilterProp="label"
                disabled
              />
            </Form.Item>

            <div className="register-wrap-item">
              <Form.Item
                className="register-item"
                name="numberPeople"
                label="Số người"
                rules={[
                  {
                    type: "number",
                    min: 1,
                    message: "Số người phải lớn hơn 0!",
                  },
                  {
                    required: true,
                    message: "Hãy nhập số người",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                className="register-item"
                name="rangeDate"
                label="Ngày bắt đầu - kết thúc"
                rules={[
                  {
                    required: true,
                    message: "Chọn ngày bắt đầu - kết thúc",
                  },
                ]}
              >
                <RangePicker format={dateFormat} />
              </Form.Item>
            </div>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit" className="button">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEdit;

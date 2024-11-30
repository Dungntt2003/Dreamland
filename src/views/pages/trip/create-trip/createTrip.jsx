import "./createTrip.scss";
import { Button, Form, Input, DatePicker, InputNumber } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import repoApi from "api/repoApi";
import { useAuth } from "context/authContext";
import { ToastContainer, toast } from "react-toastify";
const CreateTrip = () => {
  const { id } = useAuth();
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const { TextArea } = Input;
  const dateFormat = "YYYY/MM/DD";
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinish = (value) => {
    const startDate = value.rangeDate[0]
      ? value.rangeDate[0].format("YYYY-MM-DD")
      : null;
    const endDate = value.rangeDate[1]
      ? value.rangeDate[1].format("YYYY-MM-DD")
      : null;
    const params = {
      name: value.name,
      description: value.description,
      numberPeople: value.numberPeople,
      startDate: startDate,
      endDate: endDate,
      user_id: id,
    };
    const addNewRepo = async () => {
      try {
        const response = await repoApi.createARepo(params);
        console.log(response);
        toast.success("Tạo lộ trình mới thành công", {
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
          navigate(`/create-trip-step1/${response.data.data.id}`);
        }, 2000);
      } catch (error) {
        toast.error("Đã xảy ra lỗi, vui lòng thử lại", {
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
    addNewRepo();
  };
  return (
    <div className="register-container" style={{ marginTop: "134px" }}>
      <div className="header2 register-header">TẠO LỘ TRÌNH DU LỊCH</div>
      <div className="register-form-container">
        <Form
          name="basic"
          className="create-trip-form"
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
              <RangePicker
                defaultValue={[dayjs(), dayjs()]}
                format={dateFormat}
              />
            </Form.Item>
          </div>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" className="button">
              Tạo lộ trình
            </Button>
          </Form.Item>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateTrip;

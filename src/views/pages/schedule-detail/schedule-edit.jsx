import "./schedule-edit.scss";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Input, DatePicker, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import repoApi from "api/repoApi";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ToastContainer, toast } from "react-toastify";
import EditRepo from "assets/image/edit-repo.png";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const ScheduleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = useForm();
  const [repo, setRepo] = useState([]);
  const [plan, setPlan] = useState([]);
  const { RangePicker } = DatePicker;
  const dateFormat = "YYYY/MM/DD";
  const { TextArea } = Input;

  useEffect(() => {
    const getFullRepo = async () => {
      try {
        const response = await repoApi.getADemoRepo(id);
        setRepo(response.data.data);
        setPlan(response.data.data.plan);
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
      destination: repo.destination,
      numberPeople: repo.numberPeople,
      rangeDate:
        repo.startDate && repo.endDate
          ? [dayjs(repo.startDate), dayjs(repo.endDate)]
          : [],
    });
  }, [repo, form]);

  const onFinish = (values) => {
    const filteredPlans = plan.filter((item) => {
      const [dateStr, timeRange] = item.label.split(", ");
      const [startTimeStr, endTimeStr] = timeRange.split(" - ");
      const start = dayjs(`${dateStr} ${startTimeStr}`, "DD/MM/YYYY HH:mm");
      const end = dayjs(`${dateStr} ${endTimeStr}`, "DD/MM/YYYY HH:mm");

      const [rangeStart, rangeEnd] = values.rangeDate;
      const extendedRangeEnd = rangeEnd.add(1, "day");
      return (
        start.isSameOrAfter(rangeStart) && end.isSameOrBefore(extendedRangeEnd)
      );
    });
    // console.log(filteredPlans);
    const startDate = values.rangeDate[0]
      ? values.rangeDate[0].format("YYYY-MM-DD")
      : null;
    const endDate = values.rangeDate[1]
      ? values.rangeDate[1].format("YYYY-MM-DD")
      : null;
    const params = {
      name: values.name,
      description: values.description,
      numberPeople: values.numberPeople,
      startDate: startDate,
      endDate: endDate,
      plan: filteredPlans,
    };
    const updateRepoWithPlan = async () => {
      try {
        const response = await repoApi.updatePlan(id, params);

        console.log(response);
        toast.success("Cập nhật mô tả thành công", {
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
          navigate(`/schedule/${id}`);
        }, 2000);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message, {
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
    updateRepoWithPlan();
  };

  const handleRepoEdit = () => {
    navigate(`/schedule/${id}`);
  };
  return (
    <div className="schedule-edit-background">
      <div className="schedule-edit-layout">
        <div className="schedule-img">
          <img src={EditRepo} alt="edit repo" className="schedule-picture" />
        </div>
        <div className="schedule-form">
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
            <div className="header2 register-header schedule-edit-header">
              CHỈNH SỬA MÔ TẢ LỘ TRÌNH
            </div>
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
                  <Input disabled style={{ color: "red" }} />
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
      </div>
      <ToastContainer />
    </div>
  );
};

export default ScheduleEdit;

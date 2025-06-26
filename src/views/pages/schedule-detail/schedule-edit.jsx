import "./schedule-edit.scss";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Input, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import repoApi from "api/repoApi";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import toast, { Toaster } from "react-hot-toast";
import EditRepo from "assets/image/edit-repo.png";
import paymentApi from "api/paymentApi";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const ScheduleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = useForm();
  const [repo, setRepo] = useState([]);
  const [plan, setPlan] = useState([]);
  const [payment, setPayment] = useState([]);
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
    const getPayments = async () => {
      try {
        const response = await paymentApi.getPaymentOfRepo(id);
        setPayment(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPayments();
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
    const oldStart = dayjs(repo.startDate);
    const oldEnd = dayjs(repo.endDate);
    const newStart = values.rangeDate[0];
    const newEnd = values.rangeDate[1];

    const isDisjoint =
      newEnd.isBefore(oldStart, "day") || newStart.isAfter(oldEnd, "day");

    let updatedPlan = [...plan];
    let updatedExperience = repo.experience ? repo.experience : null;

    if (isDisjoint) {
      const diffDays = newStart.diff(oldStart, "day");

      updatedPlan = plan.map((item) => {
        const [dateStr, timeRange] = item.label.split(", ");
        const oldDate = dayjs(dateStr, "DD/MM/YYYY");
        const newDate = oldDate.add(diffDays + 1, "day");
        const newLabel = `${newDate.format("DD/MM/YYYY")}, ${timeRange}`;
        return { ...item, label: newLabel };
      });

      if (repo.experience) {
        const dateRegex = /\d{2}\/\d{2}\/\d{4}/g;
        updatedExperience = repo.experience.replace(dateRegex, (match) => {
          const oldDate = dayjs(match, "DD/MM/YYYY");
          if (!oldDate.isValid()) return match;
          const newDate = oldDate.add(diffDays + 1, "day");
          return newDate.format("DD/MM/YYYY");
        });
      }
    } else {
      updatedPlan = plan.filter((item) => {
        const [dateStr, timeRange] = item.label.split(", ");
        const [startTimeStr, endTimeStr] = timeRange.split(" - ");
        const start = dayjs(`${dateStr} ${startTimeStr}`, "DD/MM/YYYY HH:mm");
        const end = dayjs(`${dateStr} ${endTimeStr}`, "DD/MM/YYYY HH:mm");

        const [rangeStart, rangeEnd] = values.rangeDate;
        const extendedRangeEnd = rangeEnd.add(1, "day");

        return (
          start.isSameOrAfter(rangeStart) &&
          end.isSameOrBefore(extendedRangeEnd)
        );
      });
    }

    const startDate = newStart.format("YYYY-MM-DD");
    const endDate = newEnd.format("YYYY-MM-DD");

    const params = {
      name: values.name,
      description: values.description,
      numberPeople: values.numberPeople,
      startDate,
      endDate,
      plan: updatedPlan,
      experience: updatedExperience,
    };
    // console.log("Params to update:", params);
    const isDateChanged =
      !newStart.isSame(oldStart, "day") || !newEnd.isSame(oldEnd, "day");

    const updateRepoWithPlan = async () => {
      try {
        const response = await repoApi.updatePlan(id, params);
        toast.success("Cập nhật mô tả thành công");
        setTimeout(() => navigate(`/schedule-detail/${id}`), 2000);
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi cập nhật lịch trình");
      }
    };

    if (payment.some((item) => item.result === "success" && isDateChanged)) {
      toast.error("Không thể chỉnh sửa lịch trình đã thanh toán");
      return;
    } else {
      updateRepoWithPlan();
    }
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
      <Toaster />
    </div>
  );
};

export default ScheduleEdit;

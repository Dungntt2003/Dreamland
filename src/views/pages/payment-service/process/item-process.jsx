import "./enter-payment.scss";
import {
  Steps,
  Button,
  Calendar,
  Form,
  Input,
  Checkbox,
  TimePicker,
} from "antd";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import repoApi from "api/repoApi";
import userApi from "api/userApi";
import entertainmentApi from "api/entertainmentApi";
import restaurantApi from "api/restaurantApi";
import {
  handlePayment,
  handleCreatePayment,
} from "components/payment/handlePayment";
import {
  faCartShopping,
  faCircleInfo,
  faCreditCard,
  faMinus,
  faPlus,
  faSignature,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import formatCurrency from "utils/formatCurrency";
import dayjs from "dayjs";
import { useAuth } from "context/authContext";
import { useForm } from "antd/es/form/Form";
import RestaurantDefaultImg from "assets/image/restaurant-default.png";

const { TextArea } = Input;

const steps = [
  {
    title: "Chọn đơn hàng",
    icon: <FontAwesomeIcon icon={faCartShopping} />,
  },
  {
    title: "Điền thông tin",
    icon: <FontAwesomeIcon icon={faCircleInfo} />,
  },
  {
    title: "Thanh toán",
    icon: <FontAwesomeIcon icon={faCreditCard} />,
  },
];
const formatTime = "HH:mm";

const ItemPaymentProcess = ({ type }) => {
  const navigate = useNavigate();
  const { id } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const repoId = queryParams.get("repoId");
  const serviceId = queryParams.get("serviceId");
  const [current, setCurrent] = useState(0);
  const [form] = useForm();
  const [user, setUser] = useState({});
  const [item, setItem] = useState({});
  const [countAdult, setCountAdult] = useState(0);
  const [countChild, setCountChild] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [dataForm, setDataForm] = useState({});
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);

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
    });
  }, [user, form]);

  useEffect(() => {
    const getRepo = async () => {
      try {
        const response = await repoApi.getADemoRepo(repoId);
        let itemResponse = {};
        if (type === "entertainment") {
          itemResponse = await entertainmentApi.getEntertainmentDetail(
            serviceId
          );
        }
        if (type === "restaurant") {
          itemResponse = await restaurantApi.getRestaurantDetail(serviceId);
        }
        const matchedActivity = response.data.data.plan.find((item) =>
          item.children.includes(itemResponse.data.data.name)
        );
        const result = {
          ...itemResponse.data.data,
          ...(matchedActivity && {
            numberPeople: response.data.data.numberPeople,
            label: matchedActivity.label,
            children: matchedActivity.children,
          }),
        };
        setItem(result);
        setCountAdult(result.numberPeople);
        const datePart = result.label.split(",")[0];
        const timePart = result.label.split(",")[1];
        const startTime = timePart.split(" - ")[0];
        setStartTime(startTime);
        // console.log(startTime);
        setDate(datePart);
      } catch (error) {
        console.log(error);
      }
    };
    getRepo();
  }, [repoId, serviceId, type]);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleGetDataForm = async () => {
    try {
      const values = await form.validateFields();
      //   console.log("Success:", values);
      setDataForm(values);
      setCurrent(current + 1);
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    }
  };

  const handleIncrease = () => {
    setCountAdult((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setCountAdult((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handlePlus = () => {
    setCountChild((prev) => prev + 1);
  };

  const handleMinus = () => {
    setCountChild((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return Number(priceStr.replace(/[^\d]/g, ""));
  };

  const handlePay = async () => {
    const data = {
      amount: Math.round((countAdult + countChild) * parsePrice(item.price)),
      serviceId: serviceId,
      repoId: repoId,
    };
    const dataPayment = {
      service_id: serviceId,
      repository_id: repoId,
      name: dataForm.name,
      email: dataForm.email,
      phone: dataForm.phone,
    };
    if (type === "entertainment") {
      const paymentEnter = {
        ...dataPayment,
        amount: Math.round((countAdult + countChild) * parsePrice(item.price)),
        countAdult: countAdult,
        countChild: countChild,
        orderDate: date,
        service_type: "entertainment",
        result: "pending",
      };
      const response = await handleCreatePayment(paymentEnter);
      console.log(response);
      handlePayment(data);
    }
    if (type === "restaurant") {
      const paymentRes = {
        ...dataPayment,
        note: dataForm.note,
        countAdult: countAdult,
        countChild: countChild,
        orderDate: date,
        service_type: "restaurant",
        result: "success",
      };
      const response = await handleCreatePayment(paymentRes);
      console.log(response);
      navigate(`/order-restaurant?repoId=${repoId}&serviceId=${serviceId}`);
    }
  };

  const handleReturn = () => {
    navigate(`/schedule-detail/${repoId}`);
  };

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "12px",
        }}
      >
        <Button className="button" onClick={handleReturn}>
          Quay về lộ trình
        </Button>
      </div>
      <div className="payment-progress-bar" style={{ padding: "4px 32px" }}>
        <Steps current={current} items={steps} />
      </div>
      <div className="payment-progress-content">
        <div
          style={{
            marginTop: 16,
          }}
        >
          {current === 0 && (
            <div className="booking-container">
              <div className="booking-wrapper">
                <div className="booking-header">
                  <div className="venue-name">{item.name}</div>
                  {type === "restaurant" && (
                    <div className="venue-phone">
                      <FontAwesomeIcon icon={faPhone} />
                      {item.phone}
                    </div>
                  )}
                </div>

                <div className="booking-info-tags">
                  <div className="info-tags-wrapper">
                    {type === "entertainment" && (
                      <>
                        <div className="enter-payment-info">Không hoàn hủy</div>
                        <div className="enter-payment-info">
                          Xác nhận tức thời
                        </div>
                        <div className="enter-payment-info">
                          Hiệu lực vào ngày đã chọn
                        </div>
                        <div className="enter-payment-info">
                          Vào cổng bằng vé điện tử
                        </div>
                      </>
                    )}
                    {type === "restaurant" && (
                      <>
                        <div className="enter-payment-info">
                          Đặt bàn trước để nhanh chóng có chỗ ngồi
                        </div>
                        <div className="enter-payment-info">
                          Đặt bàn qua web
                        </div>
                        <div className="enter-payment-info">Gọi ngay SĐT</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="booking-content">
                  <div className="content-title">Chọn ngày và số lượng</div>

                  <div className="booking-form-row">
                    <div className="date-selection">
                      <div className="section-title">
                        Vui lòng chọn ngày sử dụng
                      </div>
                      <div className="calendar-wrapper">
                        <Calendar
                          fullscreen={false}
                          value={dayjs(date, "DD/MM/YYYY")}
                          onPanelChange={() => {}}
                        />
                      </div>
                    </div>

                    <div className="quantity-selection">
                      <div className="section-title">Chọn số lượng</div>

                      <div className="quantity-row">
                        <span className="quantity-label">
                          Người lớn {type === "entertainment" && item.price}
                        </span>
                        <div className="quantity-controls">
                          <span
                            className="payment-enter-btn"
                            onClick={handleDecrease}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </span>
                          <span className="payment-enter-btn">
                            {countAdult}
                          </span>
                          <span
                            className="payment-enter-btn"
                            onClick={handleIncrease}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </span>
                        </div>
                      </div>

                      <div className="quantity-row">
                        <span className="quantity-label">
                          Trẻ em {type === "entertainment" && item.price}
                        </span>
                        <div className="quantity-controls">
                          <span
                            className="payment-enter-btn"
                            onClick={handleMinus}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </span>
                          <span className="payment-enter-btn">
                            {countChild}
                          </span>
                          <span
                            className="payment-enter-btn"
                            onClick={handlePlus}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </span>
                        </div>
                      </div>
                    </div>

                    {type === "restaurant" && (
                      <div className="time-selection">
                        <div className="section-title">Chọn thời gian</div>
                        <TimePicker
                          value={dayjs(startTime, formatTime)}
                          format={formatTime}
                        />
                      </div>
                    )}

                    {type === "entertainment" && (
                      <div className="total-section">
                        <div className="total-price">
                          <div className="total-label">Tổng tiền:</div>
                          <div className="total-amount">
                            {formatCurrency(
                              Math.round(
                                (countAdult + countChild) *
                                  parsePrice(item.price)
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="booking-actions">
                  <Button onClick={next} type="primary" className="button">
                    Tiếp tục
                  </Button>
                </div>
              </div>
            </div>
          )}
          {current === 1 && (
            <div className="step2-container">
              <div className="step2-main-wrapper">
                <div className="step2-content">
                  <div className="step2-form-section">
                    <div className="step2-title">Điền thông tin</div>

                    <div>
                      <div className="step2-section-title">
                        Thông tin đơn hàng
                      </div>
                      <div className="step2-order-card">
                        <img
                          src={
                            item.images[0]
                              ? item.images[0]
                              : RestaurantDefaultImg
                          }
                          alt="anh enter"
                          className="step2-order-image"
                        />
                        <div className="step2-order-details">
                          <div className="step2-order-name">{item.name}</div>
                          {type === "restaurant" && (
                            <div className="step2-order-info">
                              SDT: {item.phone}
                            </div>
                          )}
                          {type === "entertainment" && (
                            <div className="step2-order-info">
                              Giá: {item.price}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="step2-section-title">
                        Thông tin liên lạc
                      </div>
                      <p className="step2-contact-description">
                        Chúng tôi sẽ thông báo mọi thay đổi về đơn hàng cho bạn
                      </p>
                      <div>
                        <Form
                          form={form}
                          name="basic"
                          labelCol={{
                            span: 4,
                          }}
                          wrapperCol={{
                            span: 16,
                          }}
                          className="step2-form"
                          initialValues={{
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                          }}
                        >
                          <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[
                              { required: true, message: "Hãy nhập tên mới" },
                            ]}
                          >
                            <Input
                              prefix={<FontAwesomeIcon icon={faSignature} />}
                            />
                          </Form.Item>
                          <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true }]}
                          >
                            <Input
                              // disabled
                              prefix={<FontAwesomeIcon icon={faUser} />}
                            />
                          </Form.Item>
                          <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                              {
                                required: true,
                                message: "Hãy nhập số điện thoại mới",
                              },
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
                                message:
                                  "Số điện thoại không được vượt qua 11 số",
                              },
                            ]}
                          >
                            <Input
                              prefix={<FontAwesomeIcon icon={faPhone} />}
                            />
                          </Form.Item>
                          {type === "restaurant" && (
                            <Form.Item name="note" label="Ghi chú">
                              <TextArea
                                rows={4}
                                placeholder="Yêu cầu đặc biệt (dị ứng, vị trí bàn)"
                                className="step2-textarea"
                              />
                            </Form.Item>
                          )}
                        </Form>
                      </div>
                    </div>

                    <div className="step2-checkbox-group">
                      <div className="step2-checkbox">
                        <Checkbox>
                          Tôi muốn là người đầu tiên nhận các ưu đãi độc quyền
                          qua email và tin nhắn
                        </Checkbox>
                      </div>
                      <p className="step2-checkbox">
                        <Checkbox
                          onChange={(e) => setIsChecked(e.target.checked)}
                        >
                          Tôi đã hiểu và đồng ý với Điều khoản sử dụng chung và
                          Chính sách quyền riêng tư của SmartTrip
                        </Checkbox>
                      </p>

                      {type === "restaurant" && (
                        <p className="step2-warning-box">
                          Bạn có thể đặt bàn nhanh chóng hơn khi gọi đặt bàn{" "}
                          <span className="step2-phone-highlight">
                            {item.phone}
                          </span>
                        </p>
                      )}

                      <p className="step2-warning-box">
                        Vui lòng điền thông tin chính xác. Một khi đã gửi thông
                        tin, bạn sẽ không thay đổi được.
                      </p>
                    </div>
                  </div>

                  <div className="step2-summary-section">
                    <div className="step2-summary-title">{item.name}</div>
                    <hr className="step2-divider" />
                    <div className="step2-summary-details">
                      <div className="step2-summary-row">
                        <div className="step2-summary-label">Ngày:</div>
                        <div className="step2-summary-value">{date}</div>
                      </div>
                      {type === "restaurant" && (
                        <div className="step2-summary-row">
                          <div className="step2-summary-label">Giờ:</div>
                          <div className="step2-summary-value">{startTime}</div>
                        </div>
                      )}
                      <div className="step2-summary-row">
                        <div className="step2-summary-label">Đơn vị:</div>
                        <div className="step2-summary-value">
                          Người lớn * {countAdult} <br />
                          Trẻ em * {countChild}
                        </div>
                      </div>
                    </div>
                    <hr className="step2-divider" />
                    {type === "entertainment" && (
                      <div className="step2-total-row">
                        <div className="step2-total-label">Tổng cộng: </div>
                        <div className="step2-total-amount">
                          {formatCurrency(
                            Math.round(
                              (countAdult + countChild) * parsePrice(item.price)
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="step2-button-group">
                  <div className="booking-actions">
                    <Button type="primary" onClick={prev} className="button">
                      Trở lại
                    </Button>
                  </div>
                  <div className="booking-actions">
                    <Button
                      type="primary"
                      onClick={handleGetDataForm}
                      className="step2-button step2-next-button"
                      disabled={!isChecked}
                    >
                      Tiếp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {current === 2 && (
            <>
              <div className="payment-confirmation-container">
                <div className="payment-confirmation-wrapper">
                  <div className="payment-confirmation-card">
                    <div className="payment-confirmation-title">
                      {item.name}
                    </div>
                    <div className="confirm-payment-enter">
                      <span className="confirm-payment-label">
                        {type === "entertainment" && "Ngày đặt vé"}
                        {type === "restaurant" && "Ngày đặt bàn"}
                      </span>
                      <span className="confirm-payment-value">{date}</span>
                    </div>

                    {type === "restaurant" && (
                      <>
                        <div className="confirm-payment-enter">
                          <span className="confirm-payment-label">Giờ</span>
                          <span className="confirm-payment-value">
                            {startTime}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="confirm-payment-enter">
                      <span className="confirm-payment-label">Đơn vị</span>
                      <span className="confirm-payment-value">
                        Người lớn * {countAdult} <br />
                        Trẻ em * {countChild}
                      </span>
                    </div>
                    <div className="confirm-payment-enter">
                      <span className="confirm-payment-label">Họ và tên</span>
                      <span className="confirm-payment-value">
                        {dataForm.name}
                      </span>
                    </div>
                    <div className="confirm-payment-enter">
                      <span className="confirm-payment-label">Email</span>
                      <span className="confirm-payment-value">
                        {dataForm.email}
                      </span>
                    </div>
                    <div className="confirm-payment-enter">
                      <span className="confirm-payment-label">SĐT</span>
                      <span className="confirm-payment-value">
                        {dataForm.phone}
                      </span>
                    </div>
                    {type === "restaurant" && dataForm.note !== null && (
                      <>
                        <div className="confirm-payment-enter">
                          <span className="confirm-payment-label">Ghi chú</span>
                          <span className="confirm-payment-value">
                            {dataForm.note}
                          </span>
                        </div>
                      </>
                    )}
                    {type === "entertainment" && (
                      <div className="confirm-payment-enter">
                        <span className="confirm-payment-label">Tổng cộng</span>
                        <span className="confirm-payment-value confirm-payment-total">
                          {formatCurrency(
                            Math.round(
                              (countAdult + countChild) * parsePrice(item.price)
                            )
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="payment-buttons-container">
                    <div className="booking-actions">
                      <Button type="primary" onClick={prev} className="button">
                        Trở lại
                      </Button>
                    </div>
                    <div className="booking-actions">
                      <Button
                        type="primary"
                        onClick={handlePay}
                        className="button"
                        disabled={!isChecked}
                      >
                        {type === "entertainment" && "Thanh toán"}
                        {type === "restaurant" && "Đặt bàn"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemPaymentProcess;

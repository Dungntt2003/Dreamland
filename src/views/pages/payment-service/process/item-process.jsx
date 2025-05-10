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
import handlePayment from "components/payment/handlePayment";
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

  const handlePay = () => {
    const data = {
      amount: (countAdult + countChild) * parsePrice(item.price),
      orderInfo: "Thanh toán vé vui chơi",
    };
    if (type === "entertainment") {
      handlePayment(data);
    }
    if (type === "restaurant") {
      navigate("/order-restaurant");
    }
  };

  return (
    <div style={{ padding: "16px" }}>
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
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "30px",
                      color: "var(--primary-color)",
                    }}
                  >
                    {item.name}
                  </div>
                  {type === "restaurant" && (
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "20px",
                        color: "red",
                      }}
                    >
                      <FontAwesomeIcon icon={faPhone} />
                      {item.phone}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ display: "flex" }}>
                      {type === "entertainment" && (
                        <>
                          <div className="enter-payment-info">
                            Không hoàn hủy
                          </div>
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
                  <div
                    style={{
                      background: "var(--background-color)",
                      margin: "16px",
                      borderRadius: "10px",
                      padding: "4px",
                    }}
                  >
                    <div
                      style={{
                        margin: "16px 0",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      Chọn ngày và số lượng
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <div style={{ width: "30%" }}>
                        <div style={{ fontWeight: "bold" }}>
                          Vui lòng chọn ngày sử dụng
                        </div>
                        <div
                          style={{
                            width: "90%",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            padding: "6px 12px",
                          }}
                        >
                          <Calendar
                            fullscreen={false}
                            // defaultValue={parseTimeString(enter.label)}
                            value={dayjs(date, "DD/MM/YYYY")}
                            // headerRender={() => null}
                            onPanelChange={() => {}}
                          />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontWeight: "bold" }}>Chọn số lượng</div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            margin: "16px 0",
                          }}
                        >
                          <span>
                            Người lớn {type === "entertainment" && item.price}
                          </span>
                          <div>
                            <span className="payment-enter-btn">
                              <FontAwesomeIcon
                                icon={faMinus}
                                onClick={handleDecrease}
                              />
                            </span>
                            <span className="payment-enter-btn">
                              {countAdult}
                            </span>
                            <span className="payment-enter-btn">
                              <FontAwesomeIcon
                                icon={faPlus}
                                onClick={handleIncrease}
                              />
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <span>
                            Trẻ em {type === "entertainment" && item.price}
                          </span>
                          <div>
                            <span className="payment-enter-btn">
                              <FontAwesomeIcon
                                icon={faMinus}
                                onClick={handleMinus}
                              />
                            </span>
                            <span className="payment-enter-btn">
                              {countChild}
                            </span>
                            <span className="payment-enter-btn">
                              <FontAwesomeIcon
                                icon={faPlus}
                                onClick={handlePlus}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      {type === "restaurant" && (
                        <>
                          <div>
                            <div
                              style={{
                                fontWeight: "bold",
                                marginBottom: "16px",
                              }}
                            >
                              Chọn thời gian
                            </div>
                            <TimePicker
                              value={dayjs(startTime, formatTime)}
                              format={formatTime}
                            />
                          </div>
                        </>
                      )}
                      <div style={{ width: "20%" }}>
                        {type === "entertainment" && (
                          <>
                            Tổng tiền:
                            {formatCurrency(
                              (countAdult + countChild) * parsePrice(item.price)
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={next}
                    type="primary"
                    className="button"
                    style={{ float: "right" }}
                  >
                    Tiếp tục
                  </Button>
                </div>
              </div>
            </>
          )}
          {current === 1 && (
            <>
              <div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{ width: "60%", height: "100%", overflowY: "auto" }}
                  >
                    <div
                      style={{
                        fontSize: "30px",
                        color: "var(--primary-color)",
                      }}
                    >
                      Điền thông tin
                    </div>
                    <div>
                      <div className="payment-info-title">
                        Thông tin đơn hàng
                      </div>
                      <div
                        style={{
                          margin: "16px 0",
                          display: "flex",
                          padding: "8px",
                          border: "1px solid #ccc",
                          borderRadius: "10px",
                        }}
                      >
                        <img
                          src={
                            item.images[0]
                              ? item.images[0]
                              : RestaurantDefaultImg
                          }
                          alt="anh enter"
                          style={{
                            width: "200px",
                            borderRadius: "10px",
                            margin: "0 16px",
                          }}
                        />
                        <div>
                          <div>{item.name}</div>
                          {type === "restaurant" && (
                            <div>SDT: {item.phone}</div>
                          )}
                          {type === "entertainment" && (
                            <div>Giá: {item.price}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="payment-info-title">
                        Thông tin liên lạc
                      </div>
                      <p style={{ fontSize: "14px", color: "#333" }}>
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
                          style={{
                            minWidth: 600,
                            margin: "16px 0",
                          }}
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
                              />
                            </Form.Item>
                          )}
                        </Form>
                      </div>
                    </div>
                    <div>
                      <div>
                        <Checkbox>
                          Tôi muốn là người đầu tiên nhận các ưu đãi độc quyền
                          qua email và tin nhắn
                        </Checkbox>
                      </div>
                      <p>
                        <Checkbox
                          onChange={(e) => setIsChecked(e.target.checked)}
                        >
                          Tôi đã hiểu và đồng ý với Điều khoản sử dụng chung và
                          Chính sách quyền riêng tư của SmartTrip
                        </Checkbox>
                      </p>
                      {type === "restaurant" && (
                        <p
                          style={{
                            padding: "4px 8px",
                            background: "#fcf3de",
                            border: "1px solid red",
                            borderRadius: "10px",
                            width: "fit-content",
                            fontSize: "14px",
                          }}
                        >
                          Bạn có thể đặt bàn nhanh chóng hơn khi gọi đặt bàn{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {item.phone}
                          </span>
                        </p>
                      )}
                      <p
                        style={{
                          padding: "4px 8px",
                          background: "#fcf3de",
                          border: "1px solid red",
                          borderRadius: "10px",
                          width: "fit-content",
                          fontSize: "14px",
                        }}
                      >
                        Vui lòng điền thông tin chính xác. Một khi đã gửi thông
                        tin, bạn sẽ không thay đổi được.
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "40%",
                      padding: "54px",
                      position: "sticky",
                      height: "fit-content",
                      top: "600",
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                      {item.name}
                    </div>
                    <hr />
                    <div style={{ color: "#7e7c79", fontSize: "14px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>Ngày:</div>
                        <div>{date}</div>
                      </div>
                      {type === "restaurant" && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>Giờ:</div>
                          <div>{startTime}</div>
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>Đơn vị:</div>
                        <div>
                          Người lớn * {countAdult} <br />
                          Trẻ em * {countChild}
                        </div>
                      </div>
                    </div>
                    <hr />
                    {type === "entertainment" && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>Tổng cộng: </div>
                        <div style={{ color: "red" }}>
                          {formatCurrency(
                            (countAdult + countChild) * parsePrice(item.price)
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button type="primary" onClick={prev} className="button">
                    Trở lại
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleGetDataForm}
                    className="button"
                    disabled={!isChecked}
                  >
                    Tiếp
                  </Button>
                </div>
              </div>
            </>
          )}
          {current === 2 && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  minWidth: "50%",
                }}
              >
                <div>
                  <div
                    style={{
                      padding: "16px 32px",
                      backgroundColor: "var(--background-color)",
                      borderRadius: "54px",
                      border: "1px solid var(--primary-color)",
                      marginBottom: "24px",
                      minWidth: "600px",
                    }}
                  >
                    <div style={{ fontSize: "20px", fontWeight: "bold" }}>
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
                        <span
                          className="confirm-payment-label"
                          style={{ color: "red" }}
                        >
                          Tổng cộng
                        </span>
                        <span style={{ fontSize: "20px", color: "red" }}>
                          {formatCurrency(
                            (countAdult + countChild) * parsePrice(item.price)
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button type="primary" onClick={prev} className="button">
                      Trở lại
                    </Button>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemPaymentProcess;

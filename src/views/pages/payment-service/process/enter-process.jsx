import "./enter-payment.scss";
import { Steps, Button, Calendar, Form, Input, Checkbox } from "antd";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import repoApi from "api/repoApi";
import userApi from "api/userApi";
import entertainmentApi from "api/entertainmentApi";
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

const parseTimeString = (str) => {
  const [datePart, timeRange] = str.split(", ");
  const date = dayjs(datePart, "DD/MM/YYYY");
  return date;
};

const EnterProcess = () => {
  const { id } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const repoId = queryParams.get("repoId");
  const serviceId = queryParams.get("serviceId");
  const [current, setCurrent] = useState(0);
  const [form] = useForm();
  const [user, setUser] = useState({});
  const [enter, setEnter] = useState({});
  const [countAdult, setCountAdult] = useState(0);
  const [countChild, setCountChild] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

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
        const enterRes = await entertainmentApi.getEntertainmentDetail(
          serviceId
        );
        const matchedActivity = response.data.data.plan.find((item) =>
          item.children.includes(enterRes.data.data.name)
        );
        const result = {
          ...enterRes.data.data,
          ...(matchedActivity && {
            numberPeople: response.data.data.numberPeople,
            label: matchedActivity.label,
            children: matchedActivity.children,
          }),
        };
        setEnter(result);
        setCountAdult(result.numberPeople);
      } catch (error) {
        console.log(error);
      }
    };
    getRepo();
  }, [repoId, serviceId]);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
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
                    {enter.name}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ display: "flex" }}>
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
                            defaultValue={dayjs("20/04/2025", "DD/MM/YYYY")}
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
                          <span>Người lớn {enter.price}</span>
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
                          <span>Trẻ em {enter.price}</span>
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
                      <div style={{ width: "20%" }}>
                        Tổng tiền:
                        {formatCurrency(
                          (countAdult + countChild) * parsePrice(enter.price)
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{ width: "60%", height: "100%", overflowY: "auto" }}
                >
                  <div
                    style={{ fontSize: "30px", color: "var(--primary-color)" }}
                  >
                    Điền thông tin
                  </div>
                  <div>
                    <div className="payment-info-title">Thông tin đơn hàng</div>
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
                        src={enter.images[0]}
                        alt="anh enter"
                        style={{
                          width: "200px",
                          borderRadius: "10px",
                          margin: "0 16px",
                        }}
                      />
                      <div>
                        <div>{enter.name}</div>
                        <div>Giá: {enter.price}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="payment-info-title">Thông tin liên lạc</div>
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
                          <Input prefix={<FontAwesomeIcon icon={faPhone} />} />
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                  <div>
                    <div>
                      <Checkbox>
                        Tôi muốn là người đầu tiên nhận các ưu đãi độc quyền qua
                        email và tin nhắn
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
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button type="primary" onClick={prev} className="button">
                      Trở lại
                    </Button>
                    <Button
                      type="primary"
                      onClick={next}
                      className="button"
                      disabled={!isChecked}
                    >
                      Tiếp
                    </Button>
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
                    {enter.name}
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
                      <div>{enter.label}</div>
                    </div>
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
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>Tổng cộng: </div>
                    <div style={{ color: "red" }}>
                      {formatCurrency(
                        (countAdult + countChild) * parsePrice(enter.price)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {current === 2 && (
            <Button type="primary" className="button">
              Hoàn tất
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterProcess;

import "./enter-payment.scss";
import { Steps, Button, Form, Input, Checkbox, Dropdown, Table } from "antd";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import repoApi from "api/repoApi";
import userApi from "api/userApi";
import hotelApi from "api/hotelApi";
import {
  faCartShopping,
  faCircleInfo,
  faCreditCard,
  faMinus,
  faPlus,
  faSignature,
  faPhone,
  faUser,
  faLocationDot,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import formatCurrency from "utils/formatCurrency";
import dayjs from "dayjs";
import { useAuth } from "context/authContext";
import { useForm } from "antd/es/form/Form";
import {
  handlePayment,
  handleCreatePayment,
} from "components/payment/handlePayment";

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

const HotelPaymentProcess = ({ type }) => {
  const { id } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const repoId = queryParams.get("repoId");
  const serviceId = queryParams.get("serviceId");
  const [current, setCurrent] = useState(0);
  const [form] = useForm();
  const [user, setUser] = useState({});
  const [item, setItem] = useState({});
  const [vacation, setVacation] = useState(null);
  const [countAdult, setCountAdult] = useState(0);
  const [countChild, setCountChild] = useState(0);
  const [dataForm, setDataForm] = useState({});
  const [room, setRoom] = useState(1);
  const [roomData, setRoomData] = useState(null);
  const [numberOfNights, setNumberOfNights] = useState(0);

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
        const hotelResponse = await hotelApi.getDetailHotel(serviceId);
        const matchedActivity = response.data.data.plan.find((item) =>
          item.children.includes(hotelResponse.data.data.name)
        );
        const result = {
          ...hotelResponse.data.data,
          ...(matchedActivity && {
            numberPeople: response.data.data.numberPeople,
            label: matchedActivity.label,
            children: matchedActivity.children,
          }),
          startDate: response.data.data.startDate,
          endDate: response.data.data.endDate,
        };
        setItem(result);
        setCountAdult(result.numberPeople);
        const start = dayjs(result.startDate);
        const end = dayjs(result.endDate);
        const numberOfNights = end.diff(start, "day");
        setNumberOfNights(numberOfNights);

        const resultString = `${start.format("DD/MM")} - ${end.format(
          "DD/MM"
        )} (${numberOfNights} đêm)`;
        setVacation(resultString);
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

  const handlePlusRoom = () => {
    setRoom((prev) => prev + 1);
  };

  const handleMinusRoom = () => {
    setRoom((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleSelectRoom = (roomData) => {
    setRoomData(roomData);
    next();
  };

  const items = [
    {
      key: "1",
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "16px 0",
          }}
        >
          <span>Người lớn</span>
          <div>
            <span className="payment-enter-btn">
              <FontAwesomeIcon icon={faMinus} onClick={handleDecrease} />
            </span>
            <span className="payment-enter-btn">{countAdult}</span>
            <span className="payment-enter-btn">
              <FontAwesomeIcon icon={faPlus} onClick={handleIncrease} />
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <span>Trẻ em</span>
          <div>
            <span className="payment-enter-btn">
              <FontAwesomeIcon icon={faMinus} onClick={handleMinus} />
            </span>
            <span className="payment-enter-btn">{countChild}</span>
            <span className="payment-enter-btn">
              <FontAwesomeIcon icon={faPlus} onClick={handlePlus} />
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <span>Phòng</span>
          <div>
            <span className="payment-enter-btn">
              <FontAwesomeIcon icon={faMinus} onClick={handleMinusRoom} />
            </span>
            <span className="payment-enter-btn">{room}</span>
            <span className="payment-enter-btn">
              <FontAwesomeIcon icon={faPlus} onClick={handlePlusRoom} />
            </span>
          </div>
        </div>
      ),
    },
  ];

  const columns = [
    {
      title: "Lựa chọn phòng",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Khách",
      dataIndex: "people",
      key: "people",
    },
    {
      title: "Giá/phòng/đêm",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Button
          className="button"
          onClick={() => handleSelectRoom(record.roomData)}
        >
          Chọn
        </Button>
      ),
    },
  ];

  const handlePeopleInRoom = (str) => {
    const match = str.match(/(\d+)\s*người/);

    const numberBefore = match ? match[1] : null;

    return numberBefore;
  };

  const handlePay = async () => {
    const data = {
      amount: numberOfNights * roomData.price * 1.1 * room,
      repoId: repoId,
      serviceId: serviceId,
    };
    const dataHotel = {
      service_id: serviceId,
      repository_id: repoId,
      amount: numberOfNights * roomData.price * 1.1 * room,
      email: dataForm.email,
      name: dataForm.name,
      phone: dataForm.phone,
      countAdult: countAdult,
      countChild: countChild,
      subId: roomData.id,
      orderDate: `${vacation} (${numberOfNights} đêm)`,
      service_type: "hotel",
      result: "pending",
    };
    const response = await handleCreatePayment(dataHotel);
    console.log("response", response);
    handlePayment(data);
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
              <div style={{ padding: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "12px",
                    padding: "12px 16px",
                  }}
                >
                  <div className="hotel-payment-bar">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="hotel-payment-icon"
                    />
                    <span>{item.name}</span>
                  </div>
                  <div className="hotel-payment-bar">
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      className="hotel-payment-icon"
                    />
                    <span>{vacation}</span>
                  </div>
                  <div className="hotel-payment-bar">
                    <FontAwesomeIcon
                      icon={faCircleInfo}
                      className="hotel-payment-icon"
                    />
                    <Dropdown menu={{ items }}>
                      <span>
                        {`${countAdult} người lớn, ${countChild} trẻ em, ${room} phòng`}
                      </span>
                    </Dropdown>
                  </div>
                </div>
                <div>
                  {item.room &&
                    item.room.map((rm) => {
                      return (
                        <div
                          key={rm.id}
                          style={{
                            display: "flex",
                            margin: "16px 0",
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <img
                              src={rm.image}
                              alt="room"
                              style={{ width: "200px" }}
                            />
                          </div>
                          <Table
                            columns={columns}
                            pagination={false}
                            style={{ width: "100%", marginLeft: "16px" }}
                            dataSource={[
                              {
                                key: "1",
                                description: rm.description,
                                people: handlePeopleInRoom(rm.description),
                                price: formatCurrency(rm.price),
                                roomData: rm,
                              },
                            ]}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
          {current === 1 && (
            <>
              <div className="payment-hotel-step2">
                <div>
                  <div style={{ fontSize: "26px", fontWeight: "bold" }}>
                    Đặt phòng của bạn
                  </div>
                  <p>
                    Hãy đảm bảo tất cả thông tin chi tiết trên trang này đã
                    chính xác trước khi tiến hành thanh toán.
                  </p>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ width: "60%" }}>
                    <div>
                      <div className="payment-hotel-step2-title">
                        Thông tin liên hệ
                      </div>
                      <p>
                        Hãy điền chính xác tất cả thông tin để đảm bảo bạn nhận
                        được Phiếu xác nhận đặt phòng (E-voucher) qua email của
                        mình.
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
                        </Form>
                      </div>
                    </div>
                    <div>
                      <div className="payment-hotel-step2-title">
                        Bạn có yêu cầu nào không
                      </div>
                      <p>
                        Khi nhận phòng, khách sạn sẽ thông báo liệu yêu cầu này
                        có được đáp ứng hay không. Một số yêu cầu cần trả thêm
                        phí để sử dụng nhưng bạn hoàn toàn có thể hủy yêu cầu
                        sau đó.
                      </p>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Checkbox>Phòng không hút thuốc</Checkbox>
                        <Checkbox>Phòng liên thông</Checkbox>
                        <Checkbox>Tầng lầu</Checkbox>
                        <Checkbox>Khác</Checkbox>
                      </div>
                    </div>
                    <div>
                      <div className="payment-hotel-step2-title">
                        Chi tiết giá
                      </div>
                      <p style={{ color: "red" }}>
                        Thuế và phí là các khoản được SmartTrip chuyển trả cho
                        khách sạn. Mọi thắc mắc về thuế và hóa đơn, vui lòng
                        tham khảo Điều khoản và Điều kiện của SmartTrip để được
                        giải đáp
                      </p>
                      <div className="payment-hotel-step2-item">
                        <div>
                          Giá phòng
                          <p>{`(*${room}) ${roomData.name} (${numberOfNights} đêm)`}</p>
                        </div>
                        <div>
                          {formatCurrency(
                            numberOfNights * roomData.price * room
                          )}
                        </div>
                      </div>
                      <div className="payment-hotel-step2-item">
                        <div>Thuế và phí</div>
                        <div>
                          {formatCurrency(
                            numberOfNights * roomData.price * 0.1 * room
                          )}
                        </div>
                      </div>
                      <div className="payment-hotel-step2-item">
                        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                          Tổng giá
                        </div>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "red",
                          }}
                        >
                          {formatCurrency(
                            numberOfNights * roomData.price * 1.1 * room
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: "35%" }}>
                    <div>
                      <div className="payment-hotel-step2-title">
                        Thông tin khách sạn
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {item.name}
                      </div>
                      <div>
                        <img
                          style={{ width: "100%" }}
                          src={roomData.image}
                          alt="room selected"
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                          fontSize: "12px",
                          color: "gba($color: #000000, $alpha: 0.6)",
                          margin: "16px 0",
                          fontWeight: "bold",
                        }}
                      >
                        <div className="payment-hotel-step2-box">
                          Nhận phòng <br />
                          {dayjs(item.startDate).format("DD/MM/YYYY")} <br />
                          Từ {item.checkin}h
                        </div>
                        <div
                          style={{
                            paddingBottom: "12px",
                            borderBottom: "1px solid #ccc",
                          }}
                        >
                          {numberOfNights} đêm
                        </div>
                        <div className="payment-hotel-step2-box">
                          Trả phòng <br />
                          {dayjs(item.endDate).format("DD/MM/YYYY")} <br />
                          Trước {item.checkout}h
                        </div>
                      </div>
                      <div style={{ fontWeight: "bold" }}>{roomData.name}</div>
                      <div className="payment-hotel-step2-item">
                        <div>
                          Giá phòng <br />
                          <p>
                            {room} phòng x {numberOfNights} đêm
                          </p>
                        </div>
                        <div style={{ color: "red" }}>
                          {formatCurrency(
                            numberOfNights * roomData.price * 1.1 * room
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="payment-hotel-step2-title">
                        Chính sách hủy và đổi lịch
                      </div>
                      <p>
                        Bạn có thể linh hoạt thay đổi ngày lưu trú với phòng
                        này!
                      </p>
                      <p>Có áp dụng chính sách hủy phòng</p>
                      <p>Có thể đổi lịch</p>
                    </div>
                    <div>
                      <div className="payment-hotel-step2-title">
                        Chính sách lưu trú
                      </div>
                      <p>
                        Bữa sáng tại cơ sở lưu trú được phục vụ từ 06:00 đến
                        10:30.
                      </p>
                    </div>
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
                    // disabled={!isChecked}
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
                        Ngày đặt phòng
                      </span>
                      <span className="confirm-payment-value">{vacation}</span>
                    </div>

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

                    <div className="confirm-payment-enter">
                      <span
                        className="confirm-payment-label"
                        style={{ color: "red" }}
                      >
                        Tổng cộng
                      </span>
                      <span style={{ fontSize: "20px", color: "red" }}>
                        {formatCurrency(
                          numberOfNights * roomData.price * 1.1 * room
                        )}
                      </span>
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
                      onClick={handlePay}
                      className="button"
                    >
                      Thanh toán
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

export default HotelPaymentProcess;

import "./enter-payment.scss";
import { Steps, Button, Calendar } from "antd";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import repoApi from "api/repoApi";
import entertainmentApi from "api/entertainmentApi";
import {
  faCartShopping,
  faCircleInfo,
  faCreditCard,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import formatCurrency from "utils/formatCurrency";
import dayjs from "dayjs";

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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const repoId = queryParams.get("repoId");
  const serviceId = queryParams.get("serviceId");
  const [current, setCurrent] = useState(0);
  const [enter, setEnter] = useState({});
  const [countAdult, setCountAdult] = useState(0);
  const [countChild, setCountChild] = useState(0);

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
                  <div style={{ textAlign: "center", fontSize: "30px" }}>
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
                  <div>
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
            <Button type="primary" onClick={next} className="button">
              Tiếp
            </Button>
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

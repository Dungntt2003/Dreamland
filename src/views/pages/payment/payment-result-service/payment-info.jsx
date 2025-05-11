import paymentApi from "api/paymentApi";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import formatCurrency from "utils/formatCurrency";
import { QRCodeCanvas } from "qrcode.react";
const PaymentInfo = () => {
  const [payment, setPayment] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const repoId = queryParams.get("repoId");
  const serviceId = queryParams.get("serviceId");
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const response = await paymentApi.getPayment(repoId, serviceId);
        setPayment(response.data.data);
      } catch (error) {
        console.error("Error fetching payment info:", error);
      }
    };
    fetchPaymentInfo();
  }, [repoId, serviceId]);
  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          textAlign: "center",
          fontSize: "24px",
          marginBottom: "24px",
          fontWeight: "bold",
        }}
      >
        Thông tin đơn hàng
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ width: "50%" }}>
          {payment && (
            <div
              style={{
                padding: "16px 32px",
                backgroundColor: "var(--background-color)",
                borderRadius: "54px",
                border: "1px solid var(--primary-color)",
                marginBottom: "24px",
              }}
            >
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                {payment[payment.service_type].name}
              </div>
              <div className="confirm-payment-enter">
                <span className="confirm-payment-label">Ngày đặt vé</span>
                <span className="confirm-payment-value">
                  {payment.orderDate}
                </span>
              </div>

              <div className="confirm-payment-enter">
                <span className="confirm-payment-label">Đơn vị</span>
                <span className="confirm-payment-value">
                  Người lớn * {payment.countAdult} <br />
                  Trẻ em * {payment.countChild}
                </span>
              </div>
              <div className="confirm-payment-enter">
                <span className="confirm-payment-label">Họ và tên</span>
                <span className="confirm-payment-value">{payment.name}</span>
              </div>
              <div className="confirm-payment-enter">
                <span className="confirm-payment-label">Email</span>
                <span className="confirm-payment-value">{payment.email}</span>
              </div>
              <div className="confirm-payment-enter">
                <span className="confirm-payment-label">SĐT</span>
                <span className="confirm-payment-value">{payment.phone}</span>
              </div>

              <div className="confirm-payment-enter">
                <span
                  className="confirm-payment-label"
                  style={{ color: "red" }}
                >
                  Tổng cộng
                </span>
                <span style={{ fontSize: "20px", color: "red" }}>
                  {formatCurrency(payment.amount)}
                </span>
              </div>
            </div>
          )}
        </div>
        <div
          style={{ width: "50%", display: "flex", justifyContent: "center" }}
        >
          {payment && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <QRCodeCanvas value={payment.id} size={250} />
              <p style={{ marginTop: "20px", color: "red" }}>
                Vui lòng đưa mã này cho nhân viên
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;

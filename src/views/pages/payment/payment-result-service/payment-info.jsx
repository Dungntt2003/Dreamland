import "./payment-info.scss";
import paymentApi from "api/paymentApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import formatCurrency from "utils/formatCurrency";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "antd";
const PaymentInfo = () => {
  const navigate = useNavigate();
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

  const handleReturn = () => {
    navigate(`/schedule-detail/${repoId}`);
  };

  if (!payment) {
    return (
      <div className="payment-info-container">
        <div className="payment-loading">Đang tải thông tin đơn hàng...</div>
      </div>
    );
  }

  return (
    <div className="payment-info-container">
      <div className="payment-header">
        <div></div>
        <h1 className="payment-title">Thông tin đơn hàng</h1>
        <Button className="payment-return-btn" onClick={handleReturn}>
          Quay về lộ trình
        </Button>
      </div>

      <div className="payment-content">
        <div className="payment-details-section">
          <div className="payment-details-card">
            <div className="payment-service-name">
              {payment[payment.service_type].name}
            </div>

            <div className="payment-info-row">
              <span className="payment-info-label">Ngày đặt vé</span>
              <span className="payment-info-value">{payment.orderDate}</span>
            </div>

            <div className="payment-info-row">
              <span className="payment-info-label">Đơn vị</span>
              <span className="payment-info-value">
                Người lớn × {payment.countAdult}
                <br />
                Trẻ em × {payment.countChild}
              </span>
            </div>

            <div className="payment-info-row">
              <span className="payment-info-label">Họ và tên</span>
              <span className="payment-info-value">{payment.name}</span>
            </div>

            <div className="payment-info-row">
              <span className="payment-info-label">Email</span>
              <span className="payment-info-value">{payment.email}</span>
            </div>

            <div className="payment-info-row">
              <span className="payment-info-label">SĐT</span>
              <span className="payment-info-value">{payment.phone}</span>
            </div>

            <div className="payment-info-row payment-total-row">
              <span className="payment-info-label payment-total-label">
                Tổng cộng
              </span>
              <span className="payment-info-value payment-total-value">
                {formatCurrency(payment.amount)}
              </span>
            </div>
          </div>
        </div>

        <div className="payment-qr-section">
          <div className="payment-qr-container">
            <div className="payment-qr-code">
              <QRCodeCanvas value={payment.id} size={250} />
            </div>
            <p className="payment-qr-instruction">
              Vui lòng đưa mã này cho nhân viên khi sử dụng dịch vụ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;

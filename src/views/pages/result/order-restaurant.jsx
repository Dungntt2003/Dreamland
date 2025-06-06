import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentResultRestaurant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const repoId = queryParams.get("repoId");
  const serviceId = queryParams.get("serviceId");
  useEffect(() => {
    setTimeout(() => {
      navigate(`/payment-info?repoId=${repoId}&serviceId=${serviceId}`);
    }, 5000);
  }, []);
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2 style={{ color: "green" }}>
        <p>Yêu cầu đặt chỗ của bạn đã gửi thành công</p>
        <p>Vui lòng đợi nhà hàng liên hệ để xác nhận</p>
      </h2>
    </div>
  );
};

export default PaymentResultRestaurant;

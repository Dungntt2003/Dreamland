import React, { useState } from "react";
import paymentApi from "api/paymentApi";

const VNPayPayment = () => {
  const [payUrl, setPayUrl] = useState("");

  const handlePayment = async () => {
    try {
      const response = await paymentApi.paymentVnpay({
        amount: 100000,
        orderInfo: "Thanh toán cho đơn hàng",
      });

      setPayUrl(response.data.paymentUrl);
    } catch (error) {
      console.error("Lỗi khi tạo URL thanh toán:", error);
    }
  };

  return (
    <div>
      <h2>Thanh toán VNPay</h2>
      <button onClick={handlePayment}>Thanh toán</button>
      {payUrl && (
        <p>
          <a href={payUrl} rel="noopener noreferrer">
            Nhấn vào đây để thanh toán
          </a>
        </p>
      )}
    </div>
  );
};

export default VNPayPayment;

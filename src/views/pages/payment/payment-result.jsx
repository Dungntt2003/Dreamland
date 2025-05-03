import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  useEffect(() => {
    const responseCode = searchParams.get("vnp_ResponseCode");

    if (!responseCode) {
      setStatus("invalid");
      return;
    }

    if (responseCode === "00") {
      setStatus("success");
      // setTimeout(() => {
      //   navigate("/homepage");
      // }, 5000);
    } else {
      setStatus("failed");
      // setTimeout(() => {
      //   navigate("/vnpay");
      // }, 5000);
    }
  }, [searchParams, navigate]);
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      {status === "loading" && <p>Đang xử lý kết quả thanh toán...</p>}
      {status === "invalid" && <p>Không có thông tin kết quả hợp lệ.</p>}
      {status === "success" && (
        <>
          <h2 style={{ color: "green" }}>Thanh toán thành công!</h2>
        </>
      )}
      {status === "failed" && (
        <>
          <h2 style={{ color: "red" }}>Thanh toán thất bại!</h2>
        </>
      )}
    </div>
  );
};

export default PaymentResult;

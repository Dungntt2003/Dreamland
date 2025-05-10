import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import paymentApi from "api/paymentApi";
const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  useEffect(() => {
    const responseCode = searchParams.get("vnp_ResponseCode");
    const encodedOrderInfo = searchParams.get("vnp_OrderInfo");

    if (!responseCode) {
      setStatus("invalid");
      return;
    }

    if (!encodedOrderInfo) {
      setStatus("invalid");
      return;
    }
    const decodedOrderInfo = JSON.parse(atob(encodedOrderInfo));

    const { repoId, serviceId } = decodedOrderInfo;
    const updateStatus = async (result) => {
      try {
        const response = await paymentApi.checkPayment({
          service_id: serviceId,
          repository_id: repoId,
        });
        if (response.status === 200) {
          const updateData = await paymentApi.updatePayment(
            response.data.data.id,
            {
              result: result,
            }
          );
          console.log(updateData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (responseCode === "00") {
      updateStatus("success");
      setStatus("success");
      setTimeout(() => {
        navigate(`/payment-info?repoId=${repoId}&serviceId=${serviceId}`);
      }, 5000);
    } else {
      updateStatus("fail");
      setStatus("failed");
      setTimeout(() => {
        navigate(`/payment-service/${repoId}`);
      }, 5000);
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

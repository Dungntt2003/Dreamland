import paymentApi from "api/paymentApi";

const handlePayment = async (data) => {
  try {
    const response = await paymentApi.paymentVnpay({
      amount: data.amount,
      orderInfo: data.orderInfo,
    });
    window.location.href = response.data.paymentUrl;
  } catch (error) {
    console.error("Lỗi khi tạo URL thanh toán:", error);
  }
};

export default handlePayment;

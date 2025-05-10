import paymentApi from "api/paymentApi";

const handlePayment = async (data) => {
  try {
    const response = await paymentApi.paymentVnpay({
      amount: data.amount,
      serviceId: data.serviceId,
      repoId: data.repoId,
    });
    window.location.href = response.data.paymentUrl;
  } catch (error) {
    console.error("Lỗi khi tạo URL thanh toán:", error);
  }
};

const handleCreatePayment = async (data) => {
  try {
    const response = await paymentApi.createPayment(data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export { handlePayment, handleCreatePayment };

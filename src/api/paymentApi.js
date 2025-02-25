import axiosClient from "./axiosClient";
const paymentApi = {
  paymentVnpay: (params) => {
    const url = "/payment/create-payment";
    return axiosClient.post(url, params);
  },
  paymentReturn: () => {
    const url = "/payment/vnpay-return";
    return axiosClient.get(url);
  },
};

export default paymentApi;

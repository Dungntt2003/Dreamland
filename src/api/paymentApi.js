import axiosGeneral from "./axiosGeneral";
const paymentApi = {
  paymentVnpay: (params) => {
    const url = "/payment/create-payment";
    return axiosGeneral.post(url, params);
  },
  paymentReturn: () => {
    const url = "/payment/vnpay-return";
    return axiosGeneral.get(url);
  },
};

export default paymentApi;

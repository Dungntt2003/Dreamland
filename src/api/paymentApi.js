import axiosGeneral from "./axiosGeneral";
import axiosClient from "./axiosClient";
const paymentApi = {
  paymentVnpay: (params) => {
    const url = "/payment/create-payment";
    return axiosGeneral.post(url, params);
  },
  paymentReturn: () => {
    const url = "/payment/vnpay-return";
    return axiosGeneral.get(url);
  },
  createPayment: (params) => {
    const url = "/payment/create";
    return axiosClient.post(url, params);
  },
  checkPayment: (params) => {
    const url = "/payment/check-exist";
    return axiosClient.post(url, params);
  },
  updatePayment: (id, params) => {
    const url = `/payment/${id}`;
    return axiosClient.put(url, params);
  },
  getPayment: (repoId, serviceId) => {
    const url = `/payment/${repoId}/${serviceId}`;
    return axiosClient.get(url);
  },
};

export default paymentApi;

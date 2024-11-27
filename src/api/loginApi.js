import axiosClient from "api/axiosClient";

const loginApi = {
  register: (params) => {
    const url = "/register";
    return axiosClient.post(url, params);
  },
  login: (params) => {
    const url = "/login";
    return axiosClient.post(url, params);
  },
};

export default loginApi;

import axiosClient from "api/axiosClient";

const loginApi = {
  register: (params) => {
    const url = "/users/register";
    return axiosClient.post(url, params);
  },
  login: (params) => {
    const url = "/users/login";
    return axiosClient.post(url, params);
  },
};

export default loginApi;

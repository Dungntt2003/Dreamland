import axiosClient from "./axiosClient";

const userApi = {
  getUserInfo: (id) => {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },
  updateInfo: (id, params) => {
    const url = `/users/${id}`;
    return axiosClient.put(url, params);
  },
  updateAva: (id, ava) => {
    const url = `/users/ava/${id}`;
    return axiosClient.put(url, ava);
  },
  updatePassword: (id, password) => {
    const url = `/users/password/${id}`;
    return axiosClient.put(url, password);
  },
};

export default userApi;

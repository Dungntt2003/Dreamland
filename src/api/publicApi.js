import axiosClient from "./axiosClient";

const publicApi = {
  getListProvinces: () => {
    const url = "https://provinces.open-api.vn/api/";
    return axiosClient.get(url);
  },
};

export default publicApi;

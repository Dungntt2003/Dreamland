// import axiosClient from "./axiosClient";
import axios from "axios";

const publicApi = {
  getListProvinces: () => {
    const url = "https://provinces.open-api.vn/api/";
    return axios.get(url);
  },
};

export default publicApi;

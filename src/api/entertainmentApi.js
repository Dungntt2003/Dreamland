import axiosClient from "./axiosClient";

const entertainmentApi = {
  getListEntertaiments: () => {
    const url = "/entertainments";
    return axiosClient.get(url);
  },
  getEntertainmentDetail: (id) => {
    const url = `/entertainments/${id}`;
    return axiosClient.get(url);
  },
};

export default entertainmentApi;

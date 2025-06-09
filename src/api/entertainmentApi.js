import axiosGeneral from "./axiosGeneral";

const entertainmentApi = {
  getListEntertaiments: () => {
    const url = "/entertainments";
    return axiosGeneral.get(url);
  },
  getEntertainmentDetail: (id) => {
    const url = `/entertainments/${id}`;
    return axiosGeneral.get(url);
  },
};

export default entertainmentApi;

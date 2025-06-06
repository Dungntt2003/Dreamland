import axiosClient from "./axiosClient";

const hotelApi = {
  getListHotels: () => {
    const url = "/hotels";
    return axiosClient.get(url);
  },
  getDetailHotel: (id) => {
    const url = `/hotels/${id}`;
    return axiosClient.get(url);
  },
};

export default hotelApi;

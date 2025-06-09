import axiosGeneral from "./axiosGeneral";

const hotelApi = {
  getListHotels: () => {
    const url = "/hotels";
    return axiosGeneral.get(url);
  },
  getDetailHotel: (id) => {
    const url = `/hotels/${id}`;
    return axiosGeneral.get(url);
  },
};

export default hotelApi;

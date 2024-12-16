import axiosClient from "./axiosClient";

const restaurantApi = {
  getRestaurants: () => {
    const url = "/restaurants";
    return axiosClient.get(url);
  },
  getRestaurantDetail: (id) => {
    const url = `/restaurants/${id}`;
    return axiosClient.get(url);
  },
};

export default restaurantApi;

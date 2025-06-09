import axiosGeneral from "./axiosGeneral";

const restaurantApi = {
  getRestaurants: () => {
    const url = "/restaurants";
    return axiosGeneral.get(url);
  },
  getRestaurantDetail: (id) => {
    const url = `/restaurants/${id}`;
    return axiosGeneral.get(url);
  },
};

export default restaurantApi;

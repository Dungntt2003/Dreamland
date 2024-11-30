import axiosClient from "./axiosClient";

const sightApi = {
  getAllSights: () => {
    const url = "/sights";
    return axiosClient.get(url);
  },
  getSightDetail: (id) => {
    const url = `/sight/${id}`;
    return axiosClient.get(url);
  },
};

export default sightApi;

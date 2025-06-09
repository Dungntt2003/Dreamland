import axiosGeneral from "./axiosGeneral";

const sightApi = {
  getAllSights: () => {
    const url = "/sights";
    return axiosGeneral.get(url);
  },
  getSightDetail: (id) => {
    const url = `/sights/${id}`;
    return axiosGeneral.get(url);
  },
};

export default sightApi;

import axiosClient from "./axiosClient";

const repoApi = {
  getListRepo: (id) => {
    const url = `/repositories/${id}`;
    return axiosClient.get(url);
  },
  createARepo: (params) => {
    const url = "/repositories";
    return axiosClient.post(url, params);
  },
  getADemoRepo: (id) => {
    const url = `/repositories/detail/${id}`;
    return axiosClient.get(url);
  },
  updatePlan: (id, params) => {
    const url = `/repositories/updateDescription/${id}`;
    return axiosClient.put(url, params);
  },
};

export default repoApi;

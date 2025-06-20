import axiosClient from "./axiosClient";

const repoApi = {
  getListRepo: (id) => {
    const url = `/repositories/${id}`;
    return axiosClient.get(url);
  },
  deleteRepo: (id) => {
    const url = `/repositories/${id}`;
    return axiosClient.delete(url);
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
  updateStatusRepo: (id) => {
    const url = `/repositories/updateStatus/${id}`;
    return axiosClient.put(url);
  },
};

export default repoApi;

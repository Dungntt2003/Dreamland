import axiosClient from "./axiosClient";

const demoRepoApi = {
  addAService: (params) => {
    const url = "/demoRepo";
    return axiosClient.post(url, params);
  },
  getServices: (id) => {
    const url = `/demoRepo/services/${id}`;
    return axiosClient.get(url);
  },
};

export default demoRepoApi;

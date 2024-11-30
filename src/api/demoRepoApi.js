import axiosClient from "./axiosClient";

const demoRepoApi = {
  addAService: (params) => {
    const url = "/demoRepo";
    return axiosClient.post(url, params);
  },
};

export default demoRepoApi;

import axiosClient from "./axiosClient";

const repoApi = {
  createARepo: (params) => {
    const url = "/repositories";
    return axiosClient.post(url, params);
  },
  getADemoRepo: (id) => {
    const url = `/repositories/${id}`;
    return axiosClient.get(url);
  },
};

export default repoApi;

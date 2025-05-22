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
  removeService: (service_id, service_type, repo_id) => {
    const url = `/demoRepo?repo_id=${repo_id}&service_id=${service_id}&service_type=${service_type}`;
    return axiosClient.delete(url);
  },
};

export default demoRepoApi;

import axiosClient from "./axiosClient";

const nearByApi = {
  getNearServices: (id, type, radius) => {
    const url = `/nearby?type=${type}&id=${id}&radius=${radius}`;
    return axiosClient.get(url);
  },
};

export default nearByApi;

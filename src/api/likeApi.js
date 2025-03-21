import axiosClient from "./axiosClient";

const likeApi = {
  getLikeList: (user_id) => {
    const url = `/like/${user_id}`;
    return axiosClient.get(url);
  },
  createLike: (params) => {
    const url = "/like";
    return axiosClient.post(url, params);
  },
  deleteLike: (params) => {
    const url = `/like`;
    return axiosClient.delete(url, { data: params });
  },
};

export default likeApi;

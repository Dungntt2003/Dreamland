import axiosClient from "./axiosClient";

const scheduleApi = {
  addItem: (params) => {
    const url = "/schedules";
    return axiosClient.post(url, params);
  },
  getSchedule: (id) => {
    const url = `/schedules/${id}`;
    return axiosClient.get(url);
  },
};

export default scheduleApi;

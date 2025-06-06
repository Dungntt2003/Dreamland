import axiosGeneral from "./axiosGeneral";

const mailApi = {
  sendMail: (params) => {
    const url = "/mail";
    return axiosGeneral.post(url, params);
  },
};

export default mailApi;

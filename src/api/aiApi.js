import axiosGeneral from "./axiosGeneral";

const aiApi = {
  getResBasic: (params) => {
    const url = "/ai/ask-ai";
    return axiosGeneral.post(url, params);
  },
  getDetailWithAI: (params) => {
    const url = "/ai/integrate-llm";
    return axiosGeneral.post(url, params);
  },
};

export default aiApi;

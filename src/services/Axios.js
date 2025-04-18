import axios from "axios";

const axiosDefaultHeaderOption = {
  "cache-control": "public, s-maxage=10, stale-while-revalidate=59",
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: axiosDefaultHeaderOption,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["x-api-token"] = token;
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    if (
      error?.response?.data?.code === 1009 ||
      error?.response?.data?.code === 1007
    ) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const getAPIHeaders = () => axiosInstance.defaults.headers.common;

export const setAPIHeaders = (inputHeaders) => {
  axiosInstance.defaults.headers.common = {
    ...axiosInstance.defaults.headers.common,
    ...inputHeaders,
  };
};

export const getRequest = (endpointApiUrl, payload = {}, config = {}) =>
  axiosInstance.get(endpointApiUrl, {
    params: payload,
    ...config,
  });

export const postRequest = (endpointApiUrl, payload = {}, config = {}) =>
  axiosInstance.post(endpointApiUrl, payload, config);

export const putRequest = (endpointApiUrl, payload = {}, config = {}) =>
  axiosInstance.put(endpointApiUrl, payload, config);

export const patchRequest = (endpointApiUrl, payload = {}, config = {}) =>
  axiosInstance.patch(endpointApiUrl, payload, config);

export const deleteRequest = (endpointApiUrl, config = {}) =>
  axiosInstance.delete(endpointApiUrl, config);

const Axios = {
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest,
};

export default Axios;
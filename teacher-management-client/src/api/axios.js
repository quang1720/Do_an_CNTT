import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const axiosClient = instance;

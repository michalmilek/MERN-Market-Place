import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://server-acfl.onrender.com",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
import axios from "axios";
import { Url } from "../config/config";

const axiosInstance = axios.create({
  baseURL: Url,
  withCredentials: true, // COOKIE-ONLY AUTH
  headers: {
    "Content-Type": "application/json",
  },
});


export default axiosInstance;


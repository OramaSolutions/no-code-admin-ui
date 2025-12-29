import axiosInstance from "./axiosInstance";

export const userLogin = (payload) => {
    return axiosInstance.post(`admin/adminLogin`, payload);
};
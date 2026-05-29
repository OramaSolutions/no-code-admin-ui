import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';
import { commomObj } from '../utils';
import { logoutUser } from '../reduxToolkit/Slices/authSlices';

let interceptorInitialized = false;
let isHandlingUnauthorized = false;

export const setupAxiosInterceptors = (store) => {
  if (interceptorInitialized) {
    return;
  }

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const statusCode = error?.response?.status;
      const requestUrl = error?.config?.url || '';
      const isLoginRequest = requestUrl.includes('admin/adminLogin');
      const hasActiveSession = Boolean(window.localStorage.getItem('adminLogin'));

      if (statusCode === 401 && !isLoginRequest && hasActiveSession && !isHandlingUnauthorized) {
        isHandlingUnauthorized = true;
        store.dispatch(logoutUser());
        toast.error('Your session has expired. Please sign in again.', commomObj);
        window.setTimeout(() => {
          isHandlingUnauthorized = false;
        }, 0);
      }

      return Promise.reject(error);
    }
  );

  interceptorInitialized = true;
};

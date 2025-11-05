import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../reduxToolkit/Slices/authSlices.js"
import userSlices from './Slices/userSlices.js';
import reportSlices from './Slices/reportSlices.js';
import projectSlices from './Slices/projectSlices.js';
import notificationSlice from './Slices/notificationSlices.js'
import statsSlices from './Slices/statsSlices.js';


const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userSlices,
    report: reportSlices,
    project: projectSlices,
    notification: notificationSlice,
    stats: statsSlices,
  },
});

export default store;

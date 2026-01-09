import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Url } from '../../config/config.js';
import { isLoggedIn } from "../../utils";
import axiosInstance from '../../apis/axiosInstance.js';
const initialState = {
    notificationData: [],
    searchuserData: [],
    loader: false,
    error: null,
}
//==================================project list======================================================
export const adminNotificationList = createAsyncThunk(
    "notification/adminList",
    async (payload, { rejectWithValue }) => {
        try {
        

            const params = {
                page: payload.page,
                limit: payload.limit,
                projectId: payload.projectId,
                recipientId: payload.recipientId,
                isRead: payload.isRead,
                search: payload.search,
            };

            const response = await axiosInstance.get(
                `${Url}admin/notifications`,
                {
                    params,
                    
                }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

//===================================add notification===========================================
export const addNotification = createAsyncThunk(
    "notification/add",
    async (payload, { rejectWithValue }) => {
        try {
          

            const response = await axiosInstance.post(
                `${Url}admin/notifications`,
                payload,
               
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

//===================================delete notification===========================================
export const deleteNotification = createAsyncThunk('project/deletenotification', async (payload, { rejectWithValue }) => {
    try {
        
        const response = await axiosInstance.delete(`${Url}admin/deleteNotification`, { data: payload, });
        if (response.status === 200) {
            return response.data;
        } else {
            return rejectWithValue(response.data);
        }
    }
    catch (err) {
        return rejectWithValue(err.response.data);
    }
})

//===================================list for users to send notification======================================
export const searchUserList = createAsyncThunk('notification/searchUser', async (payload, { rejectWithValue }) => {
    try {
     
        const response = await axiosInstance.get(`${Url}admin/searchUserList?search=${payload.searchUser}`, );
        if (response.status === 200) {
            return response.data;
        } else {
            return rejectWithValue(response.data);
        }
    }
    catch (err) {
        return rejectWithValue(err.response.data);
    }
})
//=======================================reducer==============================================================
const notificationSlice = createSlice({
    name: 'project',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(adminNotificationList.pending, (state) => {
                state.loader = true;
            })
            .addCase(adminNotificationList.fulfilled, (state, action) => {
                state.loader = false;
                state.notificationData = action.payload;

            })
            .addCase(adminNotificationList.rejected, (state, action) => {
                state.loader = false;
                state.error = action.payload;
            })
            // Add notification
            .addCase(addNotification.pending, (state) => {
                state.loader = true;
            })
            .addCase(addNotification.fulfilled, (state) => {
                state.loader = false;
            })
            .addCase(addNotification.rejected, (state, action) => {
                state.loader = false;
                state.error = action.payload;
            })
            .addCase(searchUserList.pending, (state) => {
                state.loader = true;
            })
            .addCase(searchUserList.fulfilled, (state, action) => {
                state.loader = false;
                state.searchuserData = action.payload;

            })
            .addCase(searchUserList.rejected, (state, action) => {
                state.loader = false;
            })
    },
});

export default notificationSlice.reducer;
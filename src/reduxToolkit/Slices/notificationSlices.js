import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Url } from '../../config/config.js';
import { isLoggedIn } from "../../utils";

const initialState = {
    notificationData: [],
    searchuserData:[],
    loader: false,
}
//==================================project list======================================================
export const notificationList = createAsyncThunk('notification/notificationlist', async (payload, { rejectWithValue }) => {
    try {
        const token = isLoggedIn("adminLogin");
        console.log(token, "checking token")
        const response = await axios.get(`${Url}admin/notificationList?page=${payload.page}&startDate=${payload.startdate}&endDate=${payload.enddate}&search=${payload.search}&timeframe=${payload.timeFrame}`, {
            headers: { Authorization: `${token}` },
        });
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
//===================================add notification===========================================
export const addNotification = createAsyncThunk('project/addnotification', async (payload, { rejectWithValue }) => {
    try {
        const token = isLoggedIn("adminLogin");
        const response = await axios.post(`${Url}admin/addNotification`, payload, {
            headers: { Authorization: `${token}` },
        });
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
//===================================edit notification===========================================
export const editNotification = createAsyncThunk('project/editnotification', async (payload, { rejectWithValue }) => {
    try {
        const token = isLoggedIn("adminLogin");
        const response = await axios.post(`${Url}admin/editNotification`, payload, {
            headers: { Authorization: `${token}` },
        });
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
//===================================delete notification===========================================
export const deleteNotification = createAsyncThunk('project/deletenotification', async (payload, { rejectWithValue }) => {
    try {
        const token = isLoggedIn("adminLogin");
        const response = await axios.delete(`${Url}admin/deleteNotification`, { data: payload, headers: { Authorization: `${token}` }, });
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
//=====================================resend notification===============================================
export const resendNotification = createAsyncThunk('project/resendNotification', async (payload, { rejectWithValue }) => {
    try {
        const token = isLoggedIn("adminLogin");
        const response = await axios.post(`${Url}admin/resendNotification`, payload, {
            headers: { Authorization: `${token}` },
        });
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
        const token = isLoggedIn("adminLogin");
        const response = await axios.get(`${Url}admin/searchUserList?search=${payload.searchUser}`, {
            headers: { Authorization: `${token}` },
        });
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
            .addCase(notificationList.pending, (state) => {
                state.loader = true;
            })
            .addCase(notificationList.fulfilled, (state, action) => {
                state.loader = false;
                state.notificationData = action.payload;

            })
            .addCase(notificationList.rejected, (state, action) => {
                state.loader = false;
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
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Url } from '../../config/config.js';
import { isLoggedIn } from "../../utils";

//=====================================auth login api=============================================================================
const initialState = {
  adminData: {},
  loading: false,
  profileData: [],
}

export const adminLogin = createAsyncThunk('auth/adminLogin', async (payload, { rejectWithValue }) => {
  try {
    console.log("heloooo")
    const response = await axios.post(`${Url}admin/adminLogin`, payload);
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
//====================================aut send email========================================================
export const sendEmail = createAsyncThunk('auth/sentEmail', async (payload, { rejectWithValue }) => {
  try {
    console.log("heloooo")
    const response = await axios.post(`${Url}admin/sentEmail`, payload);
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
//====================================auth reset password====================================================
export const SetPassword = createAsyncThunk('auth/setPassword', async (payload, { rejectWithValue }) => {
  try {
    console.log("heloooo")
    const response = await axios.put(`${Url}admin/setPassword?token=${payload.token}`, { password: payload.password });
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

//================================================view profile api==========================
export const viewProfile = createAsyncThunk('auth/viewprofile', async (undefined, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("adminLogin");
    const response = await axios.get(`${Url}admin/viewProfile`, {
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

//============================================change password=================================================
export const changePassword = createAsyncThunk('auth/changePassword', async (payload, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("adminLogin");
    const response = await axios.put(`${Url}admin/changePassword`, payload, {
      headers: { Authorization: `${token}` },
    }); if (response.status === 200) {
      return response.data;
    } else {
      return rejectWithValue(response.data);
    }
  }
  catch (err) {
    return rejectWithValue(err.response.data);
  }
})
//===========================================update profile===================================================
export const updateProfile = createAsyncThunk('auth/updateprofile', async (payload, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("adminLogin");
    const response = await axios.put(`${Url}admin/editProfile`, payload, {
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
//===========================================reducer========================================================
const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData = action.payload;
        window.localStorage.setItem('adminLogin', JSON.stringify(action.payload));
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(viewProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(viewProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
      })
      .addCase(viewProfile.rejected, (state, action) => {
        state.loading = false;
      })
  },
});
//===============================================upload image or video=================================
export const UploadDocumnet = createAsyncThunk('project/uploaddocumnet', async (payload, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("adminLogin");
    const response = await axios.post(`${Url}user/uploadDocumnet`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response, "response................")
    if (response.status === 200) {
      return response;
    } else {
      return rejectWithValue(response);
    }
  }
  catch (err) {
    return rejectWithValue(err.response);
  }
})


export default authSlice.reducer;

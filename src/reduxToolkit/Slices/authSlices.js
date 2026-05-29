import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../apis/axiosInstance.js';

//=====================================auth login api=============================================================================
const getStoredAdminData = () => {
  const storedAdminData = window.localStorage.getItem('adminLogin');

  if (!storedAdminData) {
    return {};
  }

  try {
    return JSON.parse(storedAdminData);
  } catch (error) {
    window.localStorage.removeItem('adminLogin');
    return {};
  }
};

export const clearClientAuthData = () => {
  window.localStorage.clear();
  window.sessionStorage.clear();
};

const storedAdminData = getStoredAdminData();

const initialState = {
  adminData: storedAdminData,
  isAuthenticated: Boolean(storedAdminData?.activeUser?.jwtToken),
  loading: false,
  profileData: [],
}

export const adminLogin = createAsyncThunk('auth/adminLogin', async (payload, { rejectWithValue }) => {
  try {
    
    const response = await axiosInstance.post(`admin/adminLogin`, payload);
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
    const response = await axiosInstance.post(`admin/sentEmail`, payload);
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
    const response = await axiosInstance.put(`admin/setPassword?token=${payload.token}`, { password: payload.password });
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
export const viewProfile = createAsyncThunk('auth/viewprofile', async (_, { rejectWithValue }) => {
  try {
   
    const response = await axiosInstance.get(`admin/viewProfile`);
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
   
    const response = await axiosInstance.put(`admin/changePassword`, payload); if (response.status === 200) {
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

    const response = await axiosInstance.put(`admin/editProfile`, payload);
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
  reducers: {
    logoutUser: (state) => {
      clearClientAuthData();
      state.adminData = {};
      state.isAuthenticated = false;
      state.profileData = [];
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData = action.payload;
        state.isAuthenticated = Boolean(storedAdminData?.activeUser?.jwtToken);
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
    
    const response = await axiosInstance.post(`user/uploadDocumnet`, payload, {
      headers: {
        "Content-Type": "multipart/form-data"
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

export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;

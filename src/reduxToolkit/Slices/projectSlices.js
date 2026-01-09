import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../apis/axiosInstance.js';
import { Url } from '../../config/config.js';
import { isLoggedIn } from "../../utils";

const initialState = {
  projectData: [],
  loader: false,
}
//==================================project list================================================================================
export const projectList = createAsyncThunk('project/projectList', async (payload, { rejectWithValue }) => {
  try {
    console.log('payload in pro list', payload)
    const response = await axiosInstance.get(`admin/projectList?userId=${payload.userId}&page=${payload.page}&startDate=${payload.startdate}&endDate=${payload.enddate}&search=${payload.search}&timeframe=${payload.timeFrame}`);
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
//===================================update status===========================================
export const addStatus = createAsyncThunk('project/addStatus', async (payload, { rejectWithValue }) => {
  try {

    const response = await axiosInstance.post(`admin/updateStatusCloseOpen`, payload);
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
//======================================remark by admin ==================================================
export const addRemark = createAsyncThunk('project/addremark', async (payload, { rejectWithValue }) => {
  try {

    const response = await axiosInstance.post(`admin/addRemark`, payload);
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
//======================================remark by admin =====================================================
// =====================================get user remark =====================================================
export const getRemarkData = createAsyncThunk('project/getRemarkData', async ({ url, username, task, project, version }, { rejectWithValue }) => {
  try {

    const response = await axios.get(`${url}remark`, {

      params: {
        username,
        task,
        project,
        version
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return rejectWithValue(response.data);
    }
  }
  catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
})
// ===================================================================================

export const approvalStatus = createAsyncThunk('project/approvalStatus', async (payload, { rejectWithValue }) => {
  try {

    const response = await axiosInstance.post(`admin/approvedStatusChanged`, payload);
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

//====================================return agumentation==========================================
export const ReturnAgumentation = createAsyncThunk('project/Returnagumentation', async ({ payload, url }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${url}return_augmentations?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
    );
    console.log(response, "response data of agumentation")
    if (response.status === 200) {
      return response;
    } else {
      return rejectWithValue(response.data);
    }
  }
  catch (err) {
    return rejectWithValue(err.response.data);
  }
})
//================================return data splitt=====================================================
export const ReturnDataSplit = createAsyncThunk('project/ReturnDataSplit', async ({ payload, url }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${url}return_split_ratio?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
    );
    // console.log(response, "response.data")
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

//================================return hyper tune======================================================
export const ReturnHypertune = createAsyncThunk('project/ReturnHypertune', async ({ payload, url }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${url}return_tune_hyperparameter?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
    );
    // console.log(response, "response.data")
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
//=======================================reducer==============================================================
const projectSlice = createSlice({
  name: 'project',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(projectList.pending, (state) => {
        state.loader = true;
      })
      .addCase(projectList.fulfilled, (state, action) => {
        state.loader = false;
        state.projectData = action.payload;

      })
      .addCase(projectList.rejected, (state, action) => {
        state.loader = false;
      })
  },
});

export default projectSlice.reducer;
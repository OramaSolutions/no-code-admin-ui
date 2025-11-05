import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Url } from '../../config/config.js';
import { isLoggedIn } from "../../utils";

const initialState = {
  projectData: [],
  loader: false,
}
//==================================project list================================================================================
export const projectList = createAsyncThunk('project/projectList', async (payload, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("adminLogin");
    console.log(token, "checking token")
    const response = await axios.get(`${Url}admin/projectList?userId=${payload.userId}&page=${payload.page}&startDate=${payload.startdate}&endDate=${payload.enddate}&search=${payload.search}&timeframe=${payload.timeFrame}`, {
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
//===================================update status===========================================
export const addStatus = createAsyncThunk('project/addStatus', async (payload, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("adminLogin");
    console.log(token, "checking token")
    const response = await axios.post(`${Url}admin/updateStatusCloseOpen`, payload, {
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
//======================================remark by admin ==================================================
export const addRemark = createAsyncThunk('project/addremark', async (payload, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("adminLogin");
    console.log(token, "checking token")
    const response = await axios.post(`${Url}admin/addRemark`, payload, {
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
//======================================remark by admin =====================================================
export const approvalStatus = createAsyncThunk('project/approvalStatus', async (payload, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("adminLogin");   
    const response = await axios.post(`${Url}admin/approvedStatusChanged`, payload, {
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
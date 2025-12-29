import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Url } from '../../config/config.js';
import { isLoggedIn } from "../../utils"; 
import axiosInstance from '../../apis/axiosInstance.js';

const initialState={
    userData:[],
    loader:false,
}

//==================================user management list================================================================================
export const userList=createAsyncThunk('user/userList',async (payload,{ rejectWithValue })=>{   
    try{
       
        const response = await axiosInstance.get(`admin/userList?page=${payload.page}&startDate=${payload.startdate}&endDate=${payload.enddate}&search=${payload.search}&timeframe=${payload.timeFrame}`);      
        if (response.status === 200) {
          return response.data;
        } else {
          return rejectWithValue(response.data);
        }
    }
    catch(err){        
        return rejectWithValue(err.response.data);
    }
})
//=============================================user add api=======================================================================
export const addUser=createAsyncThunk('user/addUser',async (payload,{ rejectWithValue })=>{   
    try{
       
        const response = await axiosInstance.post(`admin/addUser`,payload);      
        if (response.status === 200) {
          return response.data;
        } else {
          return rejectWithValue(response.data);
        }
    }
    catch(err){        
        return rejectWithValue(err.response.data);
    }
})

//=============================================user status api=======================================================================
export const StatusUser=createAsyncThunk('user/statusUser',async (payload,{ rejectWithValue })=>{   
    try{
              
        const response = await axiosInstance.patch(`admin/userStatusChanged`,payload);      
        if (response.status === 200) {
          return response.data;
        } else {
          return rejectWithValue(response.data);
        }
    }
    catch(err){        
        return rejectWithValue(err.response.data);
    }
})

export const DeleteUser=createAsyncThunk('user/deleteUser',async (payload,{ rejectWithValue })=>{   
    try{
             
        const response = await axiosInstance.patch(`admin/deleteUser`,payload);      
        if (response.status === 200) {
          return response.data;
        } else {
          return rejectWithValue(response.data);
        }
    }
    catch(err){        
        return rejectWithValue(err.response.data);
    }
})

//=====================================reducer=======================================================================================
const userSlice = createSlice({
    name: 'user',
    initialState,   
    extraReducers: (builder) => {
      builder
        .addCase(userList.pending, (state) => {
          state.loader = true;
        })
        .addCase(userList.fulfilled, (state, action) => {
          state.loader = false;
          state.userData = action.payload;
          
        })
        .addCase(userList.rejected, (state, action) => {
          state.loader = false;
        })       
    },
  });
  
  export default userSlice.reducer;
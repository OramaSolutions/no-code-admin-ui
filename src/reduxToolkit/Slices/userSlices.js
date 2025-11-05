import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Url } from '../../config/config.js';
import { isLoggedIn } from "../../utils"; 

const initialState={
    userData:[],
    loader:false,
}

//==================================user management list================================================================================
export const userList=createAsyncThunk('user/userList',async (payload,{ rejectWithValue })=>{   
    try{
        const token = isLoggedIn("adminLogin");
        console.log(token,"checking token") 
        const response = await axios.get(`${Url}admin/userList?page=${payload.page}&startDate=${payload.startdate}&endDate=${payload.enddate}&search=${payload.search}&timeframe=${payload.timeFrame}`,{
            headers: { Authorization: `${token}` },
        });      
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
        const token = isLoggedIn("adminLogin");
        console.log(token,"checking token") 
        const response = await axios.post(`${Url}admin/addUser`,payload,{
            headers: { Authorization: `${token}` },
        });      
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
        const token = isLoggedIn("adminLogin");        
        const response = await axios.patch(`${Url}admin/userStatusChanged`,payload,{
            headers: { Authorization: `${token}` },
        });      
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
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../apis/axiosInstance.js';
import { Url } from '../../config/config.js';
import { isLoggedIn } from "../../utils"; 

const initialState={
    reportData:[],
    assignPersonData:[],
    notesData:[],
    loader:false,
}
//==================================reports list================================================================================
export const reportList=createAsyncThunk('report/reportList',async (payload,{ rejectWithValue })=>{   
    try{
        
        const response = await axiosInstance.get(`admin/helpList?page=${payload.page}&startDate=${payload.startdate}&endDate=${payload.enddate}&search=${payload.search}&timeframe=${payload.timeFrame}`);      
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
//==================================report assign person list================================================================================
export const assignpersonList=createAsyncThunk('report/assignpersonlist',async (payload,{ rejectWithValue })=>{   
  try{
     
      const response = await axiosInstance.get(`admin/helpUserDropDown`);      
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
//============================================= add asign person api=======================================================================
export const addAssignPerson=createAsyncThunk('report/addassignperson',async (payload,{ rejectWithValue })=>{   
  try{
    
      const response = await axiosInstance.post(`admin/addAssignUser`,payload);      
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
//============================================= assign help to user api=======================================================================
export const AssignHelp=createAsyncThunk('report/assignhelp',async (payload,{ rejectWithValue })=>{   
  try{
      
      const response = await axiosInstance.patch(`admin/assignHelp`,payload);      
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
//==================================Notes list================================================================================
export const notesList=createAsyncThunk('report/notesList',async (payload,{ rejectWithValue })=>{   
  try{
   
      const response = await axiosInstance.get(`admin/noteList?helpId=${payload?.helpId}`);      
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
//==============================================add notes by admin====================================================================
export const AddNotes=createAsyncThunk('report/addnotes',async (payload,{ rejectWithValue })=>{   
  try{
  
      const response = await axiosInstance.post(`admin/addNote`,payload);      
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
const reportSlice = createSlice({
    name: 'report',
    initialState,   
    extraReducers: (builder) => {
      builder
        .addCase(reportList.pending, (state) => {
          state.loader = true;
        })
        .addCase(reportList.fulfilled, (state, action) => {
          state.loader = false;
          state.reportData = action.payload;
          
        })
        .addCase(reportList.rejected, (state, action) => {
          state.loader = false;
        })
        .addCase(assignpersonList.pending, (state) => {
          state.loader = true;
        })
        .addCase(assignpersonList.fulfilled, (state, action) => {
          state.loader = false;
          state.assignPersonData = action.payload;
          
        })
        .addCase(assignpersonList.rejected, (state, action) => {
          state.loader = false;
        }) 
        .addCase(notesList.pending, (state) => {
          state.loader = true;
        })
        .addCase(notesList.fulfilled, (state, action) => {
          state.loader = false;
          state.notesData = action.payload;
          
        })
        .addCase(notesList.rejected, (state, action) => {
          state.loader = false;
        })                     
    },
  });
  
  export default reportSlice.reducer;
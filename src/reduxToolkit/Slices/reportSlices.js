import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
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
        const token = isLoggedIn("adminLogin");
        console.log(token,"checking token") 
        const response = await axios.get(`${Url}admin/helpList?page=${payload.page}&startDate=${payload.startdate}&endDate=${payload.enddate}&search=${payload.search}&timeframe=${payload.timeFrame}`,{
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
//==================================report assign person list================================================================================
export const assignpersonList=createAsyncThunk('report/assignpersonlist',async (payload,{ rejectWithValue })=>{   
  try{
      const token = isLoggedIn("adminLogin");
      console.log(token,"checking token") 
      const response = await axios.get(`${Url}admin/helpUserDropDown`,{
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
//============================================= add asign person api=======================================================================
export const addAssignPerson=createAsyncThunk('report/addassignperson',async (payload,{ rejectWithValue })=>{   
  try{
      const token = isLoggedIn("adminLogin");
      console.log(token,"checking token") 
      const response = await axios.post(`${Url}admin/addAssignUser`,payload,{
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
//============================================= assign help to user api=======================================================================
export const AssignHelp=createAsyncThunk('report/assignhelp',async (payload,{ rejectWithValue })=>{   
  try{
      const token = isLoggedIn("adminLogin");
      console.log(token,"checking token") 
      const response = await axios.patch(`${Url}admin/assignHelp`,payload,{
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
//==================================Notes list================================================================================
export const notesList=createAsyncThunk('report/notesList',async (payload,{ rejectWithValue })=>{   
  try{
      const token = isLoggedIn("adminLogin");
      console.log(token,"checking token") 
      const response = await axios.get(`${Url}admin/noteList?helpId=${payload?.helpId}`,{
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
//==============================================add notes by admin====================================================================
export const AddNotes=createAsyncThunk('report/addnotes',async (payload,{ rejectWithValue })=>{   
  try{
      const token = isLoggedIn("adminLogin");
      console.log(token,"checking token") 
      const response = await axios.post(`${Url}admin/addNote`,payload,{
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
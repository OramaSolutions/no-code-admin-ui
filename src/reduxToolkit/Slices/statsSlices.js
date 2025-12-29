import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config/config.js';
import { isLoggedIn } from "../../utils";
import axiosInstance from '../../apis/axiosInstance.js';

const statsEndpoints = {
  totalUsers: '/users/total',
  activeUsers: '/users/active',
  newUsers: '/users/new',
  usersByStatus: '/users/by-status', // ✅ Changed from usersByRole
  usersWithProjects: '/users/with-projects',
  usersWithoutProjects: '/users/without-projects',
  topUsers: '/users/top',
  totalProjects: '/projects/total',
  activeProjects: '/projects/active',
  openProjects: '/projects/open', // ✅ New endpoint
  closedProjects: '/projects/closed', // ✅ Changed from completedProjects
  projectsByApprovalStatus: '/projects/by-approval-status', // ✅ New endpoint
  newProjects: '/projects/new',
  projectsByUser: '/projects/by-user',
  projectsByModel: '/projects/by-model', // ✅ Changed from projectsByCategory
  projectsWithoutUsers: '/projects/without-users',
  averageProjectsPerUser: '/average-projects-per-user',
  summary: '/summary',
};

// Helper to capitalize
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate and export async thunks for each endpoint
const thunks = {};
Object.entries(statsEndpoints).forEach(([key, endpoint]) => {
  const thunkName = `fetch${capitalize(key)}`;
  thunks[thunkName] = createAsyncThunk(
    `stats/${thunkName}`,
    async (_, { rejectWithValue }) => {
      try {
        // console.log('sta api  ')
        const response = await axiosInstance.get(
          `stats${endpoint}`
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
});

// Export each thunk individually for ES module import
export const fetchTotalUsers = thunks.fetchTotalUsers;
export const fetchActiveUsers = thunks.fetchActiveUsers;
export const fetchNewUsers = thunks.fetchNewUsers;
export const fetchUsersByStatus = thunks.fetchUsersByStatus; // ✅ Changed from fetchUsersByRole
export const fetchUsersWithProjects = thunks.fetchUsersWithProjects;
export const fetchUsersWithoutProjects = thunks.fetchUsersWithoutProjects;
export const fetchTopUsers = thunks.fetchTopUsers;
export const fetchTotalProjects = thunks.fetchTotalProjects;
export const fetchActiveProjects = thunks.fetchActiveProjects;
export const fetchOpenProjects = thunks.fetchOpenProjects; // ✅ New export
export const fetchClosedProjects = thunks.fetchClosedProjects; // ✅ Changed from fetchCompletedProjects
export const fetchProjectsByApprovalStatus = thunks.fetchProjectsByApprovalStatus; // ✅ New export
export const fetchNewProjects = thunks.fetchNewProjects;
export const fetchProjectsByUser = thunks.fetchProjectsByUser;
export const fetchProjectsByModel = thunks.fetchProjectsByModel; // ✅ Changed from fetchProjectsByCategory
export const fetchProjectsWithoutUsers = thunks.fetchProjectsWithoutUsers;
export const fetchAverageProjectsPerUser = thunks.fetchAverageProjectsPerUser;
export const fetchSummary = thunks.fetchSummary;

// ⚠️ DEPRECATED EXPORTS - Keep these for backward compatibility if needed
// Remove these once you update all components using them
export const fetchUsersByRole = thunks.fetchUsersByStatus; // Backward compatibility
export const fetchCompletedProjects = thunks.fetchClosedProjects; // Backward compatibility
export const fetchProjectsByCategory = thunks.fetchProjectsByModel; // Backward compatibility

const initialState = {
  loading: false,
  error: null,
  // Each stat will be stored by key
};

Object.keys(statsEndpoints).forEach(key => {
  initialState[key] = null;
});

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearStatsError: (state) => {
      state.error = null;
    },
    resetStats: () => initialState,
  },
  extraReducers: builder => {
    Object.entries(statsEndpoints).forEach(([key]) => {
      const thunk = thunks[`fetch${capitalize(key)}`];
      builder
        .addCase(thunk.pending, state => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state[key] = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    });
  },
});

export const { clearStatsError, resetStats } = statsSlice.actions;
export default statsSlice.reducer;

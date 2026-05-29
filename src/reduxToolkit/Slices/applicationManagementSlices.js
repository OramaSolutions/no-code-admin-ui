import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  activateNextRegistryComponent,
  activateRegistryComponentVersion,
  getRegistryApplicationDetail,
  getRegistryApplications,
  getRegistryStats,
  rollbackRegistryComponent,
  updateRegistryApplication,
  updateRegistryVersion,
} from '../../apis/applicationManagementApi';
import {
  normalizeApplicationDetail,
  normalizeApplicationList,
  normalizeRegistryStats,
} from '../../components/ApplicationManagement/utils/registryTransforms';

const buildErrorPayload = (error, fallbackMessage) => ({
  message: error?.response?.data?.message || error?.message || fallbackMessage,
  status: error?.response?.status || null,
  data: error?.response?.data || null,
});

export const fetchRegistryStats = createAsyncThunk(
  'applicationManagement/fetchRegistryStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getRegistryStats();
      return normalizeRegistryStats(data);
    } catch (error) {
      return rejectWithValue(buildErrorPayload(error, 'Unable to load registry stats.'));
    }
  }
);

export const fetchRegistryApplications = createAsyncThunk(
  'applicationManagement/fetchRegistryApplications',
  async (_, { rejectWithValue }) => {
    try {
      const applicationsData = await getRegistryApplications();
      return normalizeApplicationList(applicationsData);
    } catch (error) {
      return rejectWithValue(buildErrorPayload(error, 'Unable to load registry applications.'));
    } 
  }
);

export const fetchRegistryApplicationDetail = createAsyncThunk(
  'applicationManagement/fetchRegistryApplicationDetail',
  async (applicationId, { rejectWithValue }) => {
    try {
      const data = await getRegistryApplicationDetail(applicationId);
      return normalizeApplicationDetail(data);
    } catch (error) {
      return rejectWithValue(buildErrorPayload(error, 'Unable to load application details.'));
    }
  }
);

export const saveRegistryApplication = createAsyncThunk(
  'applicationManagement/saveRegistryApplication',
  async ({ applicationId, payload }, { rejectWithValue }) => {
    try {
      const data = await updateRegistryApplication(applicationId, payload);
      return normalizeApplicationDetail(data);
    } catch (error) {
      return rejectWithValue(buildErrorPayload(error, 'Unable to update the application.'));
    }
  }
);

export const saveRegistryVersion = createAsyncThunk(
  'applicationManagement/saveRegistryVersion',
  async ({ versionId, payload }, { rejectWithValue }) => {
    try {
      return await updateRegistryVersion(versionId, payload);
    } catch (error) {
      return rejectWithValue(buildErrorPayload(error, 'Unable to update the version.'));
    }
  }
);

export const activateComponentVersion = createAsyncThunk(
  'applicationManagement/activateComponentVersion',
  async ({ componentId, versionId }, { rejectWithValue }) => {
    try {
      return await activateRegistryComponentVersion(componentId, versionId);
    } catch (error) {
      return rejectWithValue(buildErrorPayload(error, 'Unable to activate this version.'));
    }
  }
);

export const rollbackComponentVersion = createAsyncThunk(
  'applicationManagement/rollbackComponentVersion',
  async (componentId, { rejectWithValue }) => {
    try {
      return await rollbackRegistryComponent(componentId);
    } catch (error) {
      return rejectWithValue(buildErrorPayload(error, 'Unable to roll back this component.'));
    }
  }
);

export const activateNextComponentVersion = createAsyncThunk(
  'applicationManagement/activateNextComponentVersion',
  async (componentId, { rejectWithValue }) => {
    try {
      return await activateNextRegistryComponent(componentId);
    } catch (error) {
      return rejectWithValue(buildErrorPayload(error, 'Unable to activate the next version.'));
    }
  }
);

const initialState = {
  stats: null,
  applications: [],
  selectedApplication: null,
  loadingStats: false,
  loadingApplications: false,
  loadingDetail: false,
  mutating: false,
  error: null,
  detailError: null,
};

const applicationManagementSlice = createSlice({
  name: 'applicationManagement',
  initialState,
  reducers: {
    clearApplicationManagementError: (state) => {
      state.error = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistryStats.pending, (state) => {
        state.loadingStats = true;
        state.error = null;
      })
      .addCase(fetchRegistryStats.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchRegistryStats.rejected, (state, action) => {
        state.loadingStats = false;
        state.error = action.payload;
      })
      .addCase(fetchRegistryApplications.pending, (state) => {
        state.loadingApplications = true;
        state.error = null;
      })
      .addCase(fetchRegistryApplications.fulfilled, (state, action) => {
        state.loadingApplications = false;
        state.applications = action.payload;
      })
      .addCase(fetchRegistryApplications.rejected, (state, action) => {
        state.loadingApplications = false;
        state.applications = [];
        state.error = action.payload;
      })
      .addCase(fetchRegistryApplicationDetail.pending, (state) => {
        state.loadingDetail = true;
        state.detailError = null;
      })
      .addCase(fetchRegistryApplicationDetail.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedApplication = action.payload;
      })
      .addCase(fetchRegistryApplicationDetail.rejected, (state, action) => {
        state.loadingDetail = false;
        state.detailError = action.payload;
      });

    [
      saveRegistryApplication,
      saveRegistryVersion,
      activateComponentVersion,
      rollbackComponentVersion,
      activateNextComponentVersion,
    ].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.mutating = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.mutating = false;
          if (thunk === saveRegistryApplication && action.payload?._id) {
            state.selectedApplication = action.payload;
          }
        })
        .addCase(thunk.rejected, (state, action) => {
          state.mutating = false;
          state.error = action.payload;
        });
    });
  },
});

export const { clearApplicationManagementError } = applicationManagementSlice.actions;

export default applicationManagementSlice.reducer;

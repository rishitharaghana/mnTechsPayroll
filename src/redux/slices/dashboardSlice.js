import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '../../hooks/AxiosInstance';

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async ({ role }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userToken = auth.token || JSON.parse(localStorage.getItem('userToken'))?.token;
      console.log('Fetching dashboard data for role:', role, 'with token:', userToken);
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const response = await AxiosInstance.get(`api/dashboard/${role}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log('Fetch dashboard data response:', JSON.stringify(response.data.recentActivities, null, 2));
      return response.data;
    } catch (error) {
      console.error('Fetch dashboard data error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    dashboardData: {
      stats: [],
      quickActions: [],
      recentActivities: [],
      performanceMetrics: [],
      leaveBalances: {},
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearState: (state) => {
      state.dashboardData = {
        stats: [],
        quickActions: [],
        recentActivities: [],
        performanceMetrics: [],
        leaveBalances: {},
      };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
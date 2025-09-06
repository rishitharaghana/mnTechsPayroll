import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLeaveBalances = createAsyncThunk(
  'dashboard/fetchLeaveBalances',
  async ({ employeeId }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) return rejectWithValue('No authentication token found. Please log in.');
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue('Invalid token format');
      }

      const response = await axios.get(`http://localhost:3007/api/leave-balances?employeeId=${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      console.error('Fetch leave balances error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch leave balances');
    }
  }
);

export const fetchLeaveRequests = createAsyncThunk(
  'dashboard/fetchLeaveRequests',
  async ({ employeeId, fromDate, toDate }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) return rejectWithValue('No authentication token found. Please log in.');
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue('Invalid token format');
      }

      const query = new URLSearchParams({ employeeId });
      if (fromDate) query.append('fromDate', fromDate);
      if (toDate) query.append('toDate', toDate);
      const response = await axios.get(`http://localhost:3007/api/leave-requests?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      console.error('Fetch leave requests error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch leave requests');
    }
  }
);

export const fetchAttendance = createAsyncThunk(
  'dashboard/fetchAttendance',
  async ({ employeeId, date }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) return rejectWithValue('No authentication token found. Please log in.');
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue('Invalid token format');
      }

      const query = new URLSearchParams({ employeeId });
      if (date) query.append('date', date);
      const response = await axios.get(`http://localhost:3007/api/employee/attendance?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      console.error('Fetch attendance error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch attendance');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    leaveBalances: [],
    leaveRequests: [],
    attendance: [],
    attendanceStatus: { today: 'N/A', lastUpdated: 'N/A' },
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveBalances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveBalances.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveBalances = action.payload;
      })
      .addCase(fetchLeaveBalances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.recent;
        state.attendanceStatus = action.payload.today || { today: 'N/A', lastUpdated: 'N/A' };
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
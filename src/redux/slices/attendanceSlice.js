import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const markAttendance = createAsyncThunk(
  'attendance/markAttendance',
  async ({ employee_id, date, login_time, logout_time, recipient, location }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        'http://localhost:3007/api/attendance',
        { employee_id, date, login_time, logout_time, recipient, location },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark attendance');
    }
  }
);

export const fetchEmployeeAttendance = createAsyncThunk(
  'attendance/fetchEmployeeAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.get('http://localhost:3007/api/attendance/employee', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch attendance');
    }
  }
);

export const fetchAllAttendance = createAsyncThunk(
  'attendance/fetchAllAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.get('http://localhost:3007/api/attendance/getAll', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch all attendance records');
    }
  }
);

export const fetchEmployeeAverageHours = createAsyncThunk(
  'attendance/fetchEmployeeAverageHours',
  async ({ employee_id, start_date, end_date }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.get(`http://localhost:3007/api/attendance/avg-hours/${employee_id}`, {
        params: { start_date, end_date },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('API error:', error.response?.data);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch average working hours');
    }
  }
);

export const fetchAllEmployeesTotalHours = createAsyncThunk(
  'attendance/fetchAllEmployeesTotalHours',
  async ({ start_date, end_date }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.get('http://localhost:3007/api/attendance/All/avg-hours', {
        params: { start_date, end_date },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('API error:', error.response?.data);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch total working hours');
    }
  }
);

export const fetchTotalAverageWorkingHours = createAsyncThunk(
  'attendance/fetchTotalAverageWorkingHours',
  async ({ start_date, end_date }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.get('http://localhost:3007/api/attendance/employee/avg-hours', {
        params: { start_date, end_date },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('API error:', error.response?.data);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch total average working hours');
    }
  }
);

export const updateAttendanceStatus = createAsyncThunk(
  'attendance/updateAttendanceStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.put(
        `http://localhost:3007/api/attendance/status/${id}`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update attendance status');
    }
  }
);

export const fetchDetailedAttendance = createAsyncThunk(
  'attendance/fetchDetailedAttendance',
  async ({ employee_id, start_date, end_date }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }
            const { token } = JSON.parse(userToken);

      const response = await axios.post('http://localhost:3007/api/attendance/detailed', { employee_id, start_date, end_date },
         {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch detailed attendance');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    submissions: [],
    totalWorkingHours: 0,
    averageHours: null,
    totalEmployeesHours: [],
    totalAverageHours: null,
    loading: false,
    error: null,
    successMessage: null,
    detailedAttendance: null,
  },
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.submissions.push(action.payload.data);
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeeAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.data || [];
      })
      .addCase(fetchEmployeeAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.data || [];
        state.totalWorkingHours = action.payload.data
          .filter((s) => s.login_time && s.logout_time && s.status === 'Approved')
          .reduce((total, s) => {
            const login = new Date(`1970-01-01T${s.login_time}:00`);
            const logout = new Date(`1970-01-01T${s.logout_time}:00`);
            return total + (logout - login) / (1000 * 60 * 60);
          }, 0)
          .toFixed(2);
      })
      .addCase(fetchAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeeAverageHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeAverageHours.fulfilled, (state, action) => {
        state.loading = false;
        state.averageHours = action.payload.data || null;
      })
      .addCase(fetchEmployeeAverageHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllEmployeesTotalHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEmployeesTotalHours.fulfilled, (state, action) => {
        state.loading = false;
        state.totalEmployeesHours = action.payload.data || [];
      })
      .addCase(fetchAllEmployeesTotalHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTotalAverageWorkingHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalAverageWorkingHours.fulfilled, (state, action) => {
        state.loading = false;
        state.totalAverageHours = action.payload.data || null;
      })
      .addCase(fetchTotalAverageWorkingHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAttendanceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAttendanceStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const updatedSubmission = state.submissions.find((sub) => sub.id === parseInt(action.payload.data.id));
        if (updatedSubmission) {
          updatedSubmission.status = action.payload.data.status;
        }
      })
      .addCase(updateAttendanceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDetailedAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailedAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.detailedAttendance = action.payload;
        state.successMessage = 'Detailed attendance report fetched successfully';
      })
      .addCase(fetchDetailedAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
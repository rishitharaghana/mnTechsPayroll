import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AxiosInstance from '../../hooks/AxiosInstance';

export const fetchPayslips = createAsyncThunk(
  'payslip/fetchPayslips',
  async ({ month, employeeId, page = 1, limit = 25 }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) return rejectWithValue('No authentication token found. Please log in.');
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue('Invalid token format');
      }

      const query = new URLSearchParams({ page, limit });
      if (month) query.append('month', month);
      if (employeeId) query.append('employeeId', employeeId);
      const response = await AxiosInstance.get(`api/employees/payslips?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Fetch payslips response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch payslips error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch payslips');
    }
  }
);

export const downloadPayslip = createAsyncThunk(
  'payslip/downloadPayslip',
  async ({ employeeId, month }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) return rejectWithValue('No authentication token found. Please log in.');
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue('Invalid token format');
      }

      if (!employeeId || !month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
        return rejectWithValue('Invalid employee ID or month format. Use YYYY-MM');
      }

      const response = await AxiosInstance.get(`api/payslip/${employeeId}/${month}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      // Check if response is a PDF
      if (response.headers['content-type'].includes('application/pdf')) {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Payslip_${employeeId}_${month}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('Download payslip success:', { employeeId, month });
        return { success: true };
      } else {
        // Handle JSON error response
        const text = await response.data.text();
        try {
          const json = JSON.parse(text);
          return rejectWithValue(json.error || 'Failed to download payslip');
        } catch (e) {
          return rejectWithValue('Invalid response format');
        }
      }
    } catch (error) {
      console.error('Download payslip error:', error);
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          return rejectWithValue(json.error || 'Failed to download payslip');
        } catch (e) {
          return rejectWithValue('Failed to parse error response');
        }
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to download payslip');
    }
  }
);

export const fetchRecentPayslip = createAsyncThunk(
  'payslip/fetchRecentPayslip',
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
      if (!employeeId) return rejectWithValue('Employee ID is missing');
      const query = new URLSearchParams({ limit: 1, employeeId });
      const response = await AxiosInstance.get(`api/employees/payslips?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetch recent payslip response:', response.data);
      if (!response.data.data || response.data.data.length === 0) {
        return rejectWithValue('No payslip found for the employee');
      }
      return response.data;
    } catch (error) {
      console.error('Fetch recent payslip error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch recent payslip');
    }
  }
);

const payslipSlice = createSlice({
  name: 'payslip',
  initialState: {
    payslips: [],
    totalRecords: 0,
    recentPayslip: null,
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
      .addCase(fetchPayslips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayslips.fulfilled, (state, action) => {
        state.loading = false;
        state.payslips = action.payload.data;
        state.totalRecords = action.payload.totalRecords;
      })
      .addCase(fetchPayslips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecentPayslip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentPayslip.fulfilled, (state, action) => {
        state.loading = false;
        state.recentPayslip = action.payload.data[0] || null;
      })
      .addCase(fetchRecentPayslip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(downloadPayslip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadPayslip.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadPayslip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = payslipSlice.actions;
export default payslipSlice.reducer;
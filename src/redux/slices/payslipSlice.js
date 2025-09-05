import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

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
      const response = await axios.get(`http://localhost:3007/api/employees/payslips?${query}`, {
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

      const response = await axios.get(`http://localhost:3007/api/payslip/${employeeId}/${month}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Payslip_${employeeId}_${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('Download payslip success:', { employeeId, month });
      return { success: true };
    } catch (error) {
      console.error('Download payslip error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to download payslip');
    }
  }
);

const payslipSlice = createSlice({
  name: 'payslip',
  initialState: {
    payslips: [],
    totalRecords: 0,
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
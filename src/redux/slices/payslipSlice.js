import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3007";

// Download payslip PDF//
export const downloadPayslip = createAsyncThunk(
  "payslip/downloadPayslip",
  async ({ employeeId, month }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      const response = await axios.get(`${API_BASE}/api/payslip/${employeeId}/${month}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Payslip_${employeeId}_${month}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return { success: true, employeeId, month };
    } catch (error) {
      const message =
        error.message === "Network Error"
          ? "Network error: Please check your connection"
          : error.response?.data?.message || "Failed to download payslip";
      console.error("Download payslip error:", error);
      return rejectWithValue(message);
    }
  }
);

// Fetch all payslips
export const fetchPayslips = createAsyncThunk(
  "employee/fetchPayslips",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) throw new Error("No authentication token found");
      const { token } = JSON.parse(userToken);

      const response = await axios.get(
        "http://localhost:3007/api/employees/payslips",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data; // ensure backend sends { data: [...] }
    } catch (error) {
      console.error("Fetch payslips error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || "Failed to fetch payslips");
    }
  }
);


// Payslip slice
const payslipSlice = createSlice({
  name: "payslip",
  initialState: {
    loading: false,
    error: null,
    lastDownloaded: null,
    payslips: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadPayslip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadPayslip.fulfilled, (state, action) => {
        state.loading = false;
        state.lastDownloaded = {
          employeeId: action.payload.employeeId,
          month: action.payload.month,
        };
      })
      .addCase(downloadPayslip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPayslips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayslips.fulfilled, (state, action) => {
        state.loading = false;
        state.payslips = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPayslips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = payslipSlice.actions;
export default payslipSlice.reducer;

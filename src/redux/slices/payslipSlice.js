import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const downloadPayslip = createAsyncThunk(
  "payslip/downloadPayslip",
  async ({ employeeId, month }, { rejectWithValue, getState }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      const { user } = getState().auth;
      console.log("User data:", user, "Requested employeeId:", employeeId, "month:", month); // Debug
      if (user.role === "employee" && user.employee_id !== employeeId) {
        return rejectWithValue("Access denied: You can only download your own payslip");
      }

      const response = await axios.get(
        `http://localhost:3007/api/payslip/${employeeId}/${month}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Payslip_${employeeId}_${month}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return { success: true, employeeId, month };
    } catch (error) {
      console.error("Download payslip error:", error.response?.data || error.message);
      let message = "Failed to download payslip";
      if (error.response?.status === 403) message = "Access denied";
      else if (error.response?.status === 404) message = error.response.data.error || "No payroll record found";
      else if (error.message === "Network Error") message = "Network error: Please check your connection";
      return rejectWithValue(error.response?.data?.error || message);
    }
  }
);

export const fetchPayslips = createAsyncThunk(
  "payslip/fetchPayslips",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      const response = await axios.get(
        "http://localhost:3007/api/employees/payslips",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("fetchPayslips response:", response.data);
      return response.data.data; // Expecting { message, data } from backend
    } catch (error) {
      console.error("Fetch payslips error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || "Failed to fetch payslips");
    }
  }
);

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
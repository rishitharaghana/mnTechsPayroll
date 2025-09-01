import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const downloadPayslip = createAsyncThunk(
  "payslip/downloadPayslip",
  async ({ employeeId, month }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      const response = await axios.get(`/api/payslip/${employeeId}/${month}`, {
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
        error.response?.data?.message || error.message === "Network Error"
          ? "Network error: Please check your connection"
          : "Failed to download payslip";
      console.error("Download payslip error:", error);
      return rejectWithValue(message);
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

      const response = await axios.get("/api/payslips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched payslips:", response.data);
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
      console.error("Fetch payslips error:", error);
      const message = error.response?.data?.message || "Failed to fetch payslips";
      return rejectWithValue(message);
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
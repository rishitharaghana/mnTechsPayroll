import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ngrokAxiosInstance from "../../hooks/AxiosInstance";

// Fetch payrolls for a given month
export const fetchPayroll = createAsyncThunk(
  "payroll/fetchPayroll",
  async ({ month }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      const response = await ngrokAxiosInstance.get(`/api/payroll?month=${month}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch payroll");
    }
  }
);

// Create a single payroll manually
export const createPayroll = createAsyncThunk(
  "payroll/createPayroll",
  async (payrollData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      const response = await ngrokAxiosInstance.post(`/api/payroll`, payrollData, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to create payroll");
    }
  }
);

// Generate payroll for all active employees
export const generatePayroll = createAsyncThunk(
  "payroll/generatePayroll",
  async ({ month }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      const response = await ngrokAxiosInstance.post(
        `/api/payroll/generate`,
        { month },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to generate payroll");
    }
  }
);

const payrollSlice = createSlice({
  name: "payroll",
  initialState: {
    payrollList: [],
    loading: false,
    error: null,
    successMessage: null,
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
      // Fetch payroll
      .addCase(fetchPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.payrollList = action.payload.data || [];
        state.successMessage = action.payload.message || "Payroll fetched successfully";
      })
      .addCase(fetchPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create single payroll
      .addCase(createPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.payrollList = [...state.payrollList, action.payload.data];
        state.successMessage = action.payload.message || "Payroll created successfully";
      })
      .addCase(createPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(generatePayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(generatePayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Payroll generated successfully";
      })
      .addCase(generatePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = payrollSlice.actions;
export default payrollSlice.reducer;

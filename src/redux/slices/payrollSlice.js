import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch payrolls for a given month
export const fetchPayroll = createAsyncThunk(
  "payroll/fetchPayroll",
  async ({ month }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      const response = await axios.get(`http://localhost:3007/api/payroll?month=${month}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("fetchPayroll response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("fetchPayroll error:", error.response?.data || error.message); // Debug log
      return rejectWithValue(error.response?.data?.error || "Failed to fetch payroll");
    }
  }
);

// Create a single payroll entry
export const createPayroll = createAsyncThunk(
  "payroll/createPayroll",
  async (payrollData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      // Transform payrollData to match expected structure
      const transformedData = {
        ...payrollData,
        deductions: {
          pf: payrollData.pfDeduction || 0,
          esic: payrollData.esicDeduction || 0,
          tax: payrollData.taxDeduction || 0,
        },
      };

      const response = await axios.post(`http://localhost:3007/api/payroll`, transformedData, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      console.log("createPayroll response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("createPayroll error:", error.response?.data || error.message); // Debug log
      return rejectWithValue(error.response?.data?.error || "Failed to create payroll");
    }
  }
);

// Generate payroll for all employees
export const generatePayroll = createAsyncThunk(
  "payroll/generatePayroll",
  async ({ month }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      const response = await axios.post(
        `http://localhost:3007/api/payroll/generate`,
        { month },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("generatePayroll response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("generatePayroll error:", error.response?.data || error.message); // Debug log
      return rejectWithValue(error.response?.data?.error || "Failed to generate payroll");
    }
  }
);

// Download payroll PDF
export const downloadPayrollPDF = createAsyncThunk(
  "payroll/downloadPayrollPDF",
  async ({ month, employeeId }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      const url = employeeId
        ? `http://localhost:3007/api/payroll/download-pdf?month=${month}&employee_id=${employeeId}`
        : `http://localhost:3007/api/payroll/download-pdf?month=${month}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const fileName = employeeId
        ? `Payroll_${month}_${employeeId}.pdf`
        : `Payroll_${month}_All.pdf`;
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);

      return { message: "Payroll PDF downloaded successfully" };
    } catch (error) {
      console.error("downloadPayrollPDF error:", error.response?.data || error.message); // Debug log
      return rejectWithValue("Failed to download payroll PDF");
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
      // Fetch Payroll
      .addCase(fetchPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.payrollList = action.payload.data || [];
        state.successMessage = action.payload.message || "Payroll fetched successfully";
        console.log("fetchPayroll fulfilled, payrollList:", state.payrollList); // Debug log
      })
      .addCase(fetchPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Payroll
      .addCase(createPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.payrollList = [...state.payrollList, action.payload.data];
        state.successMessage = action.payload.message || "Payroll created successfully";
        console.log("createPayroll fulfilled, payrollList:", state.payrollList); // Debug log
      })
      .addCase(createPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Generate Payroll
      .addCase(generatePayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(generatePayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.payrollList = action.payload.data || state.payrollList;
        state.successMessage = action.payload.message || "Payroll generated successfully";
        console.log("generatePayroll fulfilled, payrollList:", state.payrollList); // Debug log
      })
      .addCase(generatePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Download Payroll PDF
      .addCase(downloadPayrollPDF.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(downloadPayrollPDF.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Payroll PDF downloaded successfully";
      })
      .addCase(downloadPayrollPDF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = payrollSlice.actions;
export default payrollSlice.reducer;
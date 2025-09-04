import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPayroll = createAsyncThunk(
  "payroll/fetchPayroll",
  async ({ month }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      const response = await axios.get(
        `http://localhost:3007/api/payroll${month ? `?month=${month}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("fetchPayroll response:", response.data);
      return response.data;
    } catch (error) {
      console.error("fetchPayroll error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || "Failed to fetch payroll");
    }
  }
);

export const createPayroll = createAsyncThunk(
  "payroll/createPayroll",
  async (payrollData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      const response = await axios.post(
        "http://localhost:3007/api/payroll",
        {
          name: payrollData.name,
          id: payrollData.employeeId,
          department: payrollData.department,
          grossSalary: payrollData.grossSalary,
          pfDeduction: payrollData.pfDeduction || 0,
          esicDeduction: payrollData.esicDeduction || 0,
          taxDeduction: payrollData.taxDeduction || 0,
          netSalary: payrollData.netSalary,
          status: payrollData.status,
          paymentMethod: payrollData.paymentMethod,
          month: payrollData.month,
          paymentDate: payrollData.paymentDate,
        },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      console.log("createPayroll response:", response.data);
      return response.data;
    } catch (error) {
      console.error("createPayroll error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || "Failed to create payroll");
    }
  }
);

export const generatePayroll = createAsyncThunk(
  "payroll/generatePayroll",
  async ({ month }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);

      const response = await axios.post(
        "http://localhost:3007/api/payroll/generate",
        { month },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("generatePayroll response:", response.data);
      return response.data;
    } catch (error) {
      console.error("generatePayroll error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || "Failed to generate payroll");
    }
  }
);

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

      // Check if response is JSON (indicating an error)
      if (response.headers["content-type"].includes("application/json")) {
        const text = await response.data.text();
        const json = JSON.parse(text);
        return rejectWithValue(json.error || "Failed to download payroll PDF");
      }

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
      console.error("downloadPayrollPDF error:", error.response?.data || error.message);
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        return rejectWithValue(json.error || "Failed to download payroll PDF");
      }
      return rejectWithValue(error.response?.data?.error || "Failed to download payroll PDF");
    }
  }
);

export const generatePayrollForEmployee = createAsyncThunk(
  "payroll/generatePayrollForEmployee",
  async ({ employeeId, month }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        "http://localhost:3007/api/payroll/employee",
        { employeeId, month },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Generate payroll response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Generate payroll error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to generate payroll"
      );
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
      .addCase(fetchPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.payrollList = action.payload.data || [];
        state.successMessage = action.payload.message || "Payroll fetched successfully";
        console.log("fetchPayroll fulfilled, payrollList:", state.payrollList);
      })
      .addCase(fetchPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.payrollList = [...state.payrollList, action.payload.data];
        state.successMessage = action.payload.message || "Payroll created successfully";
        console.log("createPayroll fulfilled, payrollList:", state.payrollList);
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
        state.payrollList = action.payload.data || state.payrollList;
        state.successMessage = action.payload.message || "Payroll generated successfully";
        console.log("generatePayroll fulfilled, payrollList:", state.payrollList);
      })
      .addCase(generatePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      })
      .addCase(generatePayrollForEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(generatePayrollForEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        // Append or update payrollList
        state.payrollList = [
          ...state.payrollList.filter(
            (p) => p.employee_id !== action.payload.data.employee_id || p.month !== action.payload.data.month
          ),
          action.payload.data,
        ];
      })
      .addCase(generatePayrollForEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = payrollSlice.actions;
export default payrollSlice.reducer;
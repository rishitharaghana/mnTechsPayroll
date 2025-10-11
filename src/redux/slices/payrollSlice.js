import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../hooks/AxiosInstance";

export const fetchPayroll = createAsyncThunk(
  "payroll/fetchPayroll",
  async ({ month, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue("Invalid token format");
      }

      const query = new URLSearchParams({ page, limit });
      if (month) query.append("month", month);
      const response = await AxiosInstance.get(`api/payroll?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      console.error("fetchPayroll error:", error);
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
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue("Invalid token format");
      }

      if (!payrollData.employeeId || !payrollData.month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(payrollData.month)) {
        return rejectWithValue("Invalid employee ID or month format");
      }

      const response = await AxiosInstance.post(
        `api/payroll`,
        {
          employee_id: payrollData.employeeId,
          month: payrollData.month,
          basic_salary: payrollData.basicSalary,
          hra: payrollData.hra,
          special_allowances: payrollData.specialAllowances,
          bonus: payrollData.bonus || 0,
          gross_salary: payrollData.grossSalary,
          pf_deduction: payrollData.pfDeduction || 0,
          esic_deduction: payrollData.esicDeduction || 0,
          professional_tax: payrollData.professionalTax || 0,
          tax_deduction: payrollData.taxDeduction || 0,
          net_salary: payrollData.netSalary,
          status: payrollData.status || "Pending",
          payment_method: payrollData.paymentMethod || "Bank Transfer",
          payment_date: payrollData.paymentDate || `${payrollData.month}-01`,
        },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      console.error("createPayroll error:", error);
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
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue("Invalid token format");
      }

      if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
        return rejectWithValue("Invalid month format. Use YYYY-MM");
      }

      const response = await AxiosInstance.post(
        `api/payroll/generate`,
        { month },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      console.error("generatePayroll error:", error);
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const json = JSON.parse(text);
          return rejectWithValue(json.error || "Failed to generate payroll");
        } catch (e) {
          return rejectWithValue(text || "Failed to generate payroll");
        }
      }
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
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue("Invalid token format");
      }

      if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
        return rejectWithValue("Invalid month format. Use YYYY-MM");
      }

      const url = employeeId
        ? `api/payroll/download-pdf?month=${month}&employee_id=${employeeId}`
        : `api/payroll/download-pdf?month=${month}`;

      const response = await AxiosInstance.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

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
      console.error("downloadPayrollPDF error:", error);
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const json = JSON.parse(text);
          return rejectWithValue(json.error || "Failed to download payroll PDF");
        } catch (e) {
          return rejectWithValue(text || "Failed to download payroll PDF");
        }
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

      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue("Invalid token format");
      }

      if (!employeeId || !month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
        return rejectWithValue("Invalid employee ID or month format");
      }

      const response = await AxiosInstance.post(
        "api/payroll/employee",
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
    totalRecords: 0,
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
        state.totalRecords = action.payload.totalRecords || action.payload.data.length;
        state.successMessage = action.payload.message || "Payroll fetched successfully";
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
        state.totalRecords += 1;
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
        state.payrollList = action.payload.data || state.payrollList;
        state.totalRecords = action.payload.data?.length || state.totalRecords;
        state.successMessage = action.payload.message || "Payroll generated successfully";
      })
      .addCase(generatePayroll.rejected, (state, action) => {
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
        state.payrollList = [
          ...state.payrollList.filter(
            (p) => p.employee_id !== action.payload.data.employee_id || p.month !== action.payload.data.month
          ),
          action.payload.data,
        ];
        state.totalRecords = state.payrollList.length;
        state.successMessage = action.payload.message || "Payroll generated successfully";
      })
      .addCase(generatePayrollForEmployee.rejected, (state, action) => {
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
      });
  },
});

export const { clearState } = payrollSlice.actions;
export default payrollSlice.reducer;
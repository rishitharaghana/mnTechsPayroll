import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        "http://localhost:3007/api/employees",
        employeeData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Create employee response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create employee error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to create employee"
      );
    }
  }
);

export const createEmployeePersonalDetails = createAsyncThunk(
  "employee/createEmployeePersonalDetails",
  async (personalData, { rejectWithValue }) => {
    try {
     const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);

      const response = await axios.post(
        "http://localhost:3007/api/employees/personal-details",
        personalData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("createEmployeePersonalDetails Response:", response.data); // Debug
      return response.data;
    } catch (error) {
      console.error("createEmployeePersonalDetails Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: "Failed to save personal details" });
    }
  }
);

export const createEducationDetails = createAsyncThunk(
  "employee/createEducationDetails",
  async (educationData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        "http://localhost:3007/api/employees/education-details",
        educationData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Create education details response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create education details error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to create education details"
      );
    }
  }
);

export const createDocuments = createAsyncThunk(
  "employee/createDocuments",
  async ({ employeeId, documentType, file }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const formData = new FormData();
      formData.append("employeeId", employeeId);
      formData.append("documentType", documentType);
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:3007/api/employees/documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Create document response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create document error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to upload document"
      );
    }
  }
);

export const createBankDetails = createAsyncThunk(
  "employee/createBankDetails",
  async (bankData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        "http://localhost:3007/api/employees/bank-details",
        bankData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Create bank details response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create bank details error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to create bank details"
      );
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.put(
        `http://localhost:3007/api/employees/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Update employee response:", response.data);
      return { ...response.data, id };
    } catch (error) {
      console.error("Update employee error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to update employee"
      );
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.delete(
        `http://localhost:3007/api/employees/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { role },
        }
      );
      console.log("Delete employee response:", response.data);
      return { id, role, message: response.data.message };
    } catch (error) {
      console.error("Delete employee error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete employee"
      );
    }
  }
);

export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.get("http://localhost:3007/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetch employees response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch employees error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch employees"
      );
    }
  }
);

export const getCurrentUserProfile = createAsyncThunk(
  "employee/getCurrentUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.get("http://localhost:3007/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Get profile response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch profile"
      );
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    loading: false,
    error: null,
    successMessage: null,
    employeeId: null, // Store employeeId for multi-step form
  },
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.employeeId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.employees.push(action.payload.data);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEmployeePersonalDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmployeePersonalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.employeeId = action.payload.data.employee_id; // Store employeeId
        state.employees.push(action.payload.data);
      })
      .addCase(createEmployeePersonalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEducationDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEducationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createEducationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBankDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBankDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const { id } = action.meta.arg;
        const index = state.employees.findIndex((emp) => emp.id === id);
        if (index !== -1) {
          state.employees[index] = { ...state.employees[index], ...action.payload.data };
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const { id } = action.meta.arg;
        state.employees = state.employees.filter((emp) => emp.id !== id);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data || [];
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getCurrentUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.employeeId = action.payload.data._id || action.payload.data.id; 
      state.employees = [action.payload.data];
      state.successMessage = action.payload.message;
    })
    .addCase(getCurrentUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || 'Failed to fetch profile';
    });
  },
});

export const { clearState } = employeeSlice.actions;
export default employeeSlice.reducer;
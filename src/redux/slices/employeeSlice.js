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
      const response = await axios.post("http://localhost:3007/api/employees", employeeData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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

      return { ...response.data, id };
    } catch (error) {
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

      return { id, role, message: response.data.message };
    } catch (error) {
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

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch employees"
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
      });
  },
});

export const { clearState } = employeeSlice.actions;
export default employeeSlice.reducer;
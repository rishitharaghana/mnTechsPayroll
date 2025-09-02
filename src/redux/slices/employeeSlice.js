import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (formData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      console.log("FormData entries in thunk:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      const response = await axios.post(
        "http://localhost:3007/api/employees",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Create employee response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create employee error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Failed to create employee"
      );
    }
  }
);

export const createEmployeePersonalDetails = createAsyncThunk(
  "employee/createEmployeePersonalDetails",
  async (personalData, { rejectWithValue, getState }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token, employee_id, role } = JSON.parse(userToken);
      const payload = {
        ...personalData,
        employeeId: ["super_admin", "hr"].includes(role) ? personalData.employeeId : employee_id,
      };

      const response = await axios.post(
        "http://localhost:3007/api/employees/personal-details",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("createEmployeePersonalDetails Response:", response.data);
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
      formData.append("document", file); // Match backend field name

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
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "photo" && data[key]) {
          formData.append(key, data[key]);
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      const response = await axios.put(
        `http://localhost:3007/api/employees/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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

export const fetchEmployeeById = createAsyncThunk(
  "employee/fetchEmployeeById",
  async (id, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.get(`http://localhost:3007/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetch employee by ID response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch employee by ID error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch employee"
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

export const getEmployeeProgress = createAsyncThunk(
  "employee/getEmployeeProgress",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.get("http://localhost:3007/api/employees/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Get employee progress response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get employee progress error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch progress"
      );
    }
  }
);

export const fetchDepartments = createAsyncThunk(
  "employee/fetchDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.get("http://localhost:3007/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetch departments response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Fetch departments error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch departments"
      );
    }
  }
);

export const fetchDesignations = createAsyncThunk(
  "employee/fetchDesignations",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.get("http://localhost:3007/api/designations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetch designations response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Fetch designations error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch designations"
      );
    }
  }
);

export const fetchRoles = createAsyncThunk(
  "employee/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.get("http://localhost:3007/api/employee/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetch roles response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Fetch roles error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch roles"
      );
    }
  }
);

export const createRole = createAsyncThunk(
  "employee/createRole",
  async (roleData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        "http://localhost:3007/api/employee/role",
        roleData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Create role response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create role error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Failed to create role"
      );
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    departments: [],
    designations: [], 
     roles: [],
    currentEmployee: null,
    loading: false,
    error: null,
    successMessage: null,
    employeeId: null,
    progress: null,
  },
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.employeeId = null;
      state.currentEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.employees.push({
          ...action.payload.data,
          blood_group: action.payload.data.blood_group,
          photo_url: action.payload.data.photo_url,
        });
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEmployeePersonalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployeePersonalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.employeeId = action.payload.data.employee_id;
      })
      .addCase(createEmployeePersonalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEducationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
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
        state.error = null;
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
        state.error = null;
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
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const { id } = action.meta.arg;
        const index = state.employees.findIndex((emp) => emp.id === id);
        if (index !== -1) {
          state.employees[index] = {
            ...state.employees[index],
            ...action.payload.data,
            blood_group: action.payload.data.blood_group,
            photo_url: action.payload.data.photo_url,
          };
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
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
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = {
          ...action.payload.data,
          blood_group: action.payload.data.blood_group,
          photo_url: action.payload.data.photo_url,
        };
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data.map((emp) => ({
          ...emp,
          blood_group: emp.blood_group,
          photo_url: emp.photo_url,
        })) || [];
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
        state.employeeId = action.payload.data.employee_id;
        state.employees = [{
          ...action.payload.data,
          blood_group: action.payload.data.blood_group,
          photo_url: action.payload.data.photo_url,
        }];
        state.successMessage = action.payload.message;
      })
      .addCase(getCurrentUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch profile";
      })
      .addCase(getEmployeeProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload.data;
      })
      .addCase(getEmployeeProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload || []; 
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDesignations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.designations = action.payload || []; 
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload || [];
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.roles.push(action.payload.data || {
          name: action.meta.arg.name,
          description: action.meta.arg.description,
          role_id: action.meta.arg.role_id,
          isHRRole: action.meta.arg.isHRRole,
        });
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = employeeSlice.actions;
export default employeeSlice.reducer;
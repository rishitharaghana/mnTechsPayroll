import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../hooks/AxiosInstance";

export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (formData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      let token;
      try {
        const parsedToken = JSON.parse(userToken);
        token = parsedToken.token;
        if (!token) {
          return rejectWithValue("Invalid token format. Please log in again.");
        }
      } catch (parseError) {
        console.error("Error parsing userToken:", parseError);
        return rejectWithValue("Invalid token format. Please log in again.");
      }

      console.log("FormData entries in createEmployee:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      const response = await AxiosInstance.post(
        "api/employees",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );
      console.log("Create employee response:", response.data);

      // Validate response structure
      if (!response.data.data || !response.data.data.employee_id) {
        console.error("Invalid response structure:", response.data);
        return rejectWithValue(
          "Invalid response from server: missing employee_id"
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        "Create employee error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error ||
          error.message ||
          "Failed to create employee"
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

      const { token, employee_id, role } = JSON.parse(userToken);
      const payload = {
        ...personalData,
        employeeId: ["super_admin", "hr"].includes(role)
          ? personalData.employeeId
          : employee_id,
      };

      const response = await AxiosInstance.post(
        "api/employees/personal-details",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Create personal details response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Create personal details error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to save personal details"
      );
    }
  }
);

export const updateEmployeePersonalDetails = createAsyncThunk(
  "employee/updateEmployeePersonalDetails",
  async (personalData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token, employee_id, role } = JSON.parse(userToken);
      const payload = {
        ...personalData,
        employeeId: ["super_admin", "hr"].includes(role)
          ? personalData.employeeId
          : employee_id,
      };

      const response = await AxiosInstance.put(
        `api/employees/personal-details/${payload.employeeId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Update personal details response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Update personal details error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to update personal details"
      );
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
      const response = await AxiosInstance.post(
        "api/employees/education-details",
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

export const updateEducationDetails = createAsyncThunk(
  "employee/updateEducationDetails",
  async (educationData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await AxiosInstance.put(
        `api/employees/education-details/${educationData.employee_id}`,
        educationData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Update education details response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update education details error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to update education details"
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
      formData.append("documentType", documentType.toLowerCase());
      formData.append("document", file);

      const response = await AxiosInstance.post(
        "api/employees/documents",
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
      const response = await AxiosInstance.post(
        "api/employees/bank-details",
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

export const updateBankDetails = createAsyncThunk(
  "employee/updateBankDetails",
  async (bankData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await AxiosInstance.put(
        `api/employees/bank-details/${bankData.employee_id}`,
        bankData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Update bank details response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update bank details error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to update bank details"
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

      const response = await AxiosInstance.put(
        `api/employees/${id}`,
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
  async (
    {
      id,
      role,
      exitType,
      reason,
      noticeStartDate,
      lastWorkingDate,
      restrictLeaves,
      exitChecklist,
    },
    { rejectWithValue }
  ) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await AxiosInstance.post(
        `api/employees/${id}/terminate`,
        {
          role,
          exitType,
          reason,
          noticeStartDate,
          lastWorkingDate,
          restrictLeaves,
          exitChecklist,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Terminate employee response:", response.data);
      return {
        id,
        role,
        message: response.data.message,
        status: response.data.status,
      };
    } catch (error) {
      console.error("Terminate employee error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to terminate employee"
      );
    }
  }
);

export const fetchAlumni = createAsyncThunk(
  "employee/fetchAlumni",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await AxiosInstance.get(
        "api/employees/alumni",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetch alumni response:", response.data);
      return response.data.data; // Expecting the alumni array from response.data.data
    } catch (error) {
      console.error(
        "Fetch alumni error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch alumni"
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
      const response = await AxiosInstance.get("api/employees", {
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
      const response = await AxiosInstance.get(
        `api/employees/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetch employee by ID response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Fetch employee by ID error:",
        error.response?.data || error.message
      );
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
      const response = await AxiosInstance.get("api/profile", {
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
      const response = await AxiosInstance.get(
        "api/employees/progress",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
      const response = await AxiosInstance.get(
        "api/departments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetch departments response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "Fetch departments error:",
        error.response?.data || error.message
      );
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
      const response = await AxiosInstance.get(
        "api/designations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetch designations response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "Fetch designations error:",
        error.response?.data || error.message
      );
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
      const response = await AxiosInstance.get(
        "api/employee/roles",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetch roles response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "Fetch roles error:",
        error.response?.data || error.message
      );
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
      const response = await AxiosInstance.post(
        "api/employee/role",
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
      console.error(
        "Create role error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to create role"
      );
    }
  }
);

export const fetchEmployeePersonalDetails = createAsyncThunk(
  "employee/fetchEmployeePersonalDetails",
  async (employeeId, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await AxiosInstance.get(
        `api/employees/personal-details/${employeeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetch personal details response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Fetch personal details error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch personal details"
      );
    }
  }
);

export const fetchEmployeeEducationDetails = createAsyncThunk(
  "employee/fetchEmployeeEducationDetails",
  async (employeeId, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await AxiosInstance.get(
        `api/employees/education-details/${employeeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetch education details response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Fetch education details error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch education details"
      );
    }
  }
);

export const fetchEmployeeDocuments = createAsyncThunk(
  "employee/fetchEmployeeDocuments",
  async (employeeId, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await AxiosInstance.get(
        `api/employees/documents/${employeeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetch documents response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Fetch documents error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch documents"
      );
    }
  }
);

export const fetchEmployeeBankDetails = createAsyncThunk(
  "employee/fetchEmployeeBankDetails",
  async (employeeId, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await AxiosInstance.get(
        `api/employees/bank-details/${employeeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetch bank details response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Fetch bank details error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch bank details"
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
    personalDetails: null,
    educationDetails: null,
    documents: [],
    bankDetails: null,
    loading: false,
    error: null,
    profile: null,
    successMessage: null,
    employeeId: null,
    progress: null,
    salaryStructure: null,
    alumni: [],
  },
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.personalDetails = null;
      state.educationDetails = null;
      state.documents = [];
      state.bankDetails = null;
      state.employeeId = null;
      state.currentEmployee = null;
      state.profile = null;
      state.progress = null;
      state.salaryStructure = null;
      state.alumni = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.employees.push({
          ...action.payload.data,
          blood_group: action.payload.data.blood_group,
          photo_url: action.payload.data.photo_url,
        });
        state.salaryStructure = action.payload.data.salary_structure; // Store salary structure
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEmployeePersonalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createEmployeePersonalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.employeeId = action.payload.data.employee_id;
        state.personalDetails = action.payload.data;
      })
      .addCase(createEmployeePersonalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || action.payload;
      })
      .addCase(updateEmployeePersonalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateEmployeePersonalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.personalDetails = action.payload.data;
      })
      .addCase(updateEmployeePersonalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEducationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createEducationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.educationDetails = action.payload.data;
      })
      .addCase(createEducationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEducationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateEducationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.educationDetails = action.payload.data;
      })
      .addCase(updateEducationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.documents = [...state.documents, action.payload.data];
      })
      .addCase(createDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBankDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createBankDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.bankDetails = action.payload.data;
      })
      .addCase(createBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBankDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateBankDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.bankDetails = action.payload.data;
      })
      .addCase(updateBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
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
        state.successMessage = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const { id, status } = action.payload;
        const index = state.employees.findIndex((emp) => emp.id === id);
        if (index !== -1) {
          state.employees[index].status = status;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAlumni.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchAlumni.fulfilled, (state, action) => {
        state.loading = false;
        state.alumni = action.payload || [];
        state.successMessage = "Alumni fetched successfully";
      })
      .addCase(fetchAlumni.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
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
        state.successMessage = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
        state.error = null;
        state.successMessage = action.payload.message || null;
      })

      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(getCurrentUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data || null;
        state.employeeId = action.payload.data?.employee_id || null;
        state.successMessage = action.payload.message;
        console.log("Profile updated in state:", action.payload.data);
      })
      .addCase(getCurrentUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profile = null;
        console.error("Profile fetch error:", action.payload);
      })
      .addCase(getEmployeeProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
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
        state.successMessage = null;
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
        state.successMessage = null;
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
        state.successMessage = null;
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
        state.roles.push(
          action.payload.data || {
            name: action.meta.arg.name,
            description: action.meta.arg.description,
            role_id: action.meta.arg.role_id,
            isHRRole: action.meta.arg.isHRRole,
          }
        );
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeePersonalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchEmployeePersonalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.personalDetails = action.payload;
      })
      .addCase(fetchEmployeePersonalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeeEducationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchEmployeeEducationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.educationDetails = action.payload;
      })
      .addCase(fetchEmployeeEducationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeeDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchEmployeeDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchEmployeeDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeeBankDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchEmployeeBankDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.bankDetails = action.payload;
      })
      .addCase(fetchEmployeeBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = employeeSlice.actions;
export default employeeSlice.reducer;

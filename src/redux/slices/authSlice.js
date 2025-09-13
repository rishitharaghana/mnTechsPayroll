import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
  "auth/login",
  async ({ mobileNumber, password, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3007/api/login", {
        mobile: mobileNumber,
        password,
        role,
      });
      console.log("Login response:", response.data); 
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("userToken"));
      const token = storedUser?.token;

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        "http://localhost:3007/api/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Change password response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Change password error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Password change failed"
      );
    }
  }
);

export const checkMobileAndRoleExists = createAsyncThunk(
  "auth/checkMobileAndRoleExists",
  async ({ mobile, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3007/api/check-mobile", {
        mobile,
        role,
      });
      console.log("Check mobile and role response:", response.data);
      return response.data.exists;
    } catch (error) {
      console.error("Check mobile and role error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Mobile and role verification failed"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ mobileNumber, newPassword, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3007/api/forgot-password", {
        mobile: mobileNumber,
        newPassword,
        role,
      });
      console.log("Forgot password response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Forgot password error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Password reset failed"
      );
    }
  }
);

const storedUser = JSON.parse(localStorage.getItem("userToken"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser
      ? {
          role: storedUser.role,
          email: storedUser.email,
          id: storedUser.id,
          employee_id: storedUser.employee_id, 
        }
      : null,
    token: storedUser?.token || null,
    role: storedUser?.role || null,
    isAuthenticated: !!storedUser,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("userToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.id,
          employee_id: action.payload.employee_id, 
          name: action.payload.full_name || "",
          mobile: action.payload.mobile,
          role: action.payload.role,
          email: action.payload.email || null,
          department: action.payload.department || null,
          isTemporaryPassword: action.payload.isTemporaryPassword || false,
        };
        state.token = action.payload.token;
        state.role = action.payload.role;
        localStorage.setItem(
          "userToken",
          JSON.stringify({
            token: action.payload.token,
            role: action.payload.role,
            email: action.payload.email || null,
            id: action.payload.id,
            employee_id: action.payload.employee_id, 
            isTemporaryPassword: action.payload.isTemporaryPassword || false,
          })
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        if (state.user) {
          state.user.isTemporaryPassword = false;
          const storedUser = JSON.parse(localStorage.getItem("userToken"));
          localStorage.setItem(
            "userToken",
            JSON.stringify({
              ...storedUser,
              isTemporaryPassword: false,
            })
          );
        }
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(checkMobileAndRoleExists.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.mobileExists = false;
      })
      .addCase(checkMobileAndRoleExists.fulfilled, (state, action) => {
        state.loading = false;
        state.mobileExists = action.payload;
      })
      .addCase(checkMobileAndRoleExists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.mobileExists = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.mobileExists = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
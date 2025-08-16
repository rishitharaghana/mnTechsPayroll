import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async ({ mobileNumber, password, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/login", {
        mobile: mobileNumber,
        password,
        role,
      });
      return response.data; // backend returns token + user info
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

// Load saved user from localStorage
const storedUser = JSON.parse(localStorage.getItem("userToken"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser
      ? {
          id: storedUser.id,
          name: storedUser.name,
          mobile: storedUser.mobile,
          role: storedUser.role,
          email: storedUser.email,
          department: storedUser.department,
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

        // Match backend response
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          mobile: action.payload.mobile,
          role: action.payload.role,
          email: action.payload.email,
          department: action.payload.department,
        };
        state.token = action.payload.token;
        state.role = action.payload.role;

        // Save to localStorage
        localStorage.setItem(
          "userToken",
          JSON.stringify({
            token: action.payload.token,
            id: action.payload.id,
            name: action.payload.name,
            mobile: action.payload.mobile,
            role: action.payload.role,
            email: action.payload.email,
            department: action.payload.department,
          })
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

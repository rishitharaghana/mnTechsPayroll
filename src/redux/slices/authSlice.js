import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ngrokAxiosInstance from "../../hooks/AxiosInstance";

export const login = createAsyncThunk(
  "auth/login",
  async ({ mobileNumber, password, role }, { rejectWithValue }) => {
    try {
      const response = await ngrokAxiosInstance.post("/api/login", {
        mobile: mobileNumber,
        password,
        role,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);
const storedUser = JSON.parse(localStorage.getItem("userToken"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser
      ? { role: storedUser.role, email: storedUser.email }
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
          name: action.payload.name || "",
          mobile: action.payload.mobile,
          role: action.payload.role,
          email: action.payload.email || null,
          department: action.payload.department || null,
        };
        state.token = action.payload.token;
        state.role = action.payload.role;
        localStorage.setItem(
          "userToken",
          JSON.stringify({
            token: action.payload.token,
            role: action.payload.role,
            email: action.payload.email || null,
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

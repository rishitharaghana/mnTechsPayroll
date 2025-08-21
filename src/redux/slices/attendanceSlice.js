import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const markAttendance = createAsyncThunk(
  "attendance/markAttendance",
  async (attendanceData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        "http://localhost:3007/api/attendance",
        attendanceData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to mark attendance"
      );
    }
  }
);

export const fetchEmployeeAttendance = createAsyncThunk(
  "attendance/fetchEmployeeAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.get("http://localhost:3007/api/attendance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch attendance"
      );
    }
  }
);

export const fetchAllAttendance = createAsyncThunk(
  "attendance/fetchAllAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.get("http://localhost:3007/api/attendance/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch all attendance records"
      );
    }
  }
);

export const updateAttendanceStatus = createAsyncThunk(
  "attendance/updateAttendanceStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.put(
        `http://localhost:3007/api/attendance/status/${id}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update attendance status"
      );
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    submissions: [],
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
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.submissions.push(action.payload.data);
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeeAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeeAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.data || [];
      })
      .addCase(fetchEmployeeAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.data || [];
      })
      .addCase(fetchAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAttendanceStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAttendanceStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const updatedSubmission = state.submissions.find(
          (sub) => sub.id === action.payload.data.id
        );
        if (updatedSubmission) {
          updatedSubmission.status = action.payload.data.status;
        }
      })
      .addCase(updateAttendanceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
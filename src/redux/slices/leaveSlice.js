import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const applyLeave = createAsyncThunk(
  "leaves/applyLeave",
  async (leaveData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        "http://localhost:3007/api/leaves",
        { ...leaveData, leave_status: leaveData.leave_status || "Paid" }, // Ensure leave_status is sent
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("applyLeave response:", response.data);
      return response.data;
    } catch (error) {
      console.error("applyLeave error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Failed to apply leave"
      );
    }
  }
);

export const fetchMyLeaves = createAsyncThunk(
  "leaves/fetchMyLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.get("http://localhost:3007/api/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("fetchMyLeaves response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("fetchMyLeaves error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch leaves"
      );
    }
  }
);

export const fetchPendingLeaves = createAsyncThunk(
  "leaves/fetchPendingLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.get(
        "http://localhost:3007/api/leaves/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("fetchPendingLeaves response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        "fetchPendingLeaves error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch pending leaves"
      );
    }
  }
);

export const fetchAllLeaves = createAsyncThunk(
  "leaves/fetchAllLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.get(
        "http://localhost:3007/api/leaves/getAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("fetchAllLeaves response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("fetchAllLeaves error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch all leaves"
      );
    }
  }
);

export const approveLeave = createAsyncThunk(
  "leaves/approveLeave",
  async (leave_id, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.put(
        `http://localhost:3007/api/leaves/${leave_id}`,
        { leave_id, status: "Approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("approveLeave response:", response.data);
      return { leave_id, message: response.data.message };
    } catch (error) {
      console.error("approveLeave error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Failed to approve leave"
      );
    }
  }
);

export const rejectLeave = createAsyncThunk(
  "leaves/rejectLeave",
  async (leave_id, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.put(
        `http://localhost:3007/api/leaves/${leave_id}`,
        { leave_id, status: "Rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("rejectLeave response:", response.data);
      return { leave_id, message: response.data.message };
    } catch (error) {
      console.error("rejectLeave error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Failed to reject leave"
      );
    }
  }
);

export const fetchRecipientOptions = createAsyncThunk(
  "leaves/fetchRecipientOptions",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.get(
        "http://localhost:3007/api/leaves/recipient-options",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("fetchRecipientOptions response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        "fetchRecipientOptions error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch recipient options"
      );
    }
  }
);

export const fetchLeaveBalances = createAsyncThunk(
  "leaves/fetchLeaveBalances",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.get(
        "http://localhost:3007/api/leaves/balances",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("fetchLeaveBalances response:", response.data);
      return response.data; // Expect { paid: X }
    } catch (error) {
      console.error(
        "fetchLeaveBalances error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch leave balances"
      );
    }
  }
);

export const allocateMonthlyLeaves = createAsyncThunk(
  "leaves/allocateMonthlyLeaves",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        "http://localhost:3007/api/leaves/total-leaves",
        { year, month },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("allocateMonthlyLeaves response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "allocateMonthlyLeaves error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { error: "Failed to allocate monthly leaves" }
      );
    }
  }
);

export const allocateSpecialLeave = createAsyncThunk(
  "leaves/allocateSpecialLeave",
  async ({ employee_id, days }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        "http://localhost:3007/api/leaves/special-leaves",
        { leave_type: "paid", employee_id, days }, // Force leave_type to 'paid'
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("allocateSpecialLeave response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "allocateSpecialLeave error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to allocate special leave"
      );
    }
  }
);

const leaveSlice = createSlice({
  name: "leaves",
  initialState: {
    leaves: [],
    pendingLeaves: [],
    recipients: [],
    leaveBalances: { paid: 0 }, 
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
      .addCase(applyLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Leave applied successfully";
        state.leaves.push(action.payload.leave || action.payload);
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
        console.log("fetchMyLeaves fulfilled, leaves:", action.payload);
      })
      .addCase(fetchMyLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPendingLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchPendingLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingLeaves = action.payload;
        state.successMessage = "Pending leaves fetched successfully";
        console.log("fetchPendingLeaves fulfilled, pendingLeaves:", action.payload);
      })
      .addCase(fetchPendingLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
        state.successMessage = "All leaves fetched successfully";
        console.log("fetchAllLeaves fulfilled, leaves:", action.payload);
      })
      .addCase(fetchAllLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.pendingLeaves = state.pendingLeaves.filter(
          (leave) => leave.id !== action.payload.leave_id
        );
        state.leaves = state.leaves.map((leave) =>
          leave.id === action.payload.leave_id
            ? { ...leave, status: "Approved", approved_at: new Date().toISOString() }
            : leave
        );
      })
      .addCase(approveLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rejectLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.pendingLeaves = state.pendingLeaves.filter(
          (leave) => leave.id !== action.payload.leave_id
        );
        state.leaves = state.leaves.map((leave) =>
          leave.id === action.payload.leave_id
            ? { ...leave, status: "Rejected", approved_at: new Date().toISOString() }
            : leave
        );
      })
      .addCase(rejectLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecipientOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchRecipientOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.recipients = action.payload;
        console.log("fetchRecipientOptions fulfilled, recipients:", action.payload);
      })
      .addCase(fetchRecipientOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLeaveBalances.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchLeaveBalances.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveBalances = { paid: action.payload.paid || 0 }; 
        console.log("fetchLeaveBalances fulfilled, leaveBalances:", action.payload);
      })
      .addCase(fetchLeaveBalances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(allocateMonthlyLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(allocateMonthlyLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Monthly leaves allocated successfully";
        console.log("allocateMonthlyLeaves fulfilled:", action.payload);
      })
      .addCase(allocateMonthlyLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(allocateSpecialLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(allocateSpecialLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Special leave allocated successfully";
        console.log("allocateSpecialLeave fulfilled:", action.payload);
      })
      .addCase(allocateSpecialLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = leaveSlice.actions;
export default leaveSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ngrokAxiosInstance from '../../hooks/AxiosInstance';

export const fetchMyLeaves = createAsyncThunk(
  'leaves/fetchLeaves',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ngrokAxiosInstance.get('/api/leaves');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching leaves');
    }
  }
);

export const fetchPendingLeaves = createAsyncThunk(
  'leaves/fetchPendingLeaves',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ngrokAxiosInstance.get('/api/leaves');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching pending leaves');
    }
  }
);

export const applyLeave = createAsyncThunk(
  'leaves/applyLeave',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await ngrokAxiosInstance.post('/api/leaves', leaveData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error applying leave');
    }
  }
);

export const approveLeave = createAsyncThunk(
  'leaves/approveLeave',
  async (leaveId, { rejectWithValue }) => {
    try {
      await ngrokAxiosInstance.put(`/api/leaves/${leaveId}/approve`);
      return leaveId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error approving leave');
    }
  }
);

export const rejectLeave = createAsyncThunk(
  'leaves/rejectLeave',
  async (leaveId, { rejectWithValue }) => {
    try {
      await ngrokAxiosInstance.put(`/api/leaves/${leaveId}/reject`);
      return leaveId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error rejecting leave');
    }
  }
);

const leaveSlice = createSlice({
  name: 'leaves',
  initialState: {
    leaves: [],
    pendingLeaves: [],
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetLeaveState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
      })
      .addCase(fetchMyLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPendingLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingLeaves = action.payload;
      })
      .addCase(fetchPendingLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(applyLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(applyLeave.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        const id = action.payload;
        const leave = state.leaves.find((l) => l.id === id);
        if (leave) leave.status = 'Approved';
        state.pendingLeaves = state.pendingLeaves.filter((l) => l.id !== id);
      })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        const id = action.payload;
        const leave = state.leaves.find((l) => l.id === id);
        if (leave) leave.status = 'Rejected';
        state.pendingLeaves = state.pendingLeaves.filter((l) => l.id !== id);
      });
  },
});

export const { resetLeaveState } = leaveSlice.actions;
export default leaveSlice.reducer;
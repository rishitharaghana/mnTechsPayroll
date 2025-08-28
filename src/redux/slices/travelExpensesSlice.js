import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const submitTravelExpense = createAsyncThunk(
  'travelExpense/submitTravelExpense',
  async (travelData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) {
        throw new Error('No token found');
      }
      const formData = new FormData();
      formData.append('employee_id', travelData.employee_id);
      formData.append('travel_date', travelData.travel_date);
      formData.append('destination', travelData.destination);
      formData.append('travel_purpose', travelData.travel_purpose);
      formData.append('total_amount', travelData.total_amount);
      formData.append('expenses', JSON.stringify(travelData.expenses.map(exp => ({
        expense_date: exp.date, 
        purpose: exp.purpose,
        amount: exp.amount,
        hasReceipt: exp.hasReceipt,
      }))));

      travelData.expenses.forEach((expense) => {
        if (expense.receipt) {
          formData.append('receipts', expense.receipt); 
        }
      });

      const response = await axios.post('http://localhost:3007/api/travel-expenses', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit travel expense');
    }
  }
);
export const fetchTravelExpenses = createAsyncThunk(
  "travelExpense/fetchTravelExpenses",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const response = await axios.get(`http://localhost:3007/api/travel-expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch travel expenses");
    }
  }
);

export const updateTravelExpenseStatus = createAsyncThunk(
  "travelExpense/updateTravelExpenseStatus",
  async ({ id, status, admin_comment }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const response = await axios.put(
        `http://localhost:3007/api/travel-expenses/${id}`,
        { status, admin_comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to update travel expense");
    }
  }
);

const travelExpenseSlice = createSlice({
  name: "travelExpense",
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
      .addCase(submitTravelExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitTravelExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(submitTravelExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTravelExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchTravelExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTravelExpenseStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTravelExpenseStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const index = state.submissions.findIndex((sub) => sub.id === action.payload.data.id);
        if (index !== -1) {
          state.submissions[index] = {
            ...state.submissions[index],
            status: action.payload.data.status,
            admin_comment: action.payload.data.admin_comment,
          };
        }
      })
      .addCase(updateTravelExpenseStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = travelExpenseSlice.actions;
export default travelExpenseSlice.reducer;
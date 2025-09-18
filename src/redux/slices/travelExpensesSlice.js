import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const submitTravelExpense = createAsyncThunk(
  "travelExpense/submitTravelExpense",
  async (travelData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue("Invalid token format");
      }

      const formData = new FormData();
      formData.append("employee_id", travelData.employee_id);
      formData.append("travel_date", travelData.travel_date);
      formData.append("destination", travelData.destination);
      formData.append("travel_purpose", travelData.travel_purpose);
      formData.append("total_amount", travelData.total_amount);
      formData.append(
        "expenses",
        JSON.stringify(
          travelData.expenses.map((exp) => ({
            expense_date: exp.date,
            purpose: exp.purpose,
            amount: exp.amount,
          }))
        )
      );

      if (travelData.receipt) {
        formData.append("receipt", travelData.receipt);
      }

      const response = await axios.post(
        "http://localhost:3007/api/travel-expenses",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Submit travel expense response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Submit travel expense error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to submit travel expense"
      );
    }
  }
);

export const fetchTravelExpenses = createAsyncThunk(
  "travelExpense/fetchTravelExpenses",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue("Invalid token format");
      }

      const response = await axios.get(
        `http://localhost:3007/api/travel-expenses`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit },
        }
      );
      console.log("Fetch travel expenses response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch travel expenses error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch travel expenses"
      );
    }
  }
);

export const fetchTravelExpenseHistory = createAsyncThunk(
  "travelExpense/fetchTravelExpenseHistory",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue("Invalid token format");
      }

      const response = await axios.get(
        `http://localhost:3007/api/travel-expenses/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit },
        }
      );
      console.log("Fetch travel expense history response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch travel expense history error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch travel expense history"
      );
    }
  }
);

export const updateTravelExpenseStatus = createAsyncThunk(
  "travelExpense/updateTravelExpenseStatus",
  async ({ id, status, admin_comment }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue("Invalid token format");
      }

      const response = await axios.put(
        `http://localhost:3007/api/travel-expenses/${id}`,
        { status, admin_comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Update travel expense status response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update travel expense status error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to update travel expense"
      );
    }
  }
);

const travelExpenseSlice = createSlice({
  name: "travelExpense",
  initialState: {
    submissions: [],
    history: [],
    loading: false,
    error: null,
    successMessage: null,
    pagination: {
      submissions: { total: 0, page: 1, limit: 10, totalPages: 1 },
      history: { total: 0, page: 1, limit: 10, totalPages: 1 },
    },
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
        state.submissions.push(action.payload.data);
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
        state.submissions = action.payload.data || [];
        state.pagination.submissions = action.payload.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        };
      })
      .addCase(fetchTravelExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTravelExpenseHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelExpenseHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.data || [];
        state.pagination.history = action.payload.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        };
      })
      .addCase(fetchTravelExpenseHistory.rejected, (state, action) => {
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
        const index = state.submissions.findIndex(
          (sub) => sub.id === action.payload.data.id
        );
        if (index !== -1) {
          state.submissions[index] = {
            ...state.submissions[index],
            status: action.payload.data.status,
            admin_comment: action.payload.data.admin_comment,
          };
        }
        const historyIndex = state.history.findIndex(
          (sub) => sub.id === action.payload.data.id
        );
        if (historyIndex !== -1) {
          state.history[historyIndex] = {
            ...state.history[historyIndex],
            status: action.payload.data.status,
            admin_comment: action.payload.data.admin_comment,
          };
        } else {
          state.history.push({
            ...action.payload.data,
            employee_name: state.submissions[index]?.employee_name || "N/A",
            department_name: state.submissions[index]?.department_name || "N/A",
            expenses: state.submissions[index]?.expenses || [],
          });
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
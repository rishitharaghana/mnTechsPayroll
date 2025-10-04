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
        `http://localhost:3007/api/travel-expenses?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetch travel expenses response:", JSON.stringify(response.data, null, 2));
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
        `http://localhost:3007/api/travel-expenses/history?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetch travel expense history response:", JSON.stringify(response.data, null, 2));
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
  "travelExpenses/updateTravelExpenseStatus",
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Update travel expense status response:", response.data);
      return { ...response.data, metaId: id, metaStatus: status };  
    } catch (error) {
      console.error("Update travel expense status error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to update travel expense status"
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
        state.submissions = action.payload.data.map((submission) => ({
          id: submission.id,
          employee_id: submission.employee_id,
          employee_name: submission.employee_name,
          department_name: submission.department_name,
          travel_date: submission.travel_date,
          destination: submission.destination,
          travel_purpose: submission.travel_purpose,
          total_amount: Number(submission.total_amount),
          status: submission.status,
          approved_by: submission.approved_by,
          created_at: submission.created_at,
          updated_at: submission.updated_at,
          admin_comment: submission.admin_comment,
          receipt_path: submission.receipt_path,
          expenses: submission.expenses || [],
        }));
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
        state.history = [];
      })
      .addCase(fetchTravelExpenseHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.data.map((submission) => ({
          id: submission.id,
          employee_id: submission.employee_id,
          employee_name: submission.employee_name,
          department_name: submission.department_name,
          travel_date: submission.travel_date,
          destination: submission.destination,
          travel_purpose: submission.travel_purpose,
          total_amount: Number(submission.total_amount),
          status: submission.status,
          approved_by: submission.approved_by,
          created_at: submission.created_at,
          updated_at: submission.updated_at,
          admin_comment: submission.admin_comment,
          receipt_path: submission.receipt_path,
          expenses: submission.expenses || [],
        }));
        state.pagination.history = action.payload.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        };
        console.log("Updated history state:", JSON.stringify(state.history, null, 2));
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
            updated_at: new Date().toISOString(),
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
            updated_at: new Date().toISOString(),
          };
        } else if (action.payload.data.status === "Approved" || action.payload.data.status === "Rejected") {
          const submission = state.submissions[index] || {};
          state.history.push({
            id: action.payload.data.id,
            employee_id: submission.employee_id,
            employee_name: submission.employee_name,
            department_name: submission.department_name,
            travel_date: submission.travel_date,
            destination: submission.destination,
            travel_purpose: submission.travel_purpose,
            total_amount: Number(submission.total_amount),
            status: action.payload.data.status,
            approved_by: action.payload.data.approved_by,
            created_at: submission.created_at,
            updated_at: new Date().toISOString(),
            admin_comment: action.payload.data.admin_comment,
            receipt_path: submission.receipt_path, 
            expenses: submission.expenses || [],
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
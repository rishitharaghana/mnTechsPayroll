import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSubmissions = createAsyncThunk(
  "expense/fetchSubmissions",
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("userToken"));
      const token = storedUser?.token;

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get("http://localhost:3007/api/travel-expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const mappedData = response.data.data.map((sub) => ({
        id: sub.id,
        employeeId: sub.employee_id,
        submissionDate: sub.created_at,
        status: sub.status,
        totalAmount: sub.total_amount,
        travelDate: sub.travel_date,
        destination: sub.destination,
        purpose: sub.travel_purpose,
        department: sub.user_role, 
        expenses: sub.expenses.map((exp) => ({
          date: exp.expense_date,
          category: exp.category,
          purpose: exp.purpose,
          amount: exp.amount,
          receipt: exp.receipts ? { name: exp.receipts.file_name } : null,
        })),
        receipts: sub.receipts,
      }));
      return mappedData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch submissions");
    }
  }
);

export const updateSubmissionStatus = createAsyncThunk(
  "expense/updateSubmissionStatus",
  async ({ submissionId, status, adminComment }, { rejectWithValue }) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("userToken"));
      const token = storedUser?.token;

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `http://localhost:3007/api/travel-expenses/${submissionId}/approve`,
        { status, adminComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        id: response.data.data.id,
        status: response.data.data.status,
        approvedBy: response.data.data.approved_by,
        adminComment,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to update submission");
    }
  }
);

const travelExpensesSlice = createSlice({
  name: "expense",
  initialState: {
    submissions: [],
    showToast: false,
    loading: false,
    error: null,
  },
  reducers: {
    setShowToast: (state, action) => {
      state.showToast = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSubmissionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubmissionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = state.submissions.map((sub) =>
          sub.id === action.payload.id
            ? { ...sub, status: action.payload.status, adminComment: action.payload.adminComment }
            : sub
        );
        state.showToast = true;
        setTimeout(() => {
          state.showToast = false;
        }, 2000);
      })
      .addCase(updateSubmissionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setShowToast } = travelExpensesSlice.actions;
export default travelExpensesSlice.reducer;
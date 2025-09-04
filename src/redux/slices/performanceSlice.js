import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const setEmployeeGoal = createAsyncThunk(
  "performance/setEmployeeGoal",
  async (goalData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        "http://localhost:3007/api/employee/goals",
        goalData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to set goal");
    }
  }
);

export const updateGoalProgress = createAsyncThunk(
  "performance/updateGoalProgress",
  async ({ goal_id, progress, status }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.put(
        `http://localhost:3007/api/employee-performance/goals/${goal_id}`,
        { progress, status },
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
        error.response?.data?.error || "Failed to update goal progress"
      );
    }
  }
);

export const conductAppraisal = createAsyncThunk(
  "performance/conductAppraisal",
  async (appraisalData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        "http://localhost:3007/api/employee/appraisals",
        appraisalData,
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
        error.response?.data?.error || "Failed to conduct appraisal"
      );
    }
  }
);

export const fetchEmployeePerformance = createAsyncThunk(
  "performance/fetchEmployeePerformance",
  async (employee_id, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      const { token } = JSON.parse(userToken);
      console.log("fetchEmployeePerformance - Requesting for employee_id:", employee_id);
      const response = await axios.get(
        `http://localhost:3007/api/employee-performance/${encodeURIComponent(employee_id)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("fetchEmployeePerformance - Response:", response.data);
      return {
        ...response.data.data,
        goals: Array.isArray(response.data.data.goals) ? response.data.data.goals : [],
        tasks: Array.isArray(response.data.data.tasks) ? response.data.data.tasks : [],
        competencies: Array.isArray(response.data.data.competencies) ? response.data.data.competencies : [],
        achievements: Array.isArray(response.data.data.achievements) ? response.data.data.achievements : [],
        feedback: Array.isArray(response.data.data.feedback) ? response.data.data.feedback : [],
        learningGrowth: Array.isArray(response.data.data.learningGrowth) ? response.data.data.learningGrowth : [],
      };
    } catch (error) {
      console.error("fetchEmployeePerformance - Error:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        console.log("fetchEmployeePerformance - Employee not found, returning empty data");
        return {
          goals: [],
          tasks: [],
          competencies: [],
          achievements: [],
          feedback: [],
          learningGrowth: [],
        };
      }
      return rejectWithValue(error.response?.data?.error || "Failed to fetch performance data");
    }
  }
);

export const submitSelfReview = createAsyncThunk(
  "performance/submitSelfReview",
  async ({ employee_id, comments, closing_comments }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        "http://localhost:3007/api/employee/self-review",
        { employee_id, comments, closing_comments },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to submit self-review");
    }
  }
);

const performanceSlice = createSlice({
  name: "performance",
  initialState: {
    performance: null,
    loading: false,
    error: null,
     employees: [],
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
      .addCase(setEmployeeGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(setEmployeeGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        if (state.performance) {
          state.performance.goals.push(action.payload.data);
        } else {
          state.performance = { goals: [action.payload.data], reviews: [] };
        }
      })
      .addCase(setEmployeeGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateGoalProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateGoalProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        if (state.performance) {
          const index = state.performance.goals.findIndex(
            (g) => g.id === action.payload.data.goal_id
          );
          if (index !== -1) {
            state.performance.goals[index] = {
              ...state.performance.goals[index],
              progress: action.payload.data.progress,
              status: action.payload.data.status,
            };
          }
        }
      })
      .addCase(updateGoalProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(conductAppraisal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(conductAppraisal.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        if (state.performance) {
          state.performance.reviews.push(action.payload.data);
        } else {
          state.performance = { goals: [], reviews: [action.payload.data] };
        }
      })
      .addCase(conductAppraisal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeePerformance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeePerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.performance = action.payload;
      })
      .addCase(fetchEmployeePerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitSelfReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitSelfReview.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(submitSelfReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = performanceSlice.actions;
export default performanceSlice.reducer;
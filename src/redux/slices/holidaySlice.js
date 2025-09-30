import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch holidays for a specific year
export const fetchHolidays = createAsyncThunk(
  "holidays/fetchHolidays",
  async ({ year }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      console.log("fetchHolidays - Requesting for year:", year);
      const response = await axios.get(
        `http://localhost:3007/api/holidays?year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("fetchHolidays - Response:", response.data);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error("fetchHolidays - Error:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        console.log("fetchHolidays - No holidays found, returning empty array");
        return [];
      }
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch holidays"
      );
    }
  }
);

// Create a new holiday
export const createHoliday = createAsyncThunk(
  "holidays/createHoliday",
  async (holidayData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        "http://localhost:3007/api/holidays/add",
        holidayData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create holiday"
      );
    }
  }
);

export const updateHoliday = createAsyncThunk(
  "holidays/updateHoliday",
  async ({ id, ...holidayData }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      const response = await axios.put(
        `http://localhost:3007/api/holidays/${id}`,
        holidayData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update holiday"
      );
    }
  }
);

export const deleteHoliday = createAsyncThunk(
  "holidays/deleteHoliday",
  async (id, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token } = JSON.parse(userToken);
      await axios.delete(`http://localhost:3007/api/holidays/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete holiday"
      );
    }
  }
);

const holidaySlice = createSlice({
  name: "holidays",
  initialState: {
    holidays: [],
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
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = action.payload;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Holiday created successfully";
        state.holidays.push(action.payload);
      })
      .addCase(createHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Holiday updated successfully";
        const index = state.holidays.findIndex((h) => h.id === action.payload.id);
        if (index !== -1) {
          state.holidays[index] = action.payload;
        }
      })
      .addCase(updateHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Holiday deleted successfully";
        state.holidays = state.holidays.filter((h) => h.id !== action.payload);
      })
      .addCase(deleteHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = holidaySlice.actions;
export default holidaySlice.reducer;
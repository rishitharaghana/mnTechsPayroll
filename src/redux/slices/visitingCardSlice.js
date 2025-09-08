import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const downloadVisitingCard = createAsyncThunk(
  "visitingCard/downloadVisitingCard",
  async ({ employeeId, style }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const { token, role, employee_id: authEmployeeId } = JSON.parse(userToken);
      
      // For employee role, enforce using their own employee_id
      const targetEmployeeId = role === "employee" ? authEmployeeId : employeeId;
      
      if (!targetEmployeeId) {
        return rejectWithValue("Employee ID is missing.");
      }

      const response = await axios.get(
        `http://localhost:3007/api/download/${targetEmployeeId}/${style}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${targetEmployeeId}_${style}_card.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { employeeId: targetEmployeeId, style, message: "Card downloaded successfully" };
    } catch (error) {
      console.error("Download visiting card error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Failed to download visiting card"
      );
    }
  }
);

const visitingCardSlice = createSlice({
  name: "visitingCard",
  initialState: {
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
      .addCase(downloadVisitingCard.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(downloadVisitingCard.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(downloadVisitingCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = visitingCardSlice.actions;
export default visitingCardSlice.reducer;
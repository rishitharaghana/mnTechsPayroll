// src/redux/slices/companySlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../hooks/AxiosInstance";


export const fetchCompanyDetails = createAsyncThunk(
  "company/fetchCompanyDetails",
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return rejectWithValue("No authentication token found. Please log in.");
      let token;
      try {
        token = JSON.parse(userToken).token;
      } catch (e) {
        return rejectWithValue("Invalid token format");
      }

      const response = await AxiosInstance.get(`api/company`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      console.error("fetchCompanyDetails error:", error);
      return rejectWithValue(error.response?.data?.error || "Failed to fetch company details");
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    companyDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.companyDetails = action.payload.data || {
          name: "MNTechs Solutions Pvt Ltd",
          pan: "ABCDE1234F",
          gstin: "12ABCDE1234F1Z5",
          logo: "/company_logo.png",
        };
      })
      .addCase(fetchCompanyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default companySlice.reducer;
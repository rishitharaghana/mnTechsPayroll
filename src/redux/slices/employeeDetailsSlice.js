import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createPersonalDetails = createAsyncThunk(
  'employeeDetails/createPersonalDetails',
  async (personalData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        return rejectWithValue('No authentication token found. Please log in.');
      }
      if (auth.user?.id && personalData.employee_id !== auth.user.id) {
        return rejectWithValue('Cannot submit details for another employee');
      }

      const response = await axios.post(
        'http://localhost:3007/api/employee-details/personal-details',
        personalData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to create personal details'
      );
    }
  }
);

export const createEducationDetails = createAsyncThunk(
  'employeeDetails/createEducationDetails',
  async (educationData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const response = await axios.post(
        'http://localhost:3007/api/employee-details/education-details',
        educationData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to create education details'
      );
    }
  }
);

export const createDocuments = createAsyncThunk(
  'employeeDetails/createDocuments',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const response = await axios.post(
        'http://localhost:3007/api/employee-details/documents',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to upload documents'
      );
    }
  }
);

export const createBankDetails = createAsyncThunk(
  'employeeDetails/createBankDetails',
  async (bankData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const response = await axios.post(
        'http://localhost:3007/api/employee-details/bank-details',
        bankData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to create bank details'
      );
    }
  }
);

export const fetchPreviewData = createAsyncThunk(
  'employeeDetails/fetchPreviewData',
  async (employeeId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const response = await axios.get(
        `http://localhost:3007/api/employee-details/preview/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch preview data'
      );
    }
  }
);

export const downloadEmployeeDetailsPDF = createAsyncThunk(
  'employeeDetails/downloadEmployeeDetailsPDF',
  async (employeeId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const response = await axios.get(
        `http://localhost:3007/api/employee-details/download/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to download PDF'
      );
    }
  }
);

const initialState = {
  currentStep: 0,
  isPreviewOpen: false,
  employeeId: '',
  formData: {
    fullName: '',
    fatherName: '',
    motherName: '',
    phone: '',
    email: '',
    gender: '',
    image: null,
    presentAddress: '',
    previousAddress: '',
    positionType: '',
    employerIdName: '',
    positionTitle: '',
    employmentType: '',
    joiningDate: '',
    contractEndDate: '',
    tenthClassName: '',
    tenthClassMarks: '',
    intermediateName: '',
    intermediateMarks: '',
    graduationName: '',
    graduationMarks: '',
    postgraduationName: '',
    postgraduationMarks: '',
    tenthClassDoc: null,
    intermediateDoc: null,
    graduationDoc: null,
    postgraduationDoc: null,
    aadharDoc: null,
    panDoc: null,
    ifscNumber: '',
    bankACnumber: '',
  },
  errors: {},
  previewData: null,
  loading: false,
  successMessage: null,
};

const employeeDetailsSlice = createSlice({
  name: 'employeeDetails',
  initialState,
  reducers: {
    updateField(state, action) {
      const { name, value } = action.payload;
      state.formData[name] = value;
      state.errors[name] = '';
    },
    setErrors(state, action) {
      state.errors = { ...state.errors, ...action.payload };
    },
    setCurrentStep(state, action) {
      state.currentStep = action.payload;
    },
    setPreviewOpen(state, action) {
      state.isPreviewOpen = action.payload;
    },
    setEmployeeId(state, action) {
      state.employeeId = action.payload;
    },
    resetForm(state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPersonalDetails.pending, (state) => {
        state.loading = true;
        state.errors = {};
        state.successMessage = null;
      })
      .addCase(createPersonalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.employeeId = action.payload.data.employee_id;
      })
      .addCase(createPersonalDetails.rejected, (state, action) => {
        state.loading = false;
        state.errors.general = action.payload;
      })
      .addCase(createEducationDetails.pending, (state) => {
        state.loading = true;
        state.errors = {};
        state.successMessage = null;
      })
      .addCase(createEducationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createEducationDetails.rejected, (state, action) => {
        state.loading = false;
        state.errors.general = action.payload;
      })
      .addCase(createDocuments.pending, (state) => {
        state.loading = true;
        state.errors = {};
        state.successMessage = null;
      })
      .addCase(createDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createDocuments.rejected, (state, action) => {
        state.loading = false;
        state.errors.general = action.payload;
      })
      .addCase(createBankDetails.pending, (state) => {
        state.loading = true;
        state.errors = {};
        state.successMessage = null;
      })
      .addCase(createBankDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.errors.general = action.payload;
      })
      .addCase(fetchPreviewData.pending, (state) => {
        state.loading = true;
        state.errors = {};
        state.successMessage = null;
      })
      .addCase(fetchPreviewData.fulfilled, (state, action) => {
        state.loading = false;
        state.previewData = action.payload;
      })
      .addCase(fetchPreviewData.rejected, (state, action) => {
        state.loading = false;
        state.errors.general = action.payload;
      })
      .addCase(downloadEmployeeDetailsPDF.pending, (state) => {
        state.loading = true;
        state.errors = {};
        state.successMessage = null;
      })
      .addCase(downloadEmployeeDetailsPDF.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'PDF downloaded successfully';
        state.currentStep = 0;
        state.isPreviewOpen = false;
        state.employeeId = '';
        state.previewData = null;
      })
      .addCase(downloadEmployeeDetailsPDF.rejected, (state, action) => {
        state.loading = false;
        state.errors.general = action.payload;
      });
  },
});

export const {
  updateField,
  setErrors,
  setCurrentStep,
  setPreviewOpen,
  setEmployeeId,
  resetForm,
} = employeeDetailsSlice.actions;

export default employeeDetailsSlice.reducer;
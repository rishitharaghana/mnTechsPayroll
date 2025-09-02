import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import io from 'socket.io-client';

let socket = null;

export const initializeWebSocket = createAsyncThunk(
  'siteVisit/initializeWebSocket',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }
      const { token } = JSON.parse(userToken);
      socket = io('http://localhost:3007', { auth: { token } });
      socket.on('connect', () => {
        console.log('WebSocket connected:', socket.id);
      });
      socket.on('employerLocationUpdate', (data) => {
        dispatch(receiveLocationUpdate(data));
      });
      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });
      return { message: 'WebSocket initialized' };
    } catch (error) {
      console.error('WebSocket initialization error:', error);
      return rejectWithValue('Failed to initialize WebSocket');
    }
  }
);

export const startSiteVisit = createAsyncThunk(
  'siteVisit/startSiteVisit',
  async ({ site_name }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        'http://localhost:3007/api/employees/site-visit/start',
        { site_name },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      if (socket && socket.connected) {
        const { visit_id, employee_id } = response.data.data;
        let lastUpdate = 0;
        if (navigator.geolocation) {
          navigator.geolocation.watchPosition(
            (position) => {
              const now = Date.now();
              if (now - lastUpdate < 30000) return; // Throttle to 30 seconds
              lastUpdate = now;
              const { latitude, longitude } = position.coords;
              socket.emit('locationUpdate', { visitId: visit_id, employeeId: employee_id, latitude, longitude });
            },
            (error) => {
              console.error('Geolocation error:', error);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        }
      }
      return response.data;
    } catch (error) {
      console.error('Start site visit error:', error.response?.data);
      return rejectWithValue(error.response?.data?.error || 'Failed to start site visit');
    }
  }
);

export const endSiteVisit = createAsyncThunk(
  'siteVisit/endSiteVisit',
  async ({ visit_id }, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.post(
        'http://localhost:3007/api/employees/site-visit/end',
        { visit_id },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      if (socket && socket.connected) {
        socket.emit('stopTracking', { visitId: visit_id, employeeId: response.data.data.employee_id });
      }
      return response.data;
    } catch (error) {
      console.error('End site visit error:', error.response?.data);
      return rejectWithValue(error.response?.data?.error || 'Failed to end site visit');
    }
  }
);

export const fetchActiveSiteVisits = createAsyncThunk(
  'siteVisit/fetchActiveSiteVisits',
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.get('http://localhost:3007/api/employees/site-visit/active', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Fetch active site visits error:', error.response?.data);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch active site visits');
    }
  }
);

export const fetchVisitHistory = createAsyncThunk(
  'siteVisit/fetchVisitHistory',
  async (_, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return rejectWithValue('No authentication token found. Please log in.');
      }
      const { token } = JSON.parse(userToken);
      const response = await axios.get('http://localhost:3007/api/employees/site-visit/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Fetch visit history error:', error.response?.data);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch visit history');
    }
  }
);

const siteVisitSlice = createSlice({
  name: 'siteVisit',
  initialState: {
    activeVisits: [],
    currentVisit: null,
    locations: [],
    visits: [],
    loading: false,
    error: null,
    successMessage: null,
    isWebSocketConnected: false,
  },
  reducers: {
    receiveLocationUpdate: (state, action) => {
      const { visitId, employeeId, latitude, longitude, timestamp } = action.payload;
      state.locations.push({ visitId, employeeId, latitude, longitude, timestamp });
    },
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.currentVisit = null;
      state.locations = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeWebSocket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeWebSocket.fulfilled, (state) => {
        state.loading = false;
        state.isWebSocketConnected = true;
        state.successMessage = 'WebSocket connected successfully';
      })
      .addCase(initializeWebSocket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isWebSocketConnected = false;
      })
      .addCase(startSiteVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startSiteVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.currentVisit = action.payload.data;
      })
      .addCase(startSiteVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(endSiteVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endSiteVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.currentVisit = null;
        state.locations = [];
      })
      .addCase(endSiteVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchActiveSiteVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveSiteVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.activeVisits = action.payload.data;
      })
      .addCase(fetchActiveSiteVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVisitHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload.data;
      })
      .addCase(fetchVisitHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState, receiveLocationUpdate } = siteVisitSlice.actions;
export default siteVisitSlice.reducer;
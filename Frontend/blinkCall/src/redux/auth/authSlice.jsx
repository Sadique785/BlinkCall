import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  refreshToken: null,
  username: null,
  userId: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  csrfToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.username = action.payload.username;
      state.userId = action.payload.userId;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.username = null;
      state.userId = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.csrfToken = null;
    },
    updateTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    setCsrfToken: (state, action) => {
      state.csrfToken = action.payload;
    },
    setUserProfile: (state, action) => {
      state.username = action.payload.username;
      state.userId = action.payload.userId;
    },
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateTokens,
  setCsrfToken,
  setUserProfile,
} = authSlice.actions;

export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("access_token");

const initialState = {
  status: !!token,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },

    logout: (state) => {
      state.status = false;
      state.userData = null;
      localStorage.removeItem("access_token");
    },

    setUser: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;

export default authSlice.reducer;
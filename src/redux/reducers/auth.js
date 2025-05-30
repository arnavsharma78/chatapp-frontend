import { createSlice } from "@reduxjs/toolkit";
//import { adminLogin, adminLogout, getAdmin } from "../thunks/admin";
//import toast from "react-hot-toast";

//used to tell whether any user is login or not, if not ,you cant access home page you redirected to login page
const initialState = {
  user: null,
  isAdmin: false,
  loader: true,
};

//Redux slice is a concept within the React Redux Toolkit that represents a portion of the Redux state.
//name: "auth": This assigns the name "auth" to the slice. This name is used to generate action types and selectors related to this slice.
//initialState: This is where you define the initial state for this slice.
//reducers: This is where you define the reducer functions for this slice. Reducers handle actions and update the state accordingly.
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExists: (state) => {
      state.user = null;
      state.loader = false;
    },
  },

  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(adminLogin.fulfilled, (state, action) => {
  //         state.isAdmin = true;
  //         toast.success(action.payload);
  //       })
  //       .addCase(adminLogin.rejected, (state, action) => {
  //         state.isAdmin = false;
  //         toast.error(action.error.message);
  //       })
  //       .addCase(getAdmin.fulfilled, (state, action) => {
  //         if (action.payload) {
  //           state.isAdmin = true;
  //         } else {
  //           state.isAdmin = false;
  //         }
  //       })
  //       .addCase(getAdmin.rejected, (state, action) => {
  //         state.isAdmin = false;
  //       })
  //       .addCase(adminLogout.fulfilled, (state, action) => {
  //         state.isAdmin = false;
  //         toast.success(action.payload);
  //       })
  //       .addCase(adminLogout.rejected, (state, action) => {
  //         state.isAdmin = true;
  //         toast.error(action.error.message);
  //       });
  //   },
});

export default authSlice;
export const { userExists, userNotExists } = authSlice.actions;

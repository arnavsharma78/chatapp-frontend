import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import api from "./api/api";
import miscSlice from "./reducers/misc";
import chatSlice from "./reducers/chat";
//authSlice.reducer is the reducer function that Redux Toolkit generates from the reducers object.
//This reducer function handles the actions defined in reducers and updates the state accordingly.
//authSlice.reducer is assigned to this key, meaning the state managed by authSlice will be accessible under the "auth" key in the Redux store
console.log(authSlice.name, " ", authSlice.reducer);
const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [api.reducerPath]: api.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
  },

  //mid is an default middle ware, api.middleware is and additionally added middle ware
  middleware: (mid) => [...mid(), api.middleware],
});
console.log(api.reducerPath, " ", api.reducer);

export default store;

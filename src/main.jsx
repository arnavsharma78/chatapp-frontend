import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CssBaseline } from "@mui/material"; //to use material ui
import { HelmetProvider } from "react-helmet-async";
import store from "./redux/store.js";
import { Provider } from "react-redux"; //nested component in provider can accept  redux store
{
  /* e.preventdefault, default page referesh will not occur on right click*/
}
// store = {store} ,using redux ,state is accessible through out the applications
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <CssBaseline />

        <div onContextMenu={(e) => e.preventDefault}>
          <App />
        </div>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);

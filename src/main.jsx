import React from "react";
import ReactDOM from "react-dom/client";
import {
    BrowserRouter,
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home.jsx";

import "./styles/index.scss";
import Error from "./pages/Error.jsx";
import Root from "./pages/Root.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import MainMenu from "./pages/protected/MainMenu.jsx";
import App from "./App.jsx";
import {AuthProvider} from "./context/AuthProvider.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>,
);

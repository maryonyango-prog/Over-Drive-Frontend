import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router/AppRouter";
import { AuthProvider } from "./Context/AuthContext";

import { AuthProvider } from "./Context/AuthContext";
import { VehicleProvider } from "./Context/VehicleContext";

import ErrorBoundary from "./components/errors/ErrorBoundary";
import { AuthProvider } from "./Context/AuthContext";
import { ToastProvider } from "./Context/ToastContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <VehicleProvider>
        <RouterProvider router={router} />
      </VehicleProvider>
    </AuthProvider>
  </React.StrictMode>
);

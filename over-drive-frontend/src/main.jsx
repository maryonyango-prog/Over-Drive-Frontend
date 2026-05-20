import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router/AppRouter";

import ErrorBoundary from "./components/errors/ErrorBoundary";
import { AuthProvider } from "./Context/AuthContext";
import { VehicleProvider } from "./Context/VehicleContext";
import { ToastProvider } from "./Context/ToastContext";
import { ThemeProvider } from "./Context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <VehicleProvider>
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </VehicleProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

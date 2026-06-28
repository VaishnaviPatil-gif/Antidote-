import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { EmergencyProvider } from "./context/EmergencyContext.jsx";
import App from "./App.jsx";
import "./index.css";

/**
 * App entry. Order matters:
 *   BrowserRouter → EmergencyProvider → App
 * so every screen (and the routing hero) can both navigate and read the
 * shared §3 emergency state.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <EmergencyProvider>
        <App />
      </EmergencyProvider>
    </BrowserRouter>
  </React.StrictMode>
);

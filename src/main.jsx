import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { EmergencyProvider } from "./context/EmergencyContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import App from "./App.jsx";
import "./index.css";

/**
 * App entry. Order matters:
 *   BrowserRouter → EmergencyProvider → ErrorBoundary → App
 * so every screen (and the routing hero) can navigate and read the shared §3
 * emergency state, and any uncaught render error shows a recovery card instead
 * of a blank screen (the boundary sits inside the provider so its "Start over"
 * can clear persisted state).
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <EmergencyProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </EmergencyProvider>
    </BrowserRouter>
  </React.StrictMode>
);

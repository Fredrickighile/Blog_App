// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthContextProvider } from "./Context/authContext.jsx";

// Add this to handle initial scroll position
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}

// Scroll to top on initial load
setTimeout(() => {
  window.scrollTo(0, 0);
}, 100);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);

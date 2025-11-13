// src/main.jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@radix-ui/themes/styles.css";
// Remove BrowserRouter import
import App from "./App.jsx";
import "./index.css";
import { Theme } from "@radix-ui/themes";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

createRoot(rootEl).render(
  <StrictMode>
    <Theme>
      <App />
    </Theme>
  </StrictMode>
);
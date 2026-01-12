import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="GOOGLE_CLIENT_ID_CỦA_BẠN">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

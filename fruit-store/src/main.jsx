import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import StripeProvider from "./app/user/pages/payment/StripeProvider";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <StripeProvider>
      <App />
    </StripeProvider>
  </React.StrictMode>
);

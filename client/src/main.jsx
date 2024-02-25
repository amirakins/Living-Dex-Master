import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <div className="min-h-screen bg-[#8984a4]">
      <App />
      </div>
  </BrowserRouter>
);

import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/app.scss";
import { createContext } from "react";
import AppWrapper from "./AppWrapper";

export const server = "https://nodejs-todo-h9cl.onrender.com/api/v1";

export const Context = createContext({ isAuthenticated: false });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

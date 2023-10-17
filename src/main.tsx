import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

import App from "./App.tsx";
import ListProvider from "./context/ListContext.tsx";

import "@mantine/core/styles.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <ListProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ListProvider>
    </MantineProvider>
  </React.StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@picocss/pico/css/pico.orange.min.css";
import App from "./App.jsx";

// Style
// import "./css/base/reset.css"
// import "./css/base/global.css";
// import "./css/theme/theme.css";
import "./css/theme/font.css";
// import "./index.css";
import "./css/layout/layout.css";

createRoot(document.querySelector("#root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

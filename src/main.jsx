import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FolderTabPortfolio from "./FolderTabPortfolio.jsx";

// All content lives in data.js, in English and Vietnamese. A prop (name, role, lead, projects...)
// replaces that content in both languages, so edit data.js to change what the site says.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FolderTabPortfolio />
  </StrictMode>,
);

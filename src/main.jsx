import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FolderTabPortfolio from "./FolderTabPortfolio.jsx";

// Override defaults via props: name, localName, handle, email, role, years,
// blurb, highlights, timeline, categories, projects, steps, words, contacts...
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FolderTabPortfolio />
  </StrictMode>,
);

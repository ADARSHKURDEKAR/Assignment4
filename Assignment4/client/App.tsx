import "./global.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(<App />);

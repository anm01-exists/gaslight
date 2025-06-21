import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize performance monitoring
import { measureWebVitals, observeNavigationTiming } from "./lib/analytics";

// Measure web vitals for performance monitoring
if (import.meta.env.PROD) {
  measureWebVitals();
  observeNavigationTiming();
}

createRoot(document.getElementById("root")!).render(<App />);

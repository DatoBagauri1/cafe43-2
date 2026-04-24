import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";
import { installMockApi } from "@/lib/mock-api";
import { API_BASE_URL, USE_MOCK_API } from "@/lib/runtime-config";

if (API_BASE_URL) {
  setBaseUrl(API_BASE_URL);
}

if (USE_MOCK_API) {
  installMockApi();
}

createRoot(document.getElementById("root")!).render(<App />);

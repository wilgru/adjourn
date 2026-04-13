import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "src/router";
import "src/index.css";
import "quill/dist/quill.core.css";
import { StrictMode, startTransition } from "react";
import { createRoot } from "react-dom/client";

const router = getRouter();
const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Missing root element #app");
}

startTransition(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
});

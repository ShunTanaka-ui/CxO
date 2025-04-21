import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ElementDefault } from "./screens/ElementDefault/ElementDefault";
import { DiagnosticPage } from "./screens/DiagnosticPage";
import { PersonalInfoPage } from "./screens/PersonalInfoPage";
import { ResultPage } from "./screens/ResultPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ElementDefault />,
  },
  {
    path: "/diagnostic",
    element: <DiagnosticPage />,
  },
  {
    path: "/personal-info",
    element: <PersonalInfoPage />,
  },
  {
    path: "/result",
    element: <ResultPage />,
  },
]);

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
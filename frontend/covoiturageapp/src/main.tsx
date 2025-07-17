import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Carpooling from "./pages/Carpooling.tsx";
import Contact from "./pages/Contact.tsx";
import Login from "./pages/Login.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import MentionLegal from "./pages/MentionLegal.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // 👈 avec Navbar + Outlet
    children: [
      { index: true, element: <Home /> },
      { path: "covoiturage", element: <Carpooling /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <Login /> },
      { path: "mentionlegal", element: <MentionLegal /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <App />
  </StrictMode>,
);

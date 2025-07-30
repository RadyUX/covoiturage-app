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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext.tsx";
import Register from "./pages/Register.tsx";
import Profil from "./pages/Profil.tsx";
// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useUser } from "./context/UserContext.tsx";
import NotFound from "./pages/NotFound.tsx";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, //  Navbar + Outlet
    children: [
      { index: true, element: <Home /> },
      { path: "*", element: <NotFound /> },
      { path: "covoiturage", element: <Carpooling /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "mentionlegal", element: <MentionLegal /> },
      {
        path: "profil",
        element: (
          <ProtectedRoute>
            <Profil />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RouterProvider router={router} />
        <App />
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>,
);

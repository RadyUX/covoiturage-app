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
import EmployeePage from "./pages/EmployeePage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import { useRole } from "./hooks/useRole.ts";

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string;
}) {
  const { user, isLoading: isUserLoading } = useUser();
  const token = localStorage.getItem("userToken");
  const { data: roles, isLoading: isRolesLoading } = useRole(user?.id ?? 0);
  console.log("Token récupéré :", token);
  console.log("Utilisateur récupéré :", user);
  console.log("Rôles récupérés :", roles);

  if (isUserLoading || isRolesLoading) {
    return <div>Chargement...</div>; // Affiche un état de chargement
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && !roles.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, //  Navbar + Outlet
    children: [
      { index: true, element: <Home /> },
      { path: "/", element: <Home /> },
      { path: "*", element: <NotFound /> },
      { path: "covoiturage", element: <Carpooling /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "mentionlegal", element: <MentionLegal /> },
      {
        path: "employee",
        element: (
          <ProtectedRoute requiredRole="employee">
            <EmployeePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
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

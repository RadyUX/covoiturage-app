import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { login, loginStatus, loginError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
    onClose();
  };

  return (
    <div className="fixed z-99 inset-0 bg-white overflow-y-auto">
      <div className="flex items-center justify-center ">
        <div>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            &times;
          </button>
          <h1>Se connecter</h1>
        </div>
        <div>
          <form onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse e-mail
              </label>

              <input
                type="email"
                id="email"
                value={email}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {loginError && (
              <div className="text-red-500 text-sm">
                {(loginError as Error).message ?? "Erreur de connexion"}
              </div>
            )}

            <button
              type="submit"
              disabled={loginStatus === "pending"}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              {loginStatus === "pending" ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          <div className="text-sm text-center text-gray-600 mt-4">
            Pas encore de compte ?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Créer un compte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: number;
  email: string;
  pseudo: string;
  exp: number;
}

export interface User {
  id?: number;
  lastname?: string; // Rendre optionnel
  firstname?: string; // Rendre optionnel
  email: string;
  password?: string; // Rendre optionnel
  pseudo: string;
  photo?: string;
  adress?: string;
  telephone?: string;
  birthdate?: string;
  token?: string;
}
interface UserContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("userToken");

    if (stored) {
      try {
        const decoded = jwtDecode<DecodedToken>(stored);
        if (decoded.exp * 1000 > Date.now()) {
          const userData: User = {
            id: decoded.userId,
            email: decoded.email,
            pseudo: decoded.pseudo,
            token: stored,
          };
          setUser(userData); // Utilise la même logique que dans login
          console.log("Token décodé :", decoded);
        } else {
          localStorage.removeItem("userToken");
        }
      } catch {
        localStorage.removeItem("userToken");
      }
    }
    setIsLoading(false); // Fin du chargement
  }, []);
  const login = useCallback((token: string, userData: User) => {
    setUser({ ...userData, token });
    localStorage.setItem("userToken", token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("userToken");
  }, []);

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider
      value={{ user, login, logout, isAuthenticated, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser doit être utilisé dans UserProvider");
  return context;
};

export default UserContext;

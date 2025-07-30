import axios from "axios";
import { useUser, type User } from "../context/UserContext";
import { API_URL } from "../../config";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
export const useAuth = () => {
  const navigate = useNavigate();
  const { login: setUserContext, logout } = useUser();
  const login = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<{ token: string; user: User }> => {
      const res = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });
      return res.data;
    },
    onSuccess: ({ token, user }) => {
      setUserContext(token, user); // <- OK
    },
  });

  const register = useMutation({
    mutationFn: async (
      newUser: User,
    ): Promise<{ token: string; user: User }> => {
      const res = await axios.post(`${API_URL}/api/users/register`, newUser);
      return res.data;
    },
    onSuccess: () => {
      console.log("Inscription OK, login requis");
      navigate("/login");
    },
  });
  return {
    login: login.mutate,
    loginStatus: login.status,
    loginError: login.error,

    register: register.mutate,
    registerStatus: register.status,
    logout: logout,
  };
};

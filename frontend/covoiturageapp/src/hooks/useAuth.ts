import axios from "axios";
import { useUser, type User } from "../context/UserContext";
import { API_URL } from "../../config";
import { useMutation } from "@tanstack/react-query";
export const useAuth = () => {
  const { login: setUserContext, logout } = useUser();

  const login = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<string> => {
      const res = await axios.post(`${API_URL}/user/login`, {
        email,
        password,
      });
      // Assuming the token is in res.data.token
      return res.data.token;
    },
    onSuccess: (token: string) => {
      setUserContext(token);
    },
  });

  const register = useMutation({
    mutationFn: async (
      newUser: User,
    ): Promise<{ token: string; user: User }> => {
      const res = await axios.post(`${API_URL}/user/register`, newUser);
      return res.data; // Assuming the response contains { token, user }
    },
    onSuccess: ({ token, user }) => {
      setUserContext({ ...user, token }); // Délègue la gestion au contexte
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

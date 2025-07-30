import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../config";

export const useHistory = (userId: number) => {
  return useQuery({
    queryKey: ["history", userId],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        `${API_URL}/api/trips/${userId}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },
  });
};

// hooks/useAuthHook.ts
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";

export interface User {
  _id: string;
  name: string;
  email: string;
  balance: number;
  phone: string;
  role: string;
  referralCode: string;
  subscribedPlan: string;
  salesCredit: number;
}

export const useAuthHook = () => {
  const { user: loginUser } = useAuth(); // login user directly

  const { data, refetch, isLoading, isError, error } = useQuery({
    queryKey: ["user", loginUser?.email],
    queryFn: async () => {
      if (!loginUser?.email) return null;

      // axios generic diye type specify kora holo
      const res = await axios.get<User[]>(
        "http://localhost:3200/api/user/getall"
      );
      const allUsers = res.data; // type ekhon User[]

      // sudhu login user er email match korbe
      const currentUserData = allUsers.find((u) => u.email === loginUser.email);

      return currentUserData || null;
    },
    enabled: !!loginUser?.email,
  });

  return { data, refetch, isLoading, isError, error };
};

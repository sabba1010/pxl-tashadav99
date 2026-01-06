import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

/* =========================
   Types
========================= */
export interface Payment {
  _id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail: string;
  createdAt: string;
}

/* =========================
   Fetch Function
   ❌ NO hooks here
========================= */
const fetchPaymentsByEmail = async (email: string): Promise<Payment[]> => {
  const res = await axios.get<Payment[]>("https://vps-backend-server-beta.vercel.app/api/payments");

  return res.data.filter((payment) => payment.customerEmail === email);
};

/* =========================
   ✅ EXPORTED CUSTOM HOOK
========================= */
export const useDepositByUser = () => {
  const { user } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery<Payment[]>({
    queryKey: ["payments", user?.email],
    queryFn: () => fetchPaymentsByEmail(user!.email),
    enabled: !!user?.email,
  });

  return {
    payments: data ?? [],
    isLoading,
    isError,
    refetch,
  };
};

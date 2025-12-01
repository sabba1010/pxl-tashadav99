import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const storedUser = Cookies.get("currentUser");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data in cookies");
      }
    }
  }, []);

  return user;
};

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";

// // Fake MongoDB user data (multiple users)
// const fakeUsersFromDB = [
//   {
//     _id: "uid_001",
//     name: "Tyrion Lannister",
//     email: "tyrion@example.com",
//     role: "admin",
//     password: "123456",
//   },
//   {
//     _id: "uid_002",
//     name: "Arya Stark",
//     email: "arya@example.com",
//     role: "user",
//     password: "123456",
//   },
//   {
//     _id: "uid_003",
//     name: "Jon Snow",
//     email: "jon@example.com",
//     role: "user",
//     password: "123456",
//   },
//   {
//     _id: "uid_004",
//     name: "Daenerys Targaryen",
//     email: "daenerys@example.com",
//     role: "user",
//     password: "123456",
//   },
// ];

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
//   password: string;
// }

// interface AuthContextType {
//   users: User[];
//   isLoading: boolean;
//   setUsers: React.Dispatch<React.SetStateAction<User[]>>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface Props {
//   children: ReactNode;
// }

// export const AuthContextProvider = ({ children }: Props) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Simulate async fetch (like MongoDB -> API -> frontend)
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setIsLoading(true);

//       await new Promise((resolve) => setTimeout(resolve, 700));

//       // Replace with API call in real project
//       setUsers(fakeUsersFromDB);

//       setIsLoading(false);
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ users, isLoading, setUsers }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthContextProvider.");
//   return ctx;
// };

// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Fake MongoDB user data (multiple users)
const fakeUsersFromDB = [
  {
    _id: "uid_001",
    name: "Tyrion Lannister",
    email: "tyrion@example.com",
    role: "admin",
    password: "123456",
  },
  {
    _id: "uid_002",
    name: "Arya Stark",
    email: "arya@example.com",
    role: "user",
    password: "123456",
  },
  {
    _id: "uid_003",
    name: "Jon Snow",
    email: "jon@example.com",
    role: "user",
    password: "123456",
  },
  {
    _id: "uid_004",
    name: "Daenerys Targaryen",
    email: "daenerys@example.com",
    role: "user",
    password: "123456",
  },
];

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}

interface AuthContextType {
  users: User[];
  isLoading: boolean;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;

  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;

  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Simulate async fetch
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 700));

      setUsers(fakeUsersFromDB);
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 300));
    const found =
      users.find((u) => u.email === email && u.password === password) || null;

    setCurrentUser(found);
    return found;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        isLoading,
        setUsers,
        currentUser,
        setCurrentUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthContextProvider.");
  return ctx;
};

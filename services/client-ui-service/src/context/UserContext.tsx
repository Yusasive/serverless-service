import { createContext, useContext, useEffect, useState } from "react";
import { UserController } from "@/controllers/UserController";
import { User } from "@/types/user.type";

const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  refreshUser: () => Promise<User | null>;
}>({
  user: null,
  setUser: () => {},
  loading: true,
  refreshUser: async () => null,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (): Promise<User | null> => {
    try {
      setLoading(true);
      const response = await UserController.getInstance().getUserProfile();
      
      if (response.success && response.data) {
        setUser(response.data);
        return response.data;
      } else {
        setUser(null);
        return null;
      }
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, refreshUser: fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

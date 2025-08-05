import { createContext, useContext, useEffect, useState } from "react";
import { UserController } from "@/controllers/UserController";
import { User } from "@/types/user.type";

const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}>({
  user: null,
  setUser: () => {},
  loading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await UserController.getInstance().getUserProfile();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

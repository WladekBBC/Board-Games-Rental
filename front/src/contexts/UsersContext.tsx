import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { Method, request } from "@/interfaces/api";
import { useLang } from "./LanguageContext";
import {
  UsersContextType,
  User,
  UserUpdate,
  SearchType,
} from "@/types/usersContext";
import { chechCookie } from "@/app/actions";

/**
 * Context to manage user data and actions.
 * Provides functionalities to fetch, update, and delete users.
 * Also manages loading, error, and success states.
 */
const UsersContext = createContext<UsersContextType | undefined>(undefined);

/**
 * Provider component for UsersContext.
 * @param param0 - children: ReactNode - The child components that will have access to the UsersContext.
 * @returns  A provider component that wraps its children with UsersContext.
 */
export function UsersProvider({ children }: { children: ReactNode }) {
  const { JWT, permissions } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<{ [key: number]: UserUpdate }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { language } = useLang();
  const [searchType, setSearchType] = useState<SearchType>("email");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [JWT]);

  const SearchedUsers = [...users].filter((user) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();

    switch (searchType) {
      case "email":
        return user.email.toLowerCase().includes(searchLower);
      case "permissions":
        return user.permissions.toLowerCase().includes(searchLower);
    }
  });

  const fetchUsers = async () => {
    if (await chechCookie("Authorization")) {
      request<User[]>("auth/users", Method.GET)
        .then((data: User[]) => {
          setUsers(data);
          setLoading(false);
        })
        .catch((err: Error) => {
          handleError(err.message);
        });
    } else {
      setUsers([]);
    }
  };

  const handleSuccess = (successMessage: string) => {
    fetchUsers();
    setSuccess(successMessage);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 3000);
  };

  const handleUpdateUser = async (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    if (!JWT) {
      setError("No authentication token found. Please log in again.");
      return;
    }

    setLoading(true);
    const updates = editing[id];
    const updateData: UserUpdate = {};

    if (updates.email && updates.email !== user.email) {
      updateData.email = updates.email;
    }
    if (updates.permissions && updates.permissions !== user.permissions) {
      updateData.permissions = updates.permissions;
    }
    if (updates.password) {
      updateData.password = updates.password;
    }

    if (Object.keys(updateData).length === 0) {
      setLoading(false);
      return;
    }

    request(`auth/update/${id}`, Method.PATCH, JSON.stringify(updateData))
      .then(() => {
        handleSuccess(language.userUpdated);
        setEditing((prev) => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
      })
      .catch((err: Error) => {
        handleError(err.message);
      });

    setLoading(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);

    request(`auth/delete/${userToDelete.id}`, Method.DELETE)
      .then(() => {
        handleSuccess(language.userDeleted);
        setUserToDelete(null);
      })
      .catch((err: Error) => {
        handleError(err.message);
      });

    setLoading(false);
  };

  const value: UsersContextType = {
    users,
    loading,
    error,
    success,
    editing,
    userToDelete,
    setEditing,
    setUserToDelete,
    handleUpdateUser,
    handleDeleteUser,
    setSuccess,
    setError,
    searchType,
    setSearchType,
    searchQuery,
    setSearchQuery,
    SearchedUsers,
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}

/**
 * Custom hook to access the UsersContext.
 * @returns The UsersContext value.
 * @throws Error if used outside of UsersProvider.
 */
export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
}

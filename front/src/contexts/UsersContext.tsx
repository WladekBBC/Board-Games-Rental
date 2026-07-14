import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Method, request } from '@/interfaces/api';
import { useLang } from './LanguageContext';
import { UsersContextType, User, UserUpdate, SearchType } from '@/types/usersContext';
import { checkCookie } from '@/app/actions';
 
const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const { JWT } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<{ [key: number]: UserUpdate }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { language } = useLang();
  const [searchType, setSearchType] = useState<SearchType>('email');
  const [searchQuery, setSearchQuery] = useState('');

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 3000);
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!JWT || !(await checkCookie('Authorization'))) {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await request<User[]>('auth/users', Method.GET);
      setUsers(data);
    } catch (err) {
      handleError(err instanceof Error ? err.message : language.serverError);
    } finally {
      setLoading(false);
    }
  }, [JWT, handleError, language.serverError]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const SearchedUsers = [...users]
    .filter(user => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    switch (searchType) {
      case 'email':
        return user.email.toLowerCase().includes(searchLower)
      case 'permissions':
        return user.permissions.toLowerCase().includes(searchLower)
      default:
        return true;
    }
  })

  const handleSuccess = (successMessage: string) =>{
    void fetchUsers();
    setSuccess(successMessage);
    setTimeout(() => setSuccess(null), 3000);
  }

  const handleUpdateUser = async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    if (!JWT) {
      setError('No authentication token found. Please log in again.');
      return;
    }

    const updates = editing[id];
    const updateData: UserUpdate = {};

    if (updates?.email && updates.email !== user.email) {
      updateData.email = updates.email;
    }
    if (updates?.permissions && updates.permissions !== user.permissions) {
      updateData.permissions = updates.permissions;
    }
    if (updates?.password) {
      updateData.password = updates.password;
    }

    if (Object.keys(updateData).length === 0) {
      return;
    }

    setLoading(true);
    try {
      await request(`auth/update/${id}`, Method.PATCH, JSON.stringify(updateData));
      handleSuccess(language.userUpdated);
      setEditing((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    } catch (err) {
      handleError(err instanceof Error ? err.message : language.serverError);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      await request(`auth/delete/${userToDelete.id}`, Method.DELETE);
      handleSuccess(language.userDeleted);
      setUserToDelete(null);
    } catch (err) {
      handleError(err instanceof Error ? err.message : language.serverError);
    } finally {
      setLoading(false);
    }
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
    SearchedUsers
  };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
}

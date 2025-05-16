import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Method, request } from '@/interfaces/api';
import { useLang } from './LanguageContext';
import { UsersContextType, User, UserUpdate, SearchType } from '@/types/usersContext';
import { IUser} from '@/interfaces/user'
 
const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const { JWT, permissions } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<{ [key: number]: UserUpdate }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { language } = useLang();
  const [searchType, setSearchType] = useState<SearchType>('email');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (JWT) {
      fetchUsers();
    }
  }, [JWT]);

  const SearchedUsers = [...users]
    .filter(user => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    switch (searchType) {
      case 'email':
        return user.email.toLowerCase().includes(searchLower)
      case 'permissions':
        return user.permissions.toLowerCase().includes(searchLower)
    }
  })

  const fetchUsers = async () => {
    request<User[]>('http://localhost:3001/auth/users', Method.GET, {"token": `${JWT}`, "permissions": permissions}).then((data: User[])=>{
      setUsers(data);
      setLoading(false);
    }).catch((err: Error)=>{
      setError(err.message);
    })
  };

  const handleSuccess = (successMessage: string) =>{
    fetchUsers();
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

    request(
      `http://localhost:3001/auth/update/${id}`, 
      Method.PATCH, 
      {"token": `${JWT}`, "permissions": permissions}, 
      JSON.stringify(updateData)
    ).then(()=>{
      handleSuccess(language.userUpdated);
      setEditing((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }).catch((err: Error)=>{
      setError(err.message);
    })

    setLoading(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);

    request(`http://localhost:3001/auth/delete/${userToDelete.id}`, Method.DELETE, {"token": `${JWT}`, "permissions": permissions}).then(()=>{
      handleSuccess(language.userDeleted);
      setUserToDelete(null);
    }).catch((err:Error)=>{
      setError(err.message);
    })

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
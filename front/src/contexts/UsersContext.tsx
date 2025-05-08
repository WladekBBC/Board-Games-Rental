import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Method, request } from '@/interfaces/api';

interface User {
  id: number;
  email: string;
  permissions: string;
}

interface UsersContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  success: string | null;
  editing: { [key: number]: string };
  userToDelete: User | null;
  setEditing: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
  setUserToDelete: (user: User | null) => void;
  handleUpdateUser: (id: number) => Promise<void>;
  handleDeleteUser: () => Promise<void>;
  setSuccess: (message: string | null) => void;
  setError: (message: string | null) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const { JWT, permissions } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    if (JWT) {
      fetchUsers();
    }
  }, [JWT]);

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
    if (!user) 
      return;

    if (!JWT) {
      setError('No authentication token found. Please log in again.');
      return;
    }

    setLoading(true);
    const newPermissions = editing[id];

    request(
      `http://localhost:3001/auth/update/${id}`, 
      Method.PATCH, 
      {"token": `${JWT}`, "permissions": permissions}, 
      JSON.stringify({email: user.email, permissions: newPermissions}
    )).then(()=>{
      handleSuccess('User permissions updated successfully');
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
      handleSuccess('User deleted successfully')
      setUserToDelete(null);
    }).catch((err:Error)=>{
      setError(err.message);
    })

    setLoading(false);
  };

  const value = {
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
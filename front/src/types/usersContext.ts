
/**
 * @interface User
 * @property {number} id - The user's ID.
 * @property {string} email - The user's email.
 * @property {string} permissions - The user's permissions.
 */

export interface User {
    id: number;
    email: string;
    permissions: string;
}

export interface UserUpdate {
    email?: string;
    permissions?: string;
    password?: string;
}
  
export type SearchType = 'email' | 'permissions';

export interface UsersContextType {
    users: User[];
    loading: boolean;
    error: string | null;
    success: string | null;
    editing: { [key: number]: UserUpdate };
    userToDelete: User | null;
    setEditing: React.Dispatch<React.SetStateAction<{ [key: number]: UserUpdate }>>;
    setUserToDelete: (user: User | null) => void;
    handleUpdateUser: (id: number) => Promise<void>;
    handleDeleteUser: () => Promise<void>;
    setSuccess: (message: string | null) => void;
    setError: (message: string | null) => void;
    searchType: SearchType;
    setSearchType: (type: SearchType) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    SearchedUsers: User[];
  }
  
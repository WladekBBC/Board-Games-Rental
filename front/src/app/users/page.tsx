'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useLang } from '@/lib/contexts/LanguageContext';
import { AdminProtected } from '@/components/AdminProtected';
import { Dialog } from '@headlessui/react';
import { Method, request } from '@/interfaces/api';

/**
 * @interface User
 * @property {number} id - The user's ID.
 * @property {string} email - The user's email.
 * @property {string} permissions - The user's permissions.
 */
interface User {
  id: number;
  email: string;
  permissions: string;
}
/**
 * @function UsersPage
 * @description This is the main component for the users page.
 * @returns {JSX.Element} The users page.
 */
export default function UsersPage() {
  const { JWT, permissions } = useAuth();
  const { language } = useLang();
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  /**
   * @returns {void}
   */
  useEffect(() => {
    if (JWT) 
      fetchUsers();
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

  /**
   * @function handleUpdateUser
   * @description This function updates the user's permissions.
   * @param {number} id - The user's ID.
   * @returns {void}
   */ 
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
      handleSuccess(language.userPermissionsUpdatedSuccessfully);
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

  return (
    <AdminProtected>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {language.usersManagement}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language.email}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language.permissions}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={editing[user.id] ?? user.permissions}
                        onChange={(e) =>
                          setEditing((prev) => ({ ...prev, [user.id]: e.target.value }))
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="Admin">Admin</option>
                        <option value="RWSS">RWSS</option>
                        <option value="User">User</option>
                      </select>
                      {editing[user.id] && editing[user.id] !== user.permissions && (
                        <button
                          onClick={() => handleUpdateUser(user.id)}
                          className="mt-2 text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {language.save}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {language.deleteUser}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal confirm */}
        <Dialog open={!!userToDelete} onClose={() => setUserToDelete(null)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 z-50 max-w-sm mx-auto">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                {language.confirmDeleteUser}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {userToDelete?.email}
              </Dialog.Description>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setUserToDelete(null)}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white"
                >
                  {language.cancel}
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  {language.deleteUser}
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </AdminProtected>
  );
}

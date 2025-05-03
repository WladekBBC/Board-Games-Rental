'use client';

import { useEffect, useState, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useLang } from '@/lib/contexts/LanguageContext';
import { AdminProtected } from '@/components/AdminProtected';

interface User {
  id: number;
  email: string;
  permissions: string;
}

export default function UsersPage() {
  const { JWT } = useAuth();
  const { language } = useLang();
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users', {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
        });

        if (!response.ok) throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);


        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (JWT) fetchUsers();
  }, [JWT]);

  const handleUpdateUser = async (id: number) => {
    try {
      const newPermissions = editing[id];
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${JWT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions: newPermissions }),
      });

      if (!response.ok) throw new Error('Failed to update user');

      setUsers(users.map((user) => user.id === id ? { ...user, permissions: newPermissions } : user));
      setEditing((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete user');

      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <AdminProtected>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {language.usersManagement}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
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
                        <option value="A">Admin</option>
                        <option value="R">RWSS</option>
                        <option value="U">User</option>
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
                {language.confirmDelete}
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
      </main>
    </AdminProtected>
  );
}

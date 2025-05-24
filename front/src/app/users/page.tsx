'use client';
import { Spinner } from '@/components/Messages/Spinner';
import { useLang } from '@/contexts/LanguageContext';
import { Dialog } from '@headlessui/react';
import { useUsers } from '@/contexts/UsersContext';
import { SearchBar } from '@/components/SearchBar';
import { chechCookie, getCookie } from '../actions' 
import { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ErrorField from '@/components/Messages/ErrorField';
import SuccessField from '@/components/Messages/SuccessField';

export default function UsersPage() {
  const { language } = useLang();
  const router = useRouter();
  const {
    loading,
    error,
    success,
    editing,
    userToDelete,
    setEditing,
    setUserToDelete,
    handleUpdateUser,
    handleDeleteUser,
    searchType,
    setSearchType,
    searchQuery,
    setSearchQuery,
    SearchedUsers,
    setError
  } = useUsers();
  const { user: authUser } = useAuth();

  const handleError = (errorMessage: string) =>{
    setError(errorMessage);
    setTimeout(() => setError(null), 3000);
  }

  useEffect(() => {
    chechCookie('Authorization').then((res) => {if (!res) router.push("/")})
  }, [authUser]);
  
  const handleEditChange = (userId: number, field: 'email' | 'permissions' | 'password', value: string) => {
    setEditing((prev) => ({
      ...prev,
      [userId]: {
        ...(prev?.[userId] ?? {}),
        [field]: value
      }
    }));
  };

  const handleSaveAttempt = (userIdToUpdate: number, originalUser: typeof SearchedUsers[0]) => {
    if (setError) setError(''); 
    const editedData = editing[userIdToUpdate];
    const currentEmail = editedData?.email ?? originalUser.email;
    const newPassword = editedData?.password ?? '';

    let isValid = true;

    if (editedData?.email && currentEmail !== originalUser.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(currentEmail)) {
        if (handleError) handleError(language.invalidEmail);
        isValid = false;
      }}

    if (newPassword.length > 0) {
      if (newPassword.length < 6) {
        if (handleError) handleError(language.passwordTooShort); 
        isValid = false;
      }}

    if (isValid) {handleUpdateUser(userIdToUpdate);}
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {language.usersManagement}
        </h1>

        {error && (<ErrorField error={`${error}`}/>)}
        {success && (<SuccessField success={`${success}`}/>)}
        {loading ? (
          <Spinner/>
        ) : (
          <>
          <SearchBar
            options={[
              { value: 'email', label: language.searchByEmail },
              { value: 'permissions', label: language.searchByPerm }
            ]}
            value={searchQuery}
            onValueChange={setSearchQuery}
            selected={searchType}
            onSelectChange={val => setSearchType(val as 'email' | 'permissions')}
            placeholder={searchType === 'email' ? language.searchByEmail : language.searchByPerm}
            className="mb-4"
          />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                    {language.email}
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                    {language.permissions}
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                    {language.newPassword}
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                    {language.actions}
                  </th>
                </tr>
              </thead>
          
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {SearchedUsers.map((currentUser) => {
                  const isChanged = !(
                    (editing[currentUser.id]?.email ?? currentUser.email) === currentUser.email &&
                    (editing[currentUser.id]?.permissions ?? currentUser.permissions) === currentUser.permissions &&
                    (editing[currentUser.id]?.password ?? '') === ''
                  );

                  return (
                    <tr key={currentUser.id}>
                      <td className="px-2 py-4 text-sm">
                        <input
                          maxLength={255}
                          type="email"
                          value={editing[currentUser.id]?.email ?? currentUser.email}
                          onChange={(e) => handleEditChange(currentUser.id, 'email', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </td>
                      <td className="px-2 py-4 text-sm">
                        <select
                          value={editing[currentUser.id]?.permissions ?? currentUser.permissions}
                          onChange={(e) => handleEditChange(currentUser.id, 'permissions', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="Admin">Admin</option>
                          <option value="RWSS">RWSS</option>
                          <option value="User">User</option>
                        </select>
                      </td>
                      <td className="px-2 py-4 text-sm">
                        <input
                          maxLength={255}
                          type="password"
                          placeholder={language.newPassword}
                          value={editing[currentUser.id]?.password ?? ''}
                          onChange={(e) => handleEditChange(currentUser.id, 'password', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </td>
                      <td className="px-2 py-4 text-center text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleSaveAttempt(currentUser.id, currentUser)}
                          disabled={!isChanged}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {language.save}
                        </button>
                        <button
                          onClick={() => setUserToDelete(currentUser)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          {language.deleteUser}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
        )}

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
  );
}
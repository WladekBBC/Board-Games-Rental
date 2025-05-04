import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { gameService } from './game.service';
import { Game, CreateGameDto, UpdateGameDto } from '../../types/game';
import { useLang } from '@/lib/contexts/LanguageContext';

export const GameManagement = () => {
  const { JWT, permissions } = useAuth();
  const { language } = useLang();
  const [games, setGames] = useState<Game[]>([]);
  const [newGame, setNewGame] = useState<CreateGameDto>({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    quantity: 1,
    isAvailable: true
  });
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/games', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": JWT ?? "",
          "permissions": permissions === "A" ? "Admin" : permissions
        },
        mode: 'cors'
      });

      if (!response.ok) throw new Error(`Failed to fetch games: ${response.status} ${response.statusText}`);

      const data = await response.json();
      setGames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      if (editingGame) {
        const response = await fetch(`http://localhost:3001/games/${editingGame.id}`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
            "token": JWT ?? "",
            "permissions": permissions === "A" ? "Admin" : permissions
          },
          mode: 'cors',
          body: JSON.stringify(newGame)
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized - Please log in again');
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update game');
        }

        setEditingGame(null);
      } else {
        const response = await fetch('http://localhost:3001/games', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "token": JWT ?? "",
            "permissions": permissions === "A" ? "Admin" : permissions
          },
          mode: 'cors',
          body: JSON.stringify(newGame)
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized - Please log in again');
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create game');
        }
      }

      setNewGame({
        title: '',
        description: '',
        imageUrl: '',
        category: '',
        quantity: 1,
        isAvailable: true
      });
      await loadGames();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:3001/games/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "token": JWT ?? "",
          "permissions": permissions === "A" ? "Admin" : permissions
        },
        mode: 'cors'
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please log in again');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete game');
      }

      await loadGames();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setNewGame({
      title: game.title,
      description: game.description,
      imageUrl: game.imageUrl,
      category: game.category,
      quantity: game.quantity,
      isAvailable: game.isAvailable
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{language.manageGame}</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingGame ? language.editGame : language.addNewGame}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {language.gameTitle}
            </label>
            <input
              type="text"
              id="title"
              value={newGame.title}
              onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {language.gameDesc}
            </label>
            <textarea
              id="description"
              value={newGame.description}
              onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {language.gameImageUrl}
            </label>
            <input
              type="url"
              id="imageUrl"
              value={newGame.imageUrl}
              onChange={(e) => setNewGame({ ...newGame, imageUrl: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {language.gameCategory}
            </label>
            <input
              type="text"
              id="category"
              value={newGame.category}
              onChange={(e) => setNewGame({ ...newGame, category: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {language.gameNumber}
            </label>
            <input
              type="number"
              id="quantity"
              value={newGame.quantity}
              onChange={(e) => setNewGame({ ...newGame, quantity: parseInt(e.target.value) })}
              min="0"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              checked={newGame.isAvailable}
              onChange={(e) => setNewGame({ ...newGame, isAvailable: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {language.gameAvailable}
            </label>
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isProcessing ? language.gameAdding : (editingGame ? language.editGame : language.addGame)}
          </button>
          {editingGame && (
            <button
              type="button"
              onClick={() => {
                setEditingGame(null);
                setNewGame({
                  title: '',
                  description: '',
                  imageUrl: '',
                  category: '',
                  quantity: 1,
                  isAvailable: true
                });
              }}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {language.cancel}
            </button>
          )}
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(games) && games.map((game) => (
          <div key={game.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <img src={game.imageUrl} alt={game.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{game.title}</h3>
              <div className="text-gray-600 dark:text-gray-300 mb-2">{game.description}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {language.gameCategory}: {game.category}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {language.gameNumber}: {game.quantity}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {language.gameAvailable}: {game.isAvailable ? language.gameAvailable : language.gameUnavailable}
              </div>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => handleEdit(game)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  {language.editGame}
                </button>
                <button
                  onClick={() => handleDelete(game.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  {language.deleteGame}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
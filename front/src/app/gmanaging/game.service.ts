import { Game, CreateGameDto, UpdateGameDto } from '../../types/game';

const API_URL = 'http://localhost:3001';

export const gameService = {
  async getAllGames(): Promise<Game[]> {
    const response = await fetch(`${API_URL}/games`, {
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token') || '',
        'permissions': localStorage.getItem('permissions') || ''
      }
    });
    if (!response.ok) throw new Error('Failed to fetch games');
    return response.json();
  },

  async getGameById(id: number): Promise<Game> {
    const response = await fetch(`${API_URL}/games/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token') || '',
        'permissions': localStorage.getItem('permissions') || ''
      }
    });
    if (!response.ok) throw new Error('Failed to fetch game');
    return response.json();
  },

  async createGame(game: CreateGameDto, token: string): Promise<Game> {
    const response = await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
        'permissions': localStorage.getItem('permissions') || ''
      },
      body: JSON.stringify(game)
    });
    if (!response.ok) throw new Error('Failed to create game');
    return response.json();
  },

  async updateGame(id: number, game: UpdateGameDto, token: string): Promise<Game> {
    const response = await fetch(`${API_URL}/games/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
        'permissions': localStorage.getItem('permissions') || ''
      },
      body: JSON.stringify(game)
    });
    if (!response.ok) throw new Error('Failed to update game');
    return response.json();
  },

  async deleteGame(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/games/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
        'permissions': localStorage.getItem('permissions') || ''
      }
    });
    if (!response.ok) throw new Error('Failed to delete game');
  }
}; 
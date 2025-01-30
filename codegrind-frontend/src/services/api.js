const API_BASE_URL = 'http://localhost:3000/api';
const AI_SERVER_URL = 'http://localhost:5000';

export async function fetchWithError(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Network response was not ok');
  }
  return response.json();
}

export const apiService = {
  problems: {
    getAll: (difficulty) => 
      fetchWithError(`${API_BASE_URL}/problems${difficulty ? `?difficulty=${difficulty}` : ''}`),
    getById: (titleSlug) => 
      fetchWithError(`${API_BASE_URL}/problem/${titleSlug}`),
  },
  chat: {
    sendMessage: (message) => 
      fetchWithError(`${AI_SERVER_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      }),
  }
}; 
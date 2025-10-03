import axios from 'axios';
import { WordSearchResponse, WordDetail, SearchFilters } from '../types';

// Configure axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject({
      message: error.response?.data?.message || 'An error occurred',
      code: error.response?.status || 'UNKNOWN_ERROR',
      details: error.response?.data,
    });
  }
);

// API Services
export const wordService = {
  // Search for words
  searchWords: async (
    query: string, 
    filters?: SearchFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<WordSearchResponse> => {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filters to params
      if (filters) {
        if (filters.partOfSpeech?.length) {
          params.append('partOfSpeech', filters.partOfSpeech.join(','));
        }
        if (filters.difficulty?.length) {
          params.append('difficulty', filters.difficulty.join(','));
        }
        if (filters.frequency?.length) {
          params.append('frequency', filters.frequency.join(','));
        }
        if (filters.minLength) {
          params.append('minLength', filters.minLength.toString());
        }
        if (filters.maxLength) {
          params.append('maxLength', filters.maxLength.toString());
        }
      }

      const response = await api.get(`/words/search?${params}`);
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  // Get word details by ID
  getWordDetail: async (wordId: string): Promise<WordDetail> => {
    try {
      const response = await api.get(`/words/${wordId}`);
      return response.data;
    } catch (error) {
      console.error('Get word detail error:', error);
      throw error;
    }
  },

  // Get random word
  getRandomWord: async (): Promise<WordDetail> => {
    try {
      const response = await api.get('/words/random');
      return response.data;
    } catch (error) {
      console.error('Get random word error:', error);
      throw error;
    }
  },

  // Get word suggestions (autocomplete)
  getWordSuggestions: async (query: string, limit: number = 5): Promise<string[]> => {
    try {
      const response = await api.get(`/words/suggestions?q=${query}&limit=${limit}`);
      return response.data.suggestions || [];
    } catch (error) {
      console.error('Get suggestions error:', error);
      return [];
    }
  },

  // Get popular words
  getPopularWords: async (limit: number = 10): Promise<WordDetail[]> => {
    try {
      const response = await api.get(`/words/popular?limit=${limit}`);
      return response.data.words || [];
    } catch (error) {
      console.error('Get popular words error:', error);
      return [];
    }
  },

  // Get word of the day
  getWordOfTheDay: async (): Promise<WordDetail> => {
    try {
      const response = await api.get('/words/word-of-the-day');
      return response.data;
    } catch (error) {
      console.error('Get word of the day error:', error);
      throw error;
    }
  },
};

// Export the configured axios instance for custom requests
export default api;
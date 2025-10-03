import { useState, useEffect, useCallback } from 'react';
import { wordService } from '../services/api';
import { Word, WordDetail, SearchFilters, UseSearchResult, UseWordDetailResult } from '../types';

// Custom hook for word search
export const useWordSearch = (): UseSearchResult => {
  const [results, setResults] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, filters?: SearchFilters) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await wordService.searchWords(query, filters);
      setResults(response.results);
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  };
};

// Custom hook for word details
export const useWordDetail = (): UseWordDetailResult => {
  const [wordDetail, setWordDetail] = useState<WordDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWordDetail = useCallback(async (wordId: string) => {
    setLoading(true);
    setError(null);

    try {
      const detail = await wordService.getWordDetail(wordId);
      setWordDetail(detail);
    } catch (err: any) {
      setError(err.message || 'Failed to load word details');
      setWordDetail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    wordDetail,
    loading,
    error,
    fetchWordDetail,
  };
};

// Custom hook for word suggestions (autocomplete)
export const useWordSuggestions = (query: string, delay: number = 300) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await wordService.getWordSuggestions(query);
        setSuggestions(results);
      } catch (error) {
        console.error('Suggestions error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, delay]);

  return { suggestions, loading };
};

// Custom hook for popular words
export const usePopularWords = (limit: number = 10) => {
  const [words, setWords] = useState<WordDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularWords = async () => {
      try {
        const popularWords = await wordService.getPopularWords(limit);
        setWords(popularWords);
      } catch (err: any) {
        setError(err.message || 'Failed to load popular words');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularWords();
  }, [limit]);

  return { words, loading, error };
};

// Custom hook for word of the day
export const useWordOfTheDay = () => {
  const [word, setWord] = useState<WordDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      try {
        const wordOfTheDay = await wordService.getWordOfTheDay();
        setWord(wordOfTheDay);
      } catch (err: any) {
        setError(err.message || 'Failed to load word of the day');
      } finally {
        setLoading(false);
      }
    };

    fetchWordOfTheDay();
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const wordOfTheDay = await wordService.getWordOfTheDay();
      setWord(wordOfTheDay);
    } catch (err: any) {
      setError(err.message || 'Failed to load word of the day');
    } finally {
      setLoading(false);
    }
  }, []);

  return { word, loading, error, refresh };
};

// Custom hook for local storage
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// Custom hook for debounced values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
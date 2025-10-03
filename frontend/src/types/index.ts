// API Response Types
export interface WordSearchResponse {
  results: Word[];
  total: number;
  page: number;
  limit: number;
}

export interface Word {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  pronunciation?: string;
  etymology?: string;
  examples?: string[];
}

export interface WordDetail extends Word {
  synonyms?: string[];
  antonyms?: string[];
  relatedWords?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  frequency?: 'common' | 'uncommon' | 'rare';
  audioUrl?: string;
  imageUrl?: string;
  tags?: string[];
}

// API Error Types
export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// Search Filter Types
export interface SearchFilters {
  partOfSpeech?: string[];
  difficulty?: string[];
  frequency?: string[];
  minLength?: number;
  maxLength?: number;
}

// Component Props Types
export interface SearchResultProps {
  words: Word[];
  loading: boolean;
  onWordClick: (wordId: string) => void;
}

export interface WordCardProps {
  word: Word;
  onClick: (wordId: string) => void;
}

// Hook Types
export interface UseSearchResult {
  results: Word[];
  loading: boolean;
  error: string | null;
  search: (query: string, filters?: SearchFilters) => Promise<void>;
  clearResults: () => void;
}

export interface UseWordDetailResult {
  wordDetail: WordDetail | null;
  loading: boolean;
  error: string | null;
  fetchWordDetail: (wordId: string) => Promise<void>;
}
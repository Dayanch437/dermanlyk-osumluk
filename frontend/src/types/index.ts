// API Response Types
export interface WordSearchResponse {
  results: Word[];
  total: number;
  page: number;
  limit: number;
}

export interface Word {
  id: string;
  name: string;
  character?: string;
  living_specification?: string;
  natural_source?: string;
  usage?: string;
  chemical_composition?: string;
  raw_material_for_medicine?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  deleted_at?: string | null;
  photo?: string;  // Relative path to photo
  photo_url?: string;  // Full URL to photo
  
  // Legacy field mapping
  word?: string;
  definition?: string;
  partOfSpeech?: string;
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
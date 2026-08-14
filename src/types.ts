export type Category = '' | 'work' | 'life' | 'study' | 'other';

export type Filter = 'all' | 'active' | 'done';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
  cat: Category;
  createdAt: string;
}

export interface TodoStats {
  total: number;
  done: number;
  pending: number;
  progress: number;
}

export const CATEGORY_CONFIG: Record<Category, { label: string; bg: string; text: string }> = {
  '':     { label: '📋 全部', bg: '#f0e8d5', text: '#6e5a3a' },
  work:   { label: '💼 工作', bg: '#d4e0e8', text: '#3a5a6e' },
  life:   { label: '🏠 生活', bg: '#e8d4d8', text: '#6e3a4a' },
  study:  { label: '📚 学习', bg: '#d4d8e8', text: '#3a3a6e' },
  other:  { label: '🌟 其他', bg: '#d8e8d4', text: '#3a6e3a' },
};

export const CATEGORIES: Category[] = ['', 'work', 'life', 'study', 'other'];

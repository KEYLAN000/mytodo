import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Todo, Category, Filter, TodoStats } from '../types';

const STORAGE_KEY = 'journal_todos';

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedCat, setSelectedCat] = useState<Category>('');

  // persist on every change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const filteredTodos = useMemo(() => {
    let result = todos;
    if (filter === 'active') result = result.filter(t => !t.done);
    if (filter === 'done')   result = result.filter(t => t.done);
    return result;
  }, [todos, filter]);

  const stats = useMemo((): TodoStats => {
    const total = todos.length;
    const done  = todos.filter(t => t.done).length;
    const pending = total - done;
    const progress = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pending, progress };
  }, [todos]);

  const makeTodo = useCallback((text: string): Todo => ({
    id: Date.now() + Math.random(),
    text,
    done: false,
    cat: selectedCat,
    createdAt: new Date().toISOString(),
  }), [selectedCat]);

  const addTodo = useCallback((text: string) => {
    setTodos(prev => [makeTodo(text), ...prev]);
  }, [makeTodo]);

  const addTodos = useCallback((texts: string[]) => {
    const newTodos = texts.map(t => makeTodo(t));
    setTodos(prev => [...newTodos, ...prev]);
  }, [makeTodo]);

  const toggleTodo = useCallback((id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const editTodo = useCallback((id: number, text: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t));
  }, []);

  const clearDone = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.done));
  }, []);

  return {
    todos,
    filteredTodos,
    filter,
    selectedCat,
    stats,
    addTodo,
    addTodos,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearDone,
    setFilter,
    setSelectedCat,
  };
}

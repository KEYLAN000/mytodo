import { useEffect } from 'react';
import { useTodos } from './hooks/useTodos';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import TaskInput from './components/TaskInput';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const {
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
  } = useTodos();

  // Ctrl+K 快捷键聚焦输入框
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('.input-main')?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <div className="desk" />
      <div className="journal">
        <Header />
        <StatsBar stats={stats} />
        <TaskInput
          onAdd={addTodo}
          onAddBatch={addTodos}
          selectedCat={selectedCat}
          onSelectCat={setSelectedCat}
        />
        <FilterBar current={filter} onChange={setFilter} />
        <TaskList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
        <Footer onClearDone={clearDone} hasDone={stats.done > 0} />
        <div className="sticker s1">🌸</div>
        <div className="sticker s2">🍀</div>
      </div>
    </>
  );
}

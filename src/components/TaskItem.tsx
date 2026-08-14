import { useState, useCallback, useRef, useEffect } from 'react';
import type { Todo } from '../types';
import { CATEGORY_CONFIG } from '../types';
import './TaskItem.css';

interface Props {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
}

export default function TaskItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const catCfg = CATEGORY_CONFIG[todo.cat];
  const created = new Date(todo.createdAt);
  const timeStr = `${created.getMonth() + 1}/${created.getDate()} ${String(created.getHours()).padStart(2, '0')}:${String(created.getMinutes()).padStart(2, '0')}`;

  const finishEdit = useCallback(
    (save: boolean) => {
      if (save) {
        const v = editText.trim();
        if (v) onEdit(todo.id, v);
      }
      setEditing(false);
      setEditText(todo.text);
    },
    [editText, todo, onEdit]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') finishEdit(true);
      if (e.key === 'Escape') finishEdit(false);
    },
    [finishEdit]
  );

  return (
    <li className={'task-item' + (todo.done ? ' done' : '')}>
      {/* 复选框 */}
      <label className="checkbox-wrap" title="切换完成状态">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        <span className="check-box">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8l3.5 3.5L13 5"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </label>

      {/* 内容 */}
      <div className="task-content">
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            className="edit-input"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => finishEdit(true)}
            maxLength={200}
          />
        ) : (
          <span className="task-text">{todo.text}</span>
        )}
        <span className="task-meta">
          {todo.cat && (
            <span
              className="task-cat"
              style={{ background: catCfg.bg, color: catCfg.text }}
            >
              {catCfg.label}
            </span>
          )}
          <span>🕒 {timeStr}</span>
        </span>
      </div>

      {/* 操作按钮 */}
      <div className="task-actions">
        <button className="btn-icon" onClick={() => { setEditText(todo.text); setEditing(true); }} title="编辑">
          ✏️
        </button>
        <button className="btn-icon danger" onClick={() => onDelete(todo.id)} title="删除">
          🗑️
        </button>
      </div>
    </li>
  );
}

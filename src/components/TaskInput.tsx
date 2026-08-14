import { useState, useCallback } from 'react';
import type { Category } from '../types';
import { CATEGORIES, CATEGORY_CONFIG } from '../types';
import { decomposeTask, DecomposeError } from '../api/deepseek';
import './TaskInput.css';

interface Props {
  onAdd: (text: string) => void;
  onAddBatch: (texts: string[]) => void;
  selectedCat: Category;
  onSelectCat: (cat: Category) => void;
}

export default function TaskInput({ onAdd, onAddBatch, selectedCat, onSelectCat }: Props) {
  const [text, setText] = useState('');
  const [decomposing, setDecomposing] = useState(false);

  const handleAdd = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  }, [text, onAdd]);

  const handleDecompose = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || decomposing) return;

    setDecomposing(true);
    try {
      const subtasks = await decomposeTask(trimmed);
      if (subtasks.length > 0) {
        onAddBatch(subtasks);
        setText('');
      }
    } catch (err) {
      if (err instanceof DecomposeError) {
        alert(err.message);
      } else {
        alert('网络错误，请检查网络连接后重试');
      }
    } finally {
      setDecomposing(false);
    }
  }, [text, decomposing, onAddBatch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !decomposing) handleAdd();
    },
    [handleAdd, decomposing]
  );

  return (
    <div className="input-section">
      <div className="input-row">
        <input
          type="text"
          className="input-main"
          placeholder="✏️ 写下新的待办事项..."
          maxLength={200}
          autoComplete="off"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn-add" onClick={handleAdd} title="添加 (回车)" disabled={decomposing}>
          ➕ 记下
        </button>
        <button
          className="btn-ai"
          onClick={handleDecompose}
          title="AI 智能拆解为子任务"
          disabled={decomposing || !text.trim()}
        >
          {decomposing ? '⏳ 拆解中...' : '🤖 AI分解'}
        </button>
      </div>
      <div className="category-row">
        <span className="category-label">🏷️ 标签：</span>
        {CATEGORIES.map(cat => {
          const cfg = CATEGORY_CONFIG[cat];
          return (
            <span
              key={cat || '_all'}
              className={'category-chip' + (selectedCat === cat ? ' active' : '')}
              style={{ background: cfg.bg }}
              onClick={() => onSelectCat(cat)}
            >
              {cfg.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

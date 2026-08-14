import type { Filter } from '../types';
import './FilterBar.css';

interface Props {
  current: Filter;
  onChange: (f: Filter) => void;
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',    label: '📖 全部' },
  { key: 'active', label: '📝 进行中' },
  { key: 'done',   label: '✅ 已完成' },
];

export default function FilterBar({ current, onChange }: Props) {
  return (
    <div className="filter-row">
      {FILTERS.map(f => (
        <button
          key={f.key}
          className={'filter-btn' + (current === f.key ? ' active' : '')}
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

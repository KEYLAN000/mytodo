import type { TodoStats } from '../types';
import './StatsBar.css';

interface Props {
  stats: TodoStats;
}

export default function StatsBar({ stats }: Props) {
  return (
    <>
      <div className="stats-bar">
        <span className="stat-item">
          <span className="stat-dot pending" /> 待办 <strong>{stats.pending}</strong>
        </span>
        <span className="stat-item">
          <span className="stat-dot done" /> 完成 <strong>{stats.done}</strong>
        </span>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${stats.progress}%` }} />
      </div>
    </>
  );
}

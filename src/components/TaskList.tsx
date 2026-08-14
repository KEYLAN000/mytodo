import type { Todo } from '../types';
import TaskItem from './TaskItem';
import './TaskList.css';

interface Props {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
}

export default function TaskList({ todos, onToggle, onDelete, onEdit }: Props) {
  return (
    <ul className="task-list">
      {todos.length === 0 ? (
        <li className="empty-hint">✨ 今天还没有待办事项，<br />写点什么吧～</li>
      ) : (
        todos.map(todo => (
          <TaskItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))
      )}
    </ul>
  );
}

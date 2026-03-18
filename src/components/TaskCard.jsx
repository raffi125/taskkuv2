import { getMkColor, getPriority, dueFmt } from '../utils/helpers';
import styles from './TaskCard.module.css';

export default function TaskCard({ task, allMatkul, onToggle, onEdit, onDelete }) {
  const mkColor = getMkColor(task.matkul || 'Lainnya', allMatkul);
  const pri = getPriority(task.priority);
  const due = dueFmt(task.due);

  return (
    <div className={`${styles.card} ${task.done ? styles.done : ''}`}>
      <button
        className={`${styles.check} ${task.done ? styles.checkDone : ''}`}
        onClick={() => onToggle(task)}
        aria-label={task.done ? 'Tandai belum selesai' : 'Tandai selesai'}
      >
        {task.done && <span className={styles.checkmark}>✓</span>}
      </button>

      <div className={styles.body}>
        <div className={`${styles.taskTitle} ${task.done ? styles.titleDone : ''}`}>
          {task.title}
        </div>
        {task.note && <div className={styles.note}>{task.note}</div>}

        <div className={styles.meta}>
          {task.matkul && (
            <span className={styles.badge}
              style={{ background: mkColor.bg, color: mkColor.color, borderColor: mkColor.color + '33' }}>
              {task.matkul}
            </span>
          )}
          <span className={styles.badge}
            style={{ background: pri.bg, color: pri.color, borderColor: pri.color + '33' }}>
            {pri.label}
          </span>
          {due && (
            <span className={`${styles.dueChip} ${styles[due.cls]}`}>
              🕐 {due.label}
            </span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={() => onEdit(task)} title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button className={`${styles.iconBtn} ${styles.delBtn}`} onClick={() => onDelete(task.id)} title="Hapus">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

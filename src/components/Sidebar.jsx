import { getMkColor, todayStr } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import styles from './Sidebar.module.css';

export default function Sidebar({ tasks, allMatkul, page, filter, onPageChange, onFilterChange, onAddTask }) {
  const { user, logout } = useAuth();

  const countFor = (f) => {
    if (f === 'all') return tasks.length;
    if (f === 'active') return tasks.filter(t => !t.done).length;
    if (f === 'done') return tasks.filter(t => t.done).length;
    return tasks.filter(t => t.matkul === f).length;
  };

  const navItems = [
    { f: 'all', icon: '▤', label: 'Semua Tugas' },
    { f: 'active', icon: '◈', label: 'Aktif' },
    { f: 'done', icon: '◉', label: 'Selesai' },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoMark}>T</div>
        <div>
          <div className={styles.logoTitle}>Taskku</div>
          <div className={styles.logoSub}>{todayStr()}</div>
        </div>
      </div>

      {/* User info */}
      <div className={styles.userInfo}>
        <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
        <div className={styles.userDetail}>
          <div className={styles.userName}>{user?.name}</div>
          <div className={styles.userEmail}>{user?.email}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.groupLabel}>Menu</div>
        {navItems.map(item => (
          <button
            key={item.f}
            className={`${styles.navBtn} ${page === 'home' && filter === item.f ? styles.active : ''}`}
            onClick={() => { onPageChange('home'); onFilterChange(item.f); }}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
            <span className={styles.navCount}>{countFor(item.f)}</span>
          </button>
        ))}

        {allMatkul.length > 0 && (
          <>
            <div className={styles.groupLabel}>Mata Kuliah</div>
            {allMatkul.map(mk => {
              const c = getMkColor(mk, allMatkul);
              return (
                <button
                  key={mk}
                  className={`${styles.navBtn} ${page === 'home' && filter === mk ? styles.active : ''}`}
                  onClick={() => { onPageChange('home'); onFilterChange(mk); }}
                >
                  <span className={styles.dot} style={{ background: c.color }} />
                  <span className={styles.navLabel}>{mk}</span>
                  <span className={styles.navCount}>{countFor(mk)}</span>
                </button>
              );
            })}
          </>
        )}

        <div className={styles.groupLabel}>Lainnya</div>
        <button
          className={`${styles.navBtn} ${page === 'stats' ? styles.active : ''}`}
          onClick={() => onPageChange('stats')}
        >
          <span className={styles.navIcon}>⬡</span>
          <span className={styles.navLabel}>Statistik</span>
        </button>
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.addBtn} onClick={onAddTask}>
          <span>＋</span> Tugas Baru
        </button>
        <div className={styles.footerRow}>
          <ThemeToggle />
          <button className={styles.logoutBtn} onClick={logout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

import { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { getMkColor, todayStr } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import ThemeToggle from '../components/ThemeToggle';
import styles from './DashboardPage.module.css';

// ── STATS VIEW ────────────────────────────────────────────────
function StatsView({ tasks, allMatkul }) {
  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const pending = total - done;
  const pct     = total ? Math.round((done / total) * 100) : 0;

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const lbl = d.toLocaleDateString('id-ID', { weekday: 'short' }).slice(0, 3);
    const cnt = tasks.filter(t => t.done && t.done_at?.startsWith(key)).length;
    days.push({ lbl, cnt });
  }
  const maxD = Math.max(...days.map(d => d.cnt), 1);

  const mkCounts = allMatkul.map(mk => ({
    mk,
    cnt: tasks.filter(t => t.matkul === mk).length,
    color: getMkColor(mk, allMatkul).color,
    bg:    getMkColor(mk, allMatkul).bg,
  }));
  const maxMk = Math.max(...mkCounts.map(m => m.cnt), 1);

  const priCounts = [
    { id: 'high',   label: 'Tinggi', color: '#ef4444', cnt: tasks.filter(t => t.priority === 'high').length },
    { id: 'medium', label: 'Sedang', color: '#f59e0b', cnt: tasks.filter(t => t.priority === 'medium').length },
    { id: 'low',    label: 'Rendah', color: '#6b7280', cnt: tasks.filter(t => t.priority === 'low').length },
  ];

  return (
    <div className={styles.statsPage}>
      {/* Summary cards */}
      <div className={styles.statsSummary}>
        {[
          { n: total,   l: 'Total Tugas',  c: 'var(--accent)' },
          { n: done,    l: 'Selesai',       c: 'var(--green)' },
          { n: pending, l: 'Tertunda',      c: 'var(--amber)' },
          { n: `${pct}%`, l: 'Completion', c: 'var(--text)' },
        ].map((s, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statNum} style={{ color: s.c }}>{s.n}</div>
            <div className={styles.statLabel}>{s.l}</div>
          </div>
        ))}
      </div>

      <div className={styles.statsGrid}>
        {/* Bar chart: last 7 days */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Selesai 7 Hari Terakhir</div>
          <div className={styles.bars}>
            {days.map((d, i) => (
              <div key={i} className={styles.barCol}>
                <span className={styles.barVal}>{d.cnt || ''}</span>
                <div className={styles.barBg}>
                  <div
                    className={styles.barFill}
                    style={{ height: `${(d.cnt / maxD) * 100}%`, background: d.cnt ? 'var(--accent)' : 'var(--border)' }}
                  />
                </div>
                <span className={styles.barLabel}>{d.lbl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Per mata kuliah */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Per Mata Kuliah</div>
          {mkCounts.length === 0
            ? <p className={styles.empty}>Belum ada data</p>
            : mkCounts.map(m => (
              <div key={m.mk} className={styles.catRow}>
                <span className={styles.catName}>{m.mk}</span>
                <div className={styles.catBg}>
                  <div className={styles.catFill} style={{ width: `${(m.cnt / maxMk) * 100}%`, background: m.color }} />
                </div>
                <span className={styles.catNum}>{m.cnt}</span>
              </div>
            ))
          }
        </div>

        {/* Per prioritas */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Per Prioritas</div>
          {priCounts.map(p => (
            <div key={p.id} className={styles.catRow}>
              <span className={styles.catName}>{p.label}</span>
              <div className={styles.catBg}>
                <div className={styles.catFill} style={{ width: `${(p.cnt / Math.max(total, 1)) * 100}%`, background: p.color }} />
              </div>
              <span className={styles.catNum}>{p.cnt}</span>
            </div>
          ))}
        </div>

        {/* Progress ring */}
        <div className={styles.chartCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div className={styles.chartTitle} style={{ textAlign: 'center' }}>Overall Progress</div>
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r="54" fill="none" stroke="var(--border)" strokeWidth="12" />
            <circle
              cx="65" cy="65" r="54" fill="none"
              stroke="url(#grad)" strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - pct / 100)}`}
              transform="rotate(-90 65 65)"
              style={{ transition: 'stroke-dashoffset .6s ease' }}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f8ef7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <text x="65" y="60" textAnchor="middle" fontSize="26" fontWeight="800" fill="var(--text)" fontFamily="Sora, sans-serif">{pct}%</text>
            <text x="65" y="80" textAnchor="middle" fontSize="11" fill="var(--text2)" fontFamily="Sora, sans-serif">selesai</text>
          </svg>
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text2)' }}>{done} dari {total} tugas selesai</div>
        </div>
      </div>
    </div>
  );
}

// ── TASK LIST VIEW ────────────────────────────────────────────
function TaskListView({ tasks, allMatkul, filter, search, onToggle, onEdit, onDelete }) {
  const filtered = tasks.filter(t => {
    const matchSearch = !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.matkul?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all'    ? true :
      filter === 'active' ? !t.done :
      filter === 'done'   ? t.done :
      t.matkul === filter;
    return matchSearch && matchFilter;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (!a.due && !b.due) return 0;
    if (!a.due) return 1;
    if (!b.due) return -1;
    return new Date(a.due) - new Date(b.due);
  });

  const pending = sorted.filter(t => !t.done);
  const done    = sorted.filter(t => t.done);

  if (!pending.length && !done.length) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>{search ? '🔍' : '📋'}</div>
        <div className={styles.emptyText}>
          {search ? 'Tidak ada hasil untuk pencarian ini.' : 'Belum ada tugas. Yuk tambah sekarang!'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.taskList}>
      {pending.length > 0 && (
        <section>
          <div className={styles.sectionLabel}>Belum selesai · {pending.length}</div>
          <div className={styles.taskGrid}>
            {pending.map(t => (
              <TaskCard key={t.id} task={t} allMatkul={allMatkul}
                onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}
      {done.length > 0 && (
        <section>
          <div className={styles.sectionLabel}>Selesai · {done.length}</div>
          <div className={styles.taskGrid}>
            {done.map(t => (
              <TaskCard key={t.id} task={t} allMatkul={allMatkul}
                onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────
export default function DashboardPage() {
  const { tasks, allMatkul, addTask, updateTask, toggleTask, removeTask } = useTasks();
  const { user, logout } = useAuth();

  const [page,     setPage]     = useState('home');
  const [filter,   setFilter]   = useState('all');
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const total     = tasks.length;
  const doneCount = tasks.filter(t => t.done).length;
  const pct       = total ? Math.round((doneCount / total) * 100) : 0;

  async function handleSave(fields) {
    try {
      if (modal === 'add') await addTask(fields);
      else await updateTask({ ...modal, ...fields });
      setModal(null);
    } catch (e) {
      console.error('handleSave error:', e);
    }
  }

  const pageTitle =
    page === 'stats'    ? 'Statistik' :
    filter === 'all'    ? 'Semua Tugas' :
    filter === 'active' ? 'Tugas Aktif' :
    filter === 'done'   ? 'Selesai' :
    filter;

  const mobTabs = [
    { id: 'all',    label: 'Semua' },
    { id: 'active', label: 'Aktif' },
    { id: 'done',   label: 'Selesai' },
    ...allMatkul.map(m => ({ id: m, label: m })),
  ];

  // ── MOBILE ──────────────────────────────────────────────────
  if (isMobile) return (
    <div className={styles.mobileLayout}>
      <div className={styles.mobHeader}>
        <div className={styles.mobTitle}>{page === 'stats' ? 'Statistik' : 'Taskku'}</div>
        <div className={styles.mobHeaderRight}>
          <ThemeToggle compact />
          <span className={styles.mobAvatar}>{user?.name?.charAt(0).toUpperCase()}</span>
        </div>
      </div>

      {page === 'home' && (
        <>
          <div className={styles.mobSearch}>
            <span className={styles.mobSearchIcon}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input className={styles.mobSearchInput} placeholder="Cari tugas atau matkul…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className={styles.mobTabs}>
            {mobTabs.map(t => (
              <button key={t.id}
                className={`${styles.mobTab} ${filter === t.id ? styles.mobTabActive : ''}`}
                onClick={() => setFilter(t.id)}>{t.label}</button>
            ))}
          </div>
        </>
      )}

      <div className={styles.mobContent}>
        {page === 'home' ? (
          <>
            <div className={styles.mobProgress}>
              <div className={styles.progBg}>
                <div className={styles.progFill} style={{ width: `${pct}%` }} />
              </div>
              <div className={styles.mobProgText}>{pct}% selesai · {doneCount}/{total} tugas</div>
            </div>
            <TaskListView tasks={tasks} allMatkul={allMatkul} filter={filter} search={search}
              onToggle={toggleTask} onEdit={t => setModal(t)} onDelete={removeTask} />
          </>
        ) : (
          <StatsView tasks={tasks} allMatkul={allMatkul} />
        )}
      </div>

      <div className={styles.bottomNav}>
        <button className={`${styles.navBtn} ${page === 'home' ? styles.navActive : ''}`} onClick={() => setPage('home')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>Tugas</span>
        </button>
        <button className={styles.fab} onClick={() => setModal('add')}>+</button>
        <button className={`${styles.navBtn} ${page === 'stats' ? styles.navActive : ''}`} onClick={() => setPage('stats')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          <span>Statistik</span>
        </button>
        <button className={`${styles.navBtn} ${styles.navLogout}`} onClick={logout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Keluar</span>
        </button>
      </div>

      {modal && (
        <TaskForm task={modal === 'add' ? null : modal} allMatkul={allMatkul}
          onSave={handleSave} onClose={() => setModal(null)} />
      )}
    </div>
  );

  // ── DESKTOP ──────────────────────────────────────────────────
  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <Sidebar
        tasks={tasks}
        allMatkul={allMatkul}
        page={page}
        filter={filter}
        onPageChange={setPage}
        onFilterChange={setFilter}
        onAddTask={() => setModal('add')}
      />

      {/* ── DESKTOP MAIN ── */}
      <div className={styles.main}>
        {/* Topbar */}
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <h1 className={styles.topTitle}>{pageTitle}</h1>
            {page === 'home' && (
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
                <input
                  className={styles.searchInput}
                  placeholder="Cari tugas atau mata kuliah…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className={styles.topbarRight}>
            <ThemeToggle compact />
            <span className={styles.topDate}>{todayStr()}</span>
            {page === 'home' && (
              <button className={styles.addBtnTop} onClick={() => setModal('add')}>
                + Tugas Baru
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {page === 'home' ? (
            <>
              {/* Stats strip */}
              <div className={styles.statsStrip}>
                {[
                  { n: total,    l: 'Total',    c: 'var(--accent)' },
                  { n: doneCount,l: 'Selesai',  c: 'var(--green)' },
                  { n: total - doneCount, l: 'Tertunda', c: 'var(--amber)' },
                ].map((s, i) => (
                  <div key={i} className={styles.stripCard}>
                    <div className={styles.stripNum} style={{ color: s.c }}>{s.n}</div>
                    <div className={styles.stripLabel}>{s.l}</div>
                  </div>
                ))}
                <div className={styles.stripCard}>
                  <div className={styles.stripNum}>{pct}%</div>
                  <div className={styles.stripLabel}>Progress</div>
                  <div className={styles.progBg}>
                    <div className={styles.progFill} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>

              <TaskListView
                tasks={tasks}
                allMatkul={allMatkul}
                filter={filter}
                search={search}
                onToggle={toggleTask}
                onEdit={t => setModal(t)}
                onDelete={removeTask}
              />
            </>
          ) : (
            <StatsView tasks={tasks} allMatkul={allMatkul} />
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <TaskForm
          task={modal === 'add' ? null : modal}
          allMatkul={allMatkul}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

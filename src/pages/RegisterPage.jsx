import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!f.name || !f.email || !f.password) { setError('Semua field wajib diisi.'); return; }
    if (f.password.length < 6) { setError('Password minimal 6 karakter.'); return; }
    if (f.password !== f.confirm) { setError('Password tidak cocok.'); return; }
    setLoading(true);
    try {
      const result = await register({ name: f.name, email: f.email, password: f.password });
      if (result.ok) navigate('/', { replace: true });
      else setError(result.error);
    } catch {
      setError('Terjadi kesalahan, coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>T</div>
          <div className={styles.brandName}>Taskku</div>
        </div>

        <h1 className={styles.heading}>Buat akun baru</h1>
        <p className={styles.sub}>Gratis, tanpa kartu kredit.</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Nama</label>
            <input
              className={styles.input}
              placeholder="Nama lengkap kamu"
              value={f.name}
              onChange={e => { set('name', e.target.value); setError(''); }}
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="nama@email.com"
              value={f.email}
              onChange={e => { set('email', e.target.value); setError(''); }}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Min. 6 karakter"
                value={f.password}
                onChange={e => { set('password', e.target.value); setError(''); }}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Konfirmasi Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Ulangi password"
                value={f.confirm}
                onChange={e => { set('confirm', e.target.value); setError(''); }}
              />
            </div>
          </div>
          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className={styles.footer}>
          Sudah punya akun? <Link to="/login" className={styles.link}>Masuk</Link>
        </p>
      </div>

      <div className={styles.decoration} aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={styles.decDot} style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
          }} />
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!f.email || !f.password) { setError('Semua field wajib diisi.'); return; }
    setLoading(true);
    try {
      const result = await login(f);
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

        <h1 className={styles.heading}>Selamat datang kembali</h1>
        <p className={styles.sub}>Masuk untuk melihat tugas kamu.</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="nama@email.com"
              value={f.email}
              onChange={e => { set('email', e.target.value); setError(''); }}
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={f.password}
              onChange={e => { set('password', e.target.value); setError(''); }}
            />
          </div>
          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        <p className={styles.footer}>
          Belum punya akun? <Link to="/register" className={styles.link}>Daftar sekarang</Link>
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

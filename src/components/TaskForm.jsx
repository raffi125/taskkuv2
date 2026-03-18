import { useState } from 'react';
import { PRIORITIES } from '../utils/helpers';
import styles from './TaskForm.module.css';

// Tidak ada konversi timezone — simpan apa adanya dari input
function localToUTC(localStr) {
  if (!localStr) return null;
  return localStr; // simpan langsung "2026-03-19T04:51"
}

// Tidak ada konversi — tampilkan apa adanya dari DB
function utcToLocal(isoStr) {
  if (!isoStr) return '';
  // Ambil hanya bagian "YYYY-MM-DDTHH:mm" tanpa timezone
  return isoStr.slice(0, 16);
}

export default function TaskForm({ task, allMatkul, onSave, onClose }) {
  const [f, setF] = useState({
    title:       task?.title    || '',
    note:        task?.note     || '',
    matkulInput: task?.matkul   || '',
    priority:    task?.priority || 'medium',
    due:         utcToLocal(task?.due) || '',  // konversi UTC → local saat edit
  });
  const [error,   setError]   = useState('');
  const [saving,  setSaving]  = useState(false);
  const [showSug, setShowSug] = useState(false);

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const suggestions = allMatkul.filter(m =>
    m.toLowerCase().includes(f.matkulInput.toLowerCase()) && m !== f.matkulInput
  );

  async function handleSave() {
    if (!f.title.trim()) { setError('Judul tugas wajib diisi.'); return; }
    setSaving(true);
    try {
      await onSave({
        ...(task || {}),
        title:    f.title.trim(),
        note:     f.note,
        matkul:   f.matkulInput.trim() || 'Lainnya',
        priority: f.priority,
        due:      localToUTC(f.due),  // konversi local → UTC sebelum simpan
      });
    } catch (e) {
      setError(e.message || 'Gagal menyimpan tugas, coba lagi.');
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{task ? 'Edit Tugas' : 'Tugas Baru'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.field}>
          <label className={styles.label}>Judul Tugas <span className={styles.required}>*</span></label>
          <input
            className={styles.input}
            placeholder="Contoh: Laporan praktikum, UTS Kalkulus…"
            value={f.title}
            onChange={e => { set('title', e.target.value); setError(''); }}
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Catatan</label>
          <textarea
            className={styles.textarea}
            placeholder="Detail tambahan (opsional)"
            value={f.note}
            onChange={e => set('note', e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field} style={{ position: 'relative' }}>
            <label className={styles.label}>Mata Kuliah</label>
            <input
              className={styles.input}
              placeholder="Cth: Pemrograman Web"
              value={f.matkulInput}
              onChange={e => { set('matkulInput', e.target.value); setShowSug(true); }}
              onFocus={() => setShowSug(true)}
              onBlur={() => setTimeout(() => setShowSug(false), 150)}
            />
            {showSug && suggestions.length > 0 && (
              <div className={styles.suggestions}>
                {suggestions.map(s => (
                  <div key={s} className={styles.sugItem}
                    onMouseDown={() => { set('matkulInput', s); setShowSug(false); }}>
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Prioritas</label>
            <select className={styles.select} value={f.priority} onChange={e => set('priority', e.target.value)}>
              {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Deadline (Tanggal &amp; Jam)</label>
          <input
            type="datetime-local"
            className={styles.input}
            value={f.due}
            onChange={e => set('due', e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={saving}>Batal</button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : task ? 'Simpan Perubahan' : '+ Tambah Tugas'}
          </button>
        </div>
      </div>
    </div>
  );
}

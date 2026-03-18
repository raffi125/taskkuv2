export const MK_COLORS = [
  { color: '#4f8ef7', bg: 'rgba(79,142,247,.12)' },
  { color: '#a855f7', bg: 'rgba(168,85,247,.12)' },
  { color: '#22c55e', bg: 'rgba(34,197,94,.12)' },
  { color: '#f59e0b', bg: 'rgba(245,158,11,.12)' },
  { color: '#06b6d4', bg: 'rgba(6,182,212,.12)' },
  { color: '#ec4899', bg: 'rgba(236,72,153,.12)' },
  { color: '#f97316', bg: 'rgba(249,115,22,.12)' },
  { color: '#ef4444', bg: 'rgba(239,68,68,.12)' },
];

export const getMkColor = (name, allMk) => {
  const idx = allMk.indexOf(name);
  return MK_COLORS[idx % MK_COLORS.length] || MK_COLORS[0];
};

export const PRIORITIES = [
  { id: 'high',   label: 'Tinggi', color: '#ef4444', bg: 'rgba(239,68,68,.12)' },
  { id: 'medium', label: 'Sedang', color: '#f59e0b', bg: 'rgba(245,158,11,.12)' },
  { id: 'low',    label: 'Rendah', color: '#6b7280', bg: 'rgba(107,114,128,.12)' },
];

export const getPriority = (id) => PRIORITIES.find(p => p.id === id) || PRIORITIES[1];

export function dueFmt(str) {
  if (!str) return null;

  // Parse tanggal & jam langsung dari string — abaikan timezone
  // Format dari DB: "2026-03-19T04:51:00+00:00" atau "2026-03-19T04:51"
  const clean = str.slice(0, 16); // ambil "2026-03-19T04:51"
  const [datePart, timePart] = clean.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);
  const pad = n => String(n).padStart(2, '0');
  const timeStr = `${pad(hh)}.${pad(mm)}`;
  const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const dateStr = `${day} ${monthNames[month - 1]}`;

  // Untuk hitung selisih waktu, pakai Date tapi juga tanpa timezone conversion
  const dLocal = new Date(year, month - 1, day, hh, mm);
  const now = new Date();
  const diffMs = dLocal - now;
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMs < 0) return { label: `Terlambat · ${dateStr} ${timeStr}`, cls: 'overdue' };
  if (diffHrs < 1) return { label: `${Math.floor(diffMs / 60000)} menit lagi`, cls: 'soon' };
  if (diffHrs < 24) return { label: `${diffHrs} jam lagi · ${timeStr}`, cls: 'today' };
  if (diffDays === 1) return { label: `Besok ${timeStr}`, cls: 'soon' };
  return { label: `${dateStr} · ${timeStr}`, cls: 'normal' };
}

export function todayStr() {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

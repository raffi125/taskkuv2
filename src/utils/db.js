// db.js — semua operasi database kini lewat Supabase
// Auth    → pakai supabase.auth (di AuthContext)
// Tasks   → pakai tabel 'tasks' dengan RLS per user

export { supabase } from './supabase'

import { supabase } from './supabase'

// ── TASK CRUD ─────────────────────────────────────────────────

/** Ambil semua task milik user yang sedang login */
export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Tambah task baru */
export async function insertTask(fields) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([fields])
    .select()
    .single()
  if (error) throw error
  return data
}

/** Update task */
export async function updateTask(id, fields) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Hapus task */
export async function deleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}

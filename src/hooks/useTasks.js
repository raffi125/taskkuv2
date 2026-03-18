import { useState, useEffect, useCallback } from 'react'
import { getTasks, insertTask, updateTask as dbUpdate, deleteTask } from '../utils/db'
import { useAuth } from '../context/AuthContext'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Load tasks saat user berubah
  useEffect(() => {
    if (!user) { setTasks([]); setLoading(false); return }
    setLoading(true)
    getTasks()
      .then(data => { setTasks(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [user])

  const addTask = useCallback(async (fields) => {
    // fields.due simpan as-is dari input datetime-local
    const payload = {
      user_id:    user.id,
      title:      fields.title.trim(),
      note:       fields.note     || '',
      matkul:     fields.matkul?.trim() || 'Lainnya',
      priority:   fields.priority || 'medium',
      due:        fields.due || null,
      done_at:    null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    try {
      const task = await insertTask(payload)
      setTasks(prev => [task, ...prev])
      return task
    } catch (e) {
      console.error('addTask error:', e)
      throw e
    }
  }, [user])

  const updateTask = useCallback(async (task) => {
    try {
      const updated = await dbUpdate(task.id, {
        title:    task.title,
        note:     task.note,
        matkul:   task.matkul,
        priority: task.priority,
        due:      task.due || null, // sudah ISO UTC dari TaskForm
      })
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
      return updated
    } catch (e) {
      console.error('updateTask error:', e)
      throw e
    }
  }, [])

  const toggleTask = useCallback(async (task) => {
    const updated = await dbUpdate(task.id, {
      done:    !task.done,
      done_at: !task.done ? new Date().toISOString() : null,
    })
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
  }, [])

  const removeTask = useCallback(async (taskId) => {
    await deleteTask(taskId)
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }, [])

  const allMatkul = [...new Set(tasks.map(t => t.matkul).filter(Boolean))].sort()

  return { tasks, allMatkul, loading, error, addTask, updateTask, toggleTask, removeTask }
}

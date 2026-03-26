import { useState, useEffect } from 'react'

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/v1'
const API_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL

function App() {
  const [view, setView] = useState('login')
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [tasks, setTasks] = useState([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (token) {
      setView('dashboard')
      fetchTasks()
    }
  }, [token])

  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg)
      setSuccess('')
    } else {
      setSuccess(msg)
      setError('')
    }
    setTimeout(() => { setError(''); setSuccess('') }, 3000)
  }

  const handleAuth = async (isLogin) => {
    const endpoint = isLogin ? '/auth/login' : '/auth/register'
    const payload = { email, password }

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const text = await res.text()
      let data = {}
      try { data = JSON.parse(text) } catch { data = { detail: text } }
      if (!res.ok) throw new Error(data.detail || `Error ${res.status}`)
      
      if (isLogin) {
        setToken(data.access_token)
        localStorage.setItem('token', data.access_token)
        showMessage('Successfully logged in!')
      } else {
        showMessage('Registered successfully! Auto logging in...')
        setView('login')
        handleAuth(true)
      }
    } catch (err) {
      showMessage(err.message, true)
    }
  }

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('token')
    setView('login')
    setTasks([])
  }

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/v1/tasks/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) {
        if (res.status === 401) handleLogout()
        throw new Error('Failed to fetch tasks')
      }
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      console.error(err)
    }
  }

  const createTask = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/v1/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: taskTitle, description: taskDesc })
      })
      if (!res.ok) throw new Error('Failed to create task')
      setTaskTitle('')
      setTaskDesc('')
      showMessage('Task created!')
      fetchTasks()
    } catch (err) {
      showMessage(err.message, true)
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/v1/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete task')
      showMessage('Task deleted')
      fetchTasks()
    } catch (err) {
      showMessage(err.message, true)
    }
  }

  const updateTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending'
    try {
      const res = await fetch(`${API_URL}/v1/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error('Failed to update task')
      fetchTasks()
    } catch (err) {
      showMessage(err.message, true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      {/* Toast Notifications */}
      {error && <div className="fixed top-4 bg-red-500 text-white px-6 py-2 rounded shadow transition-all">{error}</div>}
      {success && <div className="fixed top-4 bg-green-500 text-white px-6 py-2 rounded shadow transition-all">{success}</div>}

      <div className="w-full max-w-4xl px-4">
        {view === 'login' || view === 'register' ? (
          <div className="max-w-md mx-auto bg-white p-8 border rounded-xl shadow-sm mt-12">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {view === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter a secure password"
                />
              </div>
              <button 
                onClick={() => handleAuth(view === 'login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors"
              >
                {view === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              {view === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setView(view === 'login' ? 'register' : 'login')}
                className="ml-1 text-blue-600 font-medium hover:underline"
              >
                {view === 'login' ? 'Register here' : 'Login here'}
              </button>
            </p>
          </div>
        ) : (
          <div className="bg-white p-6 border rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h1 className="text-2xl font-bold text-gray-800">Your Tasks</h1>
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 font-medium transition-colors border px-4 py-1.5 rounded text-sm"
              >
                Logout
              </button>
            </div>

            <form onSubmit={createTask} className="mb-8 bg-gray-50 p-4 rounded-lg border">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">Add New Task</h2>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={taskTitle} 
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="Task title" 
                  required
                  className="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input 
                  type="text" 
                  value={taskDesc} 
                  onChange={e => setTaskDesc(e.target.value)}
                  placeholder="Description (optional)" 
                  className="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white px-6 font-medium rounded transition-colors`}
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No tasks yet. Start adding some!</p>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg transition-shadow bg-white">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => updateTaskStatus(task.id, task.status)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                      >
                        {task.status === 'completed' && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                      </button>
                      <div>
                        <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</h3>
                        {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 transition-all p-2"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

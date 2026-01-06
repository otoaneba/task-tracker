import React from 'react'
import { useAuth } from './domain/auth/useAuth'
import { LoginPrompt } from './components/LoginPrompt'
import { TasksPage } from './pages/TasksPage'

export function App() {
  const { state, isAuthenticated } = useAuth()

  if (state.status === 'loading') {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  return <TasksPage />
}

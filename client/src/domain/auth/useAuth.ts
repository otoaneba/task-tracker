import { useState, useEffect } from 'react'
import { login as loginApi, signup as signupApi } from '../../api/auth'
import { getAuthToken, setAuthToken, clearAuthToken } from '../../shared/auth'

type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; token: string }
  | { status: 'unauthenticated' }

export function useAuth() {
  const [state, setState] = useState<AuthState>({ status: 'loading' })

  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      setState({ status: 'authenticated', token })
    } else {
      setState({ status: 'unauthenticated' })
    }
  }, [])

  async function login(email: string, password: string) {
    try {
      const result = await loginApi({ email, password })
      setAuthToken(result.token)
      setState({ status: 'authenticated', token: result.token })
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err }
    }
  }

  async function signup(username: string, email: string, password: string) {
    try {
      const result = await signupApi({ username, email, password })
      setAuthToken(result.token)
      setState({ status: 'authenticated', token: result.token })
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err }
    }
  }

  function logout() {
    clearAuthToken()
    setState({ status: 'unauthenticated' })
  }

  return {
    state,
    login,
    signup,
    logout,
    isAuthenticated: state.status === 'authenticated',
  }
}

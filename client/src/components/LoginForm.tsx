import React, { useState } from 'react'
import { login as loginApi, signup as signupApi } from '../api/auth'
import { setAuthToken } from '../shared/auth'

type LoginFormProps = {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isSignup, setIsSignup] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let result
      if (isSignup) {
        result = await signupApi({ username, email, password })
      } else {
        result = await loginApi({ email, password })
      }

      setAuthToken(result.token)
      // Reload the page to refresh auth state
      window.location.reload()
    } catch (err: any) {
      if (err.status === 401 || err.status === 400) {
        setError('Invalid credentials. Please try again.')
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}
    >
      <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <div style={{ marginBottom: '12px' }}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                  boxSizing: 'border-box',
                }}
              />
            </label>
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '4px',
                boxSizing: 'border-box',
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '4px',
                boxSizing: 'border-box',
              }}
            />
          </label>
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '12px', fontSize: '0.9em' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '12px',
          }}
        >
          {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Log In'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setIsSignup(!isSignup)
          setError(null)
        }}
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: 'transparent',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </button>
    </div>
  )
}

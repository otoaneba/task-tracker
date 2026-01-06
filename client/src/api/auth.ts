type SignupParams = {
  username: string
  email: string
  password: string
}

type LoginParams = {
  email: string
  password: string
}

type AuthResponse = {
  token: string
  user: {
    id: string
    username: string
    email: string
  }
}

export async function signup(params: SignupParams): Promise<AuthResponse> {
  const res = await fetch('/api/users/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    const error = new Error('Signup failed')
    ;(error as any).status = res.status
    throw error
  }

  return res.json()
}

export async function login(params: LoginParams): Promise<AuthResponse> {
  const res = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    const error = new Error('Login failed')
    ;(error as any).status = res.status
    throw error
  }

  return res.json()
}

export type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: DomainError }

export type MutationState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: DomainError }

export type DomainError =
  | { kind: 'unauthorized' }
  | { kind: 'not_found' }
  | { kind: 'network' }
  | { kind: 'unknown'; message?: string }

// components/RetryView.tsx
type RetryViewProps = {
  onRetry: () => void
}

export function RetryView({ onRetry }: RetryViewProps) {
  return (
    <div>
      <p>Network error. Please try again.</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  )
}

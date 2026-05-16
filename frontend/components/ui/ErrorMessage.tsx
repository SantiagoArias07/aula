'use client'

interface ErrorMessageProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorMessage({
  title = 'Ocurrió un error',
  message = 'No pudimos cargar la información. Inténtalo de nuevo.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-danger-100 bg-danger-100 p-6 text-center space-y-3"
    >
      <p className="text-danger-600 font-semibold">{title}</p>
      <p className="text-sm text-neutral-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-primary-600 hover:underline font-medium"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}

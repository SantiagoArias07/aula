import { type SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', id, children, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={[
            'h-10 px-3 rounded-lg border text-sm w-full bg-white text-neutral-900',
            error ? 'border-danger-600' : 'border-neutral-300',
            'outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
            className,
          ].join(' ')}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-danger-600" role="alert">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

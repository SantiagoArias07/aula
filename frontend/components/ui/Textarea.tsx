import { type TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
            {props.required && <span className="text-danger-600 ml-0.5" aria-hidden>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={[
            'px-3 py-2 rounded-lg border text-sm transition-colors w-full resize-y',
            'bg-white text-neutral-900 placeholder:text-neutral-400',
            error
              ? 'border-danger-600 focus:ring-1 focus:ring-danger-600'
              : 'border-neutral-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
            'outline-none',
            className,
          ].join(' ')}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="text-xs text-danger-600" role="alert">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

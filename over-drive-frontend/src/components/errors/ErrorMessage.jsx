/**
 * Reusable error display components.
 *
 * ErrorMessage  — block-level error banner (API errors, form-level errors)
 * FieldError    — inline error under a single form field
 * InfoMessage   — neutral info banner
 * SuccessMessage — green success banner
 */

// ─── Block banners ────────────────────────────────────────────────────────────

export function ErrorMessage({ message, onDismiss, className = "" }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm ${className}`}
    >
      {/* Icon */}
      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      <span className="flex-1">{message}</span>

      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="text-red-400 hover:text-red-600 transition flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function SuccessMessage({ message, onDismiss, className = "" }) {
  if (!message) return null;

  return (
    <div
      role="status"
      className={`flex items-start gap-3 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm ${className}`}
    >
      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      <span className="flex-1">{message}</span>

      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-green-400 hover:text-green-600 transition flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function InfoMessage({ message, className = "" }) {
  if (!message) return null;

  return (
    <div
      role="status"
      className={`flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm ${className}`}
    >
      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

// ─── Inline field error ───────────────────────────────────────────────────────

export function FieldError({ message }) {
  if (!message) return null;

  return (
    <p role="alert" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </p>
  );
}

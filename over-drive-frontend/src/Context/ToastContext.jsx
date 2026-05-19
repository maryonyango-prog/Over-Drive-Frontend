import { createContext, useContext, useState, useCallback, useRef } from "react";

/**
 * Global toast notification system.
 *
 * Usage anywhere in the app:
 *   const { showToast } = useToast();
 *   showToast("Saved successfully!", "success");
 *   showToast("Something went wrong.", "error");
 *   showToast("Loading...", "info");
 */

export const ToastContext = createContext(null);

const TOAST_DURATION = 4000; // ms

let nextId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  /**
   * @param {string} message
   * @param {"success"|"error"|"info"|"warning"} type
   * @param {number} duration  ms before auto-dismiss (0 = sticky)
   */
  const showToast = useCallback((message, type = "info", duration = TOAST_DURATION) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      timers.current[id] = setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};

// ─── Toast container + individual toast ──────────────────────────────────────

const toastStyles = {
  success: {
    bar:  "bg-green-500",
    icon: "text-green-500",
    bg:   "bg-white border-green-200",
    text: "text-gray-800",
    svg: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  error: {
    bar:  "bg-red-500",
    icon: "text-red-500",
    bg:   "bg-white border-red-200",
    text: "text-gray-800",
    svg: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  warning: {
    bar:  "bg-yellow-400",
    icon: "text-yellow-500",
    bg:   "bg-white border-yellow-200",
    text: "text-gray-800",
    svg: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    ),
  },
  info: {
    bar:  "bg-cyan-400",
    icon: "text-cyan-500",
    bg:   "bg-white border-cyan-200",
    text: "text-gray-800",
    svg: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
};

function Toast({ toast, onRemove }) {
  const style = toastStyles[toast.type] || toastStyles.info;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`relative flex items-start gap-3 w-full max-w-sm rounded-xl border shadow-lg px-4 py-3 overflow-hidden ${style.bg}`}
    >
      {/* Coloured left bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${style.bar}`} />

      {/* Icon */}
      <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.icon}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        {style.svg}
      </svg>

      {/* Message */}
      <p className={`flex-1 text-sm font-medium ${style.text}`}>{toast.message}</p>

      {/* Dismiss */}
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

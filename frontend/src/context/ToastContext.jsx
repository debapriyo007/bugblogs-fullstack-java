/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react"

const ToastContext = React.createContext(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = React.useCallback((message, type) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }, [removeToast])

  const success = React.useCallback((message) => addToast(message, "success"), [addToast])
  const error = React.useCallback((message) => addToast(message, "error"), [addToast])
  const info = React.useCallback((message) => addToast(message, "info"), [addToast])
  const warning = React.useCallback((message) => addToast(message, "warning"), [addToast])

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
      
      {/* Toast Floating Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none">
        {toasts.map((toast) => {
          let bgColor = "bg-white/90 dark:bg-zinc-900/90"
          let borderColor = "border-zinc-200 dark:border-zinc-800"
          let Icon = Info
          let iconColor = "text-blue-500"

          if (toast.type === "success") {
            borderColor = "border-emerald-500/30"
            Icon = CheckCircle2
            iconColor = "text-emerald-500"
          } else if (toast.type === "error") {
            borderColor = "border-rose-500/30"
            Icon = AlertCircle
            iconColor = "text-rose-500"
          } else if (toast.type === "warning") {
            borderColor = "border-amber-500/30"
            Icon = AlertTriangle
            iconColor = "text-amber-500"
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-x-0 animate-slide-in ${bgColor} ${borderColor}`}
              style={{
                animation: "slideIn 0.25s ease-out forwards",
              }}
            >
              <Icon className={`h-5 w-5 shrink-0 ${iconColor} mt-0.5`} />
              <div className="flex-grow text-sm font-medium text-foreground select-text leading-snug pr-2">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

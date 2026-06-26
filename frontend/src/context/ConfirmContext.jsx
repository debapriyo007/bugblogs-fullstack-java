/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

const ConfirmContext = React.createContext(null)

export function useConfirm() {
  const context = React.useContext(ConfirmContext)
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider")
  }
  return context
}

export function ConfirmProvider({ children }) {
  const [state, setState] = React.useState({
    open: false,
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    isDestructive: true
  })
  
  const resolveRef = React.useRef(null)

  const confirm = React.useCallback((options) => {
    setState({
      open: true,
      title: options.title || "Confirm Action",
      message: options.message || "Are you sure you want to proceed?",
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
      isDestructive: options.isDestructive !== false
    })
    return new Promise((resolve) => {
      resolveRef.current = resolve
    })
  }, [])

  const handleCancel = React.useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(false)
    }
    setState((prev) => ({ ...prev, open: false }))
  }, [])

  const handleConfirm = React.useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(true)
    }
    setState((prev) => ({ ...prev, open: false }))
  }, [])

  const handleOpenChange = React.useCallback((open) => {
    if (!open) {
      handleCancel()
    }
  }, [handleCancel])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={state.open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md p-6 rounded-2xl animate-zoom-in">
          <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
            {state.isDestructive && (
              <div className="h-10 w-10 rounded-full bg-rose-50/70 dark:bg-rose-950/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 border border-rose-100/50 dark:border-rose-900/20">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
              </div>
            )}
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-none">
              {state.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed select-text">
            {state.message}
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="rounded-xl font-semibold border-zinc-200 dark:border-zinc-800 transition-all text-zinc-700 dark:text-zinc-300"
            >
              {state.cancelText}
            </Button>
            <Button
              variant={state.isDestructive ? "destructive" : "default"}
              onClick={handleConfirm}
              className={`rounded-xl font-bold transition-all px-5 py-2 active:scale-95 duration-100 ${
                state.isDestructive
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-900/10"
                  : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-md"
              }`}
            >
              {state.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  )
}

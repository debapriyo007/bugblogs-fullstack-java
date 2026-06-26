import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownContext = React.createContext(null)

export function DropdownMenu({ children }) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export function DropdownMenuTrigger({ children, ...props }) {
  const context = React.useContext(DropdownContext)
  if (!context) return null

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    context.setOpen(!context.open)
  }

  return (
    <button onClick={handleClick} type="button" className="focus:outline-none flex items-center" {...props}>
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  align = "right",
  className,
  children,
  ...props
}) {
  const context = React.useContext(DropdownContext)
  if (!context || !context.open) return null

  return (
    <div
      onClick={() => context.setOpen(false)}
      className={cn(
        "absolute z-50 mt-2 w-56 rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-lg animate-zoom-in origin-top duration-150",
        align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md px-2.5 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-foreground gap-2",
        className
      )}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({
  className,
  ...props
}) {
  return <div className={cn("-mx-1.5 my-1.5 h-px bg-border", className)} {...props} />
}

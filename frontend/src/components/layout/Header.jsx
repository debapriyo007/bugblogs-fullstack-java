import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  Shield,
} from "lucide-react"
import LogoBug from "@/components/LogoBug"

export default function Header({ mobileMenuOpen, setMobileMenuOpen, navLinks }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border glassmorphism select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-0.5 group shrink-0">
          <LogoBug className="h-10 w-10 text-foreground transition-all duration-200 group-hover:scale-105 shrink-0" />
          <span className="font-bold text-2xl tracking-wide text-zinc-950 dark:text-zinc-50" style={{ fontFamily: "'Caveat', cursive" }}>
            bugblogs<span className="text-rose-600">.</span>
          </span>
        </Link>

        {/* Nav Links (desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium ml-auto mr-8">
          {navLinks.map((link) => {
            const isBlogs = link.label === "Blogs"
            const isAbout = link.path === "/about"
            const active = (isBlogs && location.pathname === "/") || (isAbout && location.pathname === "/about")

            return (
              <Link
                key={link.label}
                to={link.path}
                className={`transition-colors hover:text-rose-600 ${
                  active
                    ? "text-rose-600 font-bold border-b-2 border-rose-600 pb-0.5"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions & Dropdowns */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {user ? (
            <>
              {/* Create Blog Button */}
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("open-editor-modal"))}
                className="hidden sm:flex items-center gap-1.5 rounded-full border-border"
                variant="outline"
                size="sm"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Write Post</span>
              </Button>

              {/* Theme Toggle (Right of Write Post) */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full border-border hover:bg-accent hover:text-accent-foreground"
              >
                {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-accent hover:text-accent-foreground border border-border transition-colors">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold capitalize">
                    {user.username.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold max-w-[80px] truncate capitalize hidden sm:inline-block">
                    {user.username}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="right">
                  <div className="px-2.5 py-1.5 flex flex-col gap-0.5 select-none">
                    <div className="font-semibold text-sm truncate capitalize">{user.username}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    <div className="mt-1 flex">
                      <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"} className="text-[10px] py-0 px-1.5 font-bold uppercase tracking-wider">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>Admin Console</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent("open-editor-modal"))} className="sm:hidden">
                    <PlusCircle className="h-4 w-4 text-muted-foreground" />
                    <span>Write Post</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full border-border hover:bg-accent hover:text-accent-foreground"
              >
                {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
              </Button>

              <Button
                variant="outline"
                onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { mode: "login" } }))}
                className="text-sm font-semibold border-border hover:bg-accent hover:text-accent-foreground px-4 rounded-full transition-all"
              >
                Sign In
              </Button>
            </>
          )}

          {/* Mobile Hamburger Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-full hover:bg-muted"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  )
}

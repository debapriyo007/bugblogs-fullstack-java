import * as React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { X, Shield } from "lucide-react"
import LogoBug from "@/components/LogoBug"

export default function MobileMenu({ mobileMenuOpen, setMobileMenuOpen, navLinks }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-45 bg-black/45 backdrop-blur-sm transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Drawer Panel */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-white dark:bg-zinc-950 shadow-2xl p-6 flex flex-col gap-6 transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Header of Drawer */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1 group">
            <LogoBug className="h-10 w-10 text-foreground transition-all duration-200 group-hover:scale-105" />
            <span className="font-bold text-2xl tracking-wide text-zinc-950 dark:text-zinc-50" style={{ fontFamily: "'Caveat', cursive" }}>
              bugblogs<span className="text-rose-600">.</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-full hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-3 font-semibold text-sm">
          {navLinks.map((link, index) => {
            const isBlogs = link.label === "Blogs"
            const isAbout = link.path === "/about"
            const active = (isBlogs && location.pathname === "/") || (isAbout && location.pathname === "/about")

            return (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  transitionDelay: `${mobileMenuOpen ? index * 50 : 0}ms`
                }}
                className={`p-3 rounded-xl hover:bg-muted/50 transition-all duration-300 ${
                  mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                } ${
                  active
                    ? "text-rose-600 bg-rose-500/10 font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          {user && user.role === "ADMIN" && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                transitionDelay: `${mobileMenuOpen ? navLinks.length * 50 : 0}ms`
              }}
              className={`p-3 rounded-xl hover:bg-muted/50 transition-all duration-300 flex items-center gap-1.5 ${
                mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
              } ${
                location.pathname === "/admin"
                  ? "text-foreground bg-muted font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>

        {/* User CTA Mobile */}
        {!user && (
          <div 
            style={{
              transitionDelay: `${mobileMenuOpen ? (navLinks.length + 1) * 50 : 0}ms`
            }}
            className={`mt-auto border-t border-border pt-4 transition-all duration-300 ${
              mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { mode: "login" } }));
              }}
              className="w-full rounded-full"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

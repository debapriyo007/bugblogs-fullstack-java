import * as React from "react"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Auth from "@/pages/Auth"
import BlogEditor from "@/pages/BlogEditor"
import Header from "@/components/layout/Header"
import MobileMenu from "@/components/layout/MobileMenu"
import Footer from "@/components/layout/Footer"

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  // Modal states
  const [authModalOpen, setAuthModalOpen] = React.useState(false)
  const [authModalMode, setAuthModalMode] = React.useState("login")
  const [editorModalOpen, setEditorModalOpen] = React.useState(false)
  const [editorModalBlogId, setEditorModalBlogId] = React.useState(undefined)

  React.useEffect(() => {
    const handleOpenAuth = (e) => {
      const customEvent = e
      setAuthModalMode(customEvent.detail?.mode || "login")
      setAuthModalOpen(true)
    }

    const handleOpenEditor = (e) => {
      const customEvent = e
      setEditorModalBlogId(customEvent.detail?.editBlogId)
      setEditorModalOpen(true)
    }

    window.addEventListener("open-auth-modal", handleOpenAuth)
    window.addEventListener("open-editor-modal", handleOpenEditor)

    return () => {
      window.removeEventListener("open-auth-modal", handleOpenAuth)
      window.removeEventListener("open-editor-modal", handleOpenEditor)
    }
  }, [])

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Blogs", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/?scroll=contact" }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative">
      {/* Background glowing transparent blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {/* Blob 1 */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-rose-500/[0.04] dark:bg-rose-500/[0.015] blur-[120px] transition-colors duration-300" />
        {/* Blob 2 */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-amber-500/[0.04] dark:bg-amber-500/[0.015] blur-[120px] transition-colors duration-300" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Sticky Header with Glassmorphism */}
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        navLinks={navLinks}
      />

      {/* Mobile Menu Drawer */}
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        navLinks={navLinks}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer navLinks={navLinks} />

      {/* Auth Modal */}
      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent className="max-w-md p-6">
          <Auth isModal={true} onClose={() => setAuthModalOpen(false)} initialMode={authModalMode} />
        </DialogContent>
      </Dialog>

      {/* Editor Modal */}
      <Dialog open={editorModalOpen} onOpenChange={setEditorModalOpen}>
        <DialogContent className="max-w-6xl p-6 overflow-y-auto max-h-[90vh] w-full">
          <BlogEditor
            isModal={true}
            onClose={() => setEditorModalOpen(false)}
            editBlogId={editorModalBlogId}
            onSuccess={(blogId) => {
              // Dispatch event so active feed/page refreshes
              window.dispatchEvent(new CustomEvent("blog-saved", { detail: { blogId } }))
              // Also if they were on a standalone editor route, navigate home
              if (location.pathname === "/editor") {
                navigate("/")
              }
            }}
          />
        </DialogContent>
      </Dialog>

    </div>
  )
}

import * as React from "react"
import { Send } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"

export default function ContactSection() {
  const { user } = useAuth()
  const toast = useToast()

  const [contactName, setContactName] = React.useState("")
  const [contactEmail, setContactEmail] = React.useState("")
  const [contactMessage, setContactMessage] = React.useState("")
  const [sendingContact, setSendingContact] = React.useState(false)

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setSendingContact(true)
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.")
      if (!user) {
        setContactName("")
        setContactEmail("")
      }
      setContactMessage("")
      setSendingContact(false)
    }, 800)
  }

  return (
    <div id="contact-section" className="max-w-5xl mx-auto w-full px-4">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 md:p-12 shadow-sm">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="space-y-1">
            <h2
              className="text-2xl font-bold text-zinc-900 dark:text-zinc-100"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              Get in Touch
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Have a question or want to collaborate? We'd love to hear from you.
            </p>
          </div>

          {user ? (
            <div className="space-y-5 animate-fade-in">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Message</label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder={`Hi, drop your ideas or queries here...`}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none transition-shadow"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendingContact}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-bold transition-all active:scale-95 shadow-md shadow-rose-900/10 hover:shadow-rose-900/20"
                >
                  {sendingContact ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Message</label>
                <textarea
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Your message..."
                  required
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none transition-shadow"
                />
              </div>
              <button
                type="submit"
                disabled={sendingContact}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-bold transition-colors active:scale-95"
              >
                {sendingContact ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

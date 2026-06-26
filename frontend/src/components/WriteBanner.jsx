import { useAuth } from "@/context/AuthContext"

export default function WriteBanner() {
  const { user } = useAuth()

  if (user) return null

  return (
    <div className="max-w-5xl mx-auto px-4 w-full">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-800 to-rose-950 text-white flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:py-0 sm:px-8 md:px-12 gap-6 min-h-[12rem] sm:h-44">
        <div className="absolute top-0 right-0 w-56 h-56 bg-rose-600/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/15 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="relative space-y-1.5 flex-1">
          <span
            className="text-rose-400 text-xl font-semibold"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Start writing today
          </span>
          <h2 className="text-xl sm:text-2xl font-bold leading-snug text-white">
            Share your expertise with the community
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md">
            Publish articles, share insights, and connect with thousands of readers.
          </p>
        </div>
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { mode: "register" } }))
          }}
          className="relative shrink-0 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-rose-900/40"
        >
          Join &amp; Write
        </button>
      </div>
    </div>
  )
}

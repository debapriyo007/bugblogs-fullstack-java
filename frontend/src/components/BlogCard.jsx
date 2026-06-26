import { TrendingUp, ArrowUpRight } from "lucide-react"

export default function BlogCard({ blog, onClick }) {
  if (!blog) return null

  const formatShortDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col gap-3 select-none bg-transparent border-0 rounded-none p-0"
    >
      {/* Cover Image */}
      <div className="aspect-[16/10] w-full bg-zinc-150 dark:bg-zinc-900 overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80"
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 flex flex-col items-center justify-center p-6 text-center">
            <TrendingUp className="h-8 w-8 text-zinc-400/50 mb-1" />
            <span className="text-[10px] font-semibold text-zinc-400 tracking-widest uppercase">
              Article
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <div className="text-[13px] font-semibold text-rose-600 dark:text-rose-400 capitalize">
          {blog.author.username} &bull; {formatShortDate(blog.createdAt)}
        </div>

        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-rose-600 transition-colors leading-snug line-clamp-2">
            {blog.title}
          </h3>
          <ArrowUpRight className="h-5 w-5 text-zinc-400 group-hover:text-rose-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0 mt-0.5" />
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
          {blog.excerpt || blog.content}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {blog.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100/30 dark:border-rose-950/40 capitalize"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

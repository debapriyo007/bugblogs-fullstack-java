import { TrendingUp } from "lucide-react"

export default function FeaturedBlogCard({
  featuredBlog,
  onClick,
}) {
  if (!featuredBlog) return null



  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col gap-4 select-none bg-transparent border-0 rounded-none p-0"
    >
      {/* Cover Image */}
      <div className="aspect-[16/10] w-full bg-zinc-150 dark:bg-zinc-900 overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40">
        {featuredBlog.coverImage ? (
          <img
            src={featuredBlog.coverImage}
            alt={featuredBlog.title}
            className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80"
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 flex flex-col items-center justify-center p-6 text-center select-none">
            <TrendingUp className="h-12 w-12 text-zinc-400/50 mb-2" />
            <span className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">
              Featured Article
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-455">
          {featuredBlog.category?.name || "Uncategorized"}
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-rose-600 transition-colors leading-tight">
          {featuredBlog.title}
        </h2>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {featuredBlog.excerpt || featuredBlog.content}
        </p>
      </div>
    </div>
  )
}

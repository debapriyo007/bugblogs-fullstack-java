import BlogCard from "./BlogCard"
import FeaturedBlogCard from "./FeaturedBlogCard"
import { Button } from "@/components/ui/button"
import { TrendingUp, ChevronLeft, ChevronRight, Sparkles, RotateCcw } from "lucide-react"
import LogoBug from "./LogoBug"

export default function BlogFeedGrid({
  loading,
  blogs,
  featuredBlog,
  topThreeBlogs,
  remainingBlogs,
  showSplitLayout,
  handleClearFilters,
  handlePageChange,
  currentPage,
  totalPages,
  navigate,
}) {
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

  const getPageNumbers = () => {
    const delta = 1
    const left = currentPage - delta
    const right = currentPage + delta
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 0; i < totalPages; i++) {
      if (i === 0 || i === totalPages - 1 || (i >= left && i <= right)) {
        range.push(i)
      }
    }

    for (let i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l > 2) {
          rangeWithDots.push("...")
        }
      }
      rangeWithDots.push(i)
      l = i
    }

    return rangeWithDots
  }

  return (
    <div id="blog-feed-section" className="space-y-16 select-none max-w-5xl mx-auto w-full px-4">
      {loading ? (
        /* Flat Skeleton Loading State */
        <div className="space-y-16">
          {showSplitLayout ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Featured Post Skeleton */}
              <div className="lg:col-span-7 space-y-4 animate-pulse">
                <div className="aspect-[16/10] bg-zinc-200 dark:bg-zinc-800 rounded-2xl w-full" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
              </div>
              {/* Right Top Stories Skeleton */}
              <div className="lg:col-span-5 space-y-4 animate-pulse">
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-4" />
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-2 border-b border-zinc-100 dark:border-zinc-800/40 last:border-0 pb-4 last:pb-0">
                      <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                      </div>
                      <div className="h-16 w-16 rounded-xl bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-[16/10] bg-zinc-200 dark:bg-zinc-800 rounded-2xl w-full" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      ) : blogs.length === 0 ? (
        /* Empty State */
        <div className="relative py-24 flex flex-col items-center justify-center select-none text-center">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-3xl pointer-events-none -z-10" />
          
          {/* Glowing Brand Icon Group */}
          <div className="relative mb-6 flex items-center justify-center">
            {/* Pulsing ring outer */}
            <div className="absolute h-20 w-20 rounded-full border border-rose-500/20 dark:border-rose-500/30 scale-125 animate-pulse duration-[3s]" />
            {/* Floating sparkle decoration */}
            <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-rose-500 dark:text-rose-400 animate-bounce" style={{ animationDuration: '3.5s' }} />
            {/* Spinning/pulsing aura background */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-rose-500/10 to-violet-500/10 dark:from-rose-500/20 dark:to-violet-500/20 rounded-full blur-md opacity-80" />
            
            {/* Main Ladybug/Bug Icon in a custom circle */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-50 to-rose-100 dark:from-zinc-900 dark:to-zinc-950 border border-rose-200/50 dark:border-zinc-800 text-rose-600 dark:text-rose-500 shadow-sm transition-transform duration-500 hover:rotate-12 hover:scale-105">
              <LogoBug className="h-8 w-8" animated={true} showBackdrop={false} />
            </div>
          </div>

          <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">No Blogs Found !</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs leading-relaxed">
            We couldn't find any articles matching your search or filters. Try adjusting your selection or search keywords.
          </p>

          <Button 
            onClick={handleClearFilters} 
            size="sm" 
            className="mt-6 rounded-xl bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-900 dark:hover:bg-zinc-100 text-zinc-50 dark:text-zinc-950 font-bold px-5 py-2.5 shadow-md active:scale-95 transition-all flex items-center gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Search Filters</span>
          </Button>
        </div>
      ) : (
        /* Feed Results */
        <div className="space-y-16 animate-fade-in">
          {showSplitLayout ? (
            <>
              {/* Top Section: Featured + Top Stories */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left: Featured Blog */}
                <div className="lg:col-span-7">
                  <FeaturedBlogCard
                    featuredBlog={featuredBlog}
                    onClick={() => navigate(`/blog/${featuredBlog.id}`)}
                  />
                </div>

                {/* Right: Top Stories */}
                {topThreeBlogs.length > 0 && (
                  <div className="lg:col-span-5 flex flex-col">
                    <h2
                      className="text-2xl sm:text-3xl font-bold tracking-wide text-zinc-950 dark:text-zinc-50 mb-4 select-none flex items-center gap-2"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      <TrendingUp className="h-6 w-6 text-rose-600 shrink-0" />
                      <span>Top Stories<span className="text-rose-600">.</span></span>
                    </h2>
                    <div className="flex flex-col divide-y divide-zinc-150 dark:divide-zinc-800/60">
                      {topThreeBlogs.map((blog, idx) => (
                        <div
                          key={blog.id}
                          onClick={() => navigate(`/blog/${blog.id}`)}
                          className="group cursor-pointer flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                        >
                          {/* Index Circle Number */}
                          <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-extrabold text-sm flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>

                          {/* Details (Title & Metadata) */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-rose-600 transition-colors leading-snug line-clamp-2">
                              {blog.title}
                            </h3>
                            <div className="text-[11px] font-semibold text-zinc-550 dark:text-zinc-450 capitalize">
                              {blog.author.username} &bull; {formatShortDate(blog.createdAt)}
                            </div>
                          </div>

                          {/* Small Square Cover Image */}
                          <div className="h-16 w-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/30 shrink-0">
                            {blog.coverImage ? (
                              <img
                                src={blog.coverImage}
                                alt={blog.title}
                                className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                                onError={(e) => {
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150&auto=format&fit=crop&q=80"
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-2">
                                <TrendingUp className="h-5 w-5 text-zinc-450" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Section: Remaining Blogs Grid */}
              {remainingBlogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                  {remainingBlogs.map((blog) => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      onClick={() => navigate(`/blog/${blog.id}`)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Standard Grid for Search / Filters / Pages > 0 */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onClick={() => navigate(`/blog/${blog.id}`)}
                />
              ))}
            </div>
          )}

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-zinc-150 dark:border-zinc-800/60 w-full animate-fade-in">
              {/* Previous Page Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="rounded-xl flex items-center gap-1 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 border-zinc-200 dark:border-zinc-800 transition-all font-semibold"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                {getPageNumbers().map((page, index) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`dots-${index}`}
                        className="px-2 text-zinc-400 dark:text-zinc-600 select-none text-sm font-medium"
                      >
                        ...
                      </span>
                    )
                  }
                  
                  const isActive = currentPage === page
                  return (
                    <Button
                      key={page}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`h-8 w-8 p-0 rounded-xl transition-all font-bold text-sm ${
                        isActive
                          ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md active:scale-95"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-95"
                      }`}
                    >
                      {page + 1}
                    </Button>
                  )
                })}
              </div>

              {/* Next Page Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="rounded-xl flex items-center gap-1 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 border-zinc-200 dark:border-zinc-800 transition-all font-semibold"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

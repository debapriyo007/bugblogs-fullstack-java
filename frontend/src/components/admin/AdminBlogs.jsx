import * as React from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen, Eye, Trash2, Loader2, ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AdminBlogs({
  blogs,
  blogsPage,
  blogsTotalPages,
  blogsLoading,
  actionLoading,
  onDeleteBlog,
  onPageChange,
  onSearchChange
}) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = React.useState("")

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearchChange(searchTerm)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    onSearchChange("")
  }

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      const dateFormatted = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      const timeFormatted = date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
      return `${dateFormatted} at ${timeFormatted}`
    } catch {
      return dateStr
    }
  }

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-none rounded-3xl bg-white dark:bg-zinc-950 p-2">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
        <div className="md:min-w-[200px]">
          <CardTitle className="text-base font-sans font-extrabold text-zinc-900 dark:text-zinc-50">Blog Posts</CardTitle>
          <CardDescription className="text-xs">Monitor and manage platform articles.</CardDescription>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-grow justify-center max-w-md mx-auto w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search blogs by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-8 py-1.5 w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all text-foreground font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            className="h-8 px-4 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shrink-0"
          >
            Search
          </Button>
        </form>
        <div className="h-8 px-3 text-xs font-bold text-muted-foreground bg-muted border border-zinc-200 dark:border-zinc-800/80 rounded-xl shrink-0 flex items-center justify-center min-w-[100px]">
          Page {blogsPage + 1} of {blogsTotalPages}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {blogsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <BookOpen className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <h3 className="text-sm font-semibold">No Blogs Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm min-h-[170px]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold tracking-wide uppercase">
                      {blog.category?.name || "Uncategorized"}
                    </span>
                    <span className="font-mono text-muted-foreground font-semibold">#{blog.id}</span>
                  </div>

                  <h3
                    onClick={() => navigate(`/blog/${blog.id}`)}
                    className="font-extrabold text-sm text-foreground line-clamp-2 mt-2.5 hover:text-rose-500 transition-colors cursor-pointer leading-snug"
                  >
                    {blog.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="h-5 w-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold flex items-center justify-center text-zinc-600 dark:text-zinc-300 capitalize shrink-0">
                        {blog.author.username.charAt(0)}
                      </div>
                      <span className="font-semibold text-muted-foreground truncate capitalize">
                        {blog.author.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 text-muted-foreground font-mono text-[10px] shrink-0">
                      <Eye className="h-3 w-3 shrink-0" />
                      <span>{blog.viewCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] text-muted-foreground font-medium">
                      {formatDate(blog.createdAt)}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/blog/${blog.id}`)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={actionLoading}
                        onClick={() => onDeleteBlog(blog.id, blog.title)}
                        className="h-7 w-7 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!blogsLoading && blogsTotalPages >= 1 && (
          <div className="flex items-center justify-between border-t border-border/40 p-3">
            <span className="text-[10px] text-muted-foreground">
              Page {blogsPage + 1} of {blogsTotalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={blogsPage === 0 || actionLoading}
                onClick={() => onPageChange(blogsPage - 1)}
                className="h-7 px-2 text-xs gap-1"
              >
                <ChevronLeft className="h-3 w-3" />
                <span>Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={blogsPage >= blogsTotalPages - 1 || actionLoading}
                onClick={() => onPageChange(blogsPage + 1)}
                className="h-7 px-2 text-xs gap-1"
              >
                <span>Next</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Eye, Heart, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import LogoBug from "../LogoBug"

export default function MyArticlesList({
  blogs,
  blogsLoading,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  myCategories,
  paginatedBlogs,
  filteredBlogsCount,
  startIndex,
  myBlogsPage,
  setMyBlogsPage,
  totalMyBlogsPages,
  onDeletePost,
  formatDate,
  likesCountMap
}) {
  const navigate = useNavigate()
  const ITEMS_PER_PAGE = 6

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-none min-h-[500px] rounded-3xl bg-white dark:bg-zinc-950 p-2">
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2 font-sans font-extrabold text-zinc-900 dark:text-zinc-50">
            <LogoBug className="h-6 w-6" animated={true} />
            <span>My Articles</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-medium">
            A list of all blogs authored by you.
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        
        {/* Interactive Search & Category Filter Header Bar */}
        {blogs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-3.5 bg-muted/20 border border-border/40 p-3 rounded-2xl select-none">
            {/* Search Input */}
            <div className="relative w-full flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search my articles by title or excerpt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl border-zinc-200/80 dark:border-zinc-800"
              />
            </div>
            {/* Category dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-semibold shadow-sm focus:outline-none capitalize shrink-0 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {myCategories.filter(c => c !== "all").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {blogsLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center px-4">
            <LogoBug className="h-14 w-14 mb-2" animated={true} />
            <h3 className="text-lg font-semibold">You haven't written any posts yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-xs">
              Share your ideas, tutorials, and thoughts with the world.
            </p>
            <Button onClick={() => navigate("/editor")} size="sm">
              Write Your First Post
            </Button>
          </div>
        ) : filteredBlogsCount === 0 ? (
          <div className="text-center py-24 flex flex-col items-center justify-center px-4 select-none">
            <Search className="h-10 w-10 text-muted-foreground/40 mb-2" />
            <h3 className="text-base font-bold">No articles match your query</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Try adjusting your category selection or search keywords.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedBlogs.map((blog) => (
                <Card
                  key={blog.id}
                  className="group border border-zinc-200 dark:border-zinc-800/80 hover:border-rose-500 dark:hover:border-rose-500 shadow-none transition-all duration-200 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/40 flex flex-col justify-between"
                >
                  {/* Cover Thumbnail Header */}
                  <div className="relative w-full h-40 bg-muted overflow-hidden shrink-0 select-none border-b border-border/20">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80"
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-700 dark:from-zinc-900 dark:to-zinc-800 flex flex-col items-center justify-center p-4 text-center">
                        <LogoBug className="h-10 w-10 mb-1 opacity-40" animated={false} />
                        <span className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                          bugblogs Article
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant={blog.status === "PUBLISHED" ? "success" : "secondary"} className="uppercase text-[9px] font-extrabold tracking-wider py-0.5 px-2">
                        {blog.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Content body */}
                  <div className="p-5 flex-grow flex flex-col justify-between gap-3">
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        {formatDate(blog.createdAt)}
                      </span>
                      <h4 
                        onClick={() => navigate(`/blog/${blog.id}`)}
                        className="font-bold text-base leading-snug line-clamp-1 hover:underline cursor-pointer text-foreground hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      >
                        {blog.title}
                      </h4>
                      {blog.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-normal pt-0.5">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40 select-none">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{blog.viewCount}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
                          <span>{likesCountMap[blog.id] || 0}</span>
                        </span>
                      </div>
                      <Badge variant="outline" className="px-2 py-0.5 select-none text-[9px] bg-muted/60 border-border/40 font-bold capitalize">
                        {blog.category?.name || "Uncategorized"}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-5 pb-5 pt-0 flex gap-2 justify-end select-none shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 flex items-center gap-1 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-muted"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/editor?edit=${blog.id}`)
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive flex items-center gap-1 text-xs rounded-xl"
                      onClick={(e) => onDeletePost(blog.id, e)}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Dynamic Pagination Bar (Shown after 6 items) */}
            {totalMyBlogsPages > 1 && (
              <div className="flex items-center justify-between border-t border-border/40 pt-6 mt-6 select-none">
                <span className="text-xs text-muted-foreground font-semibold">
                  Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredBlogsCount)} of {filteredBlogsCount} articles
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={myBlogsPage === 0}
                    onClick={() => setMyBlogsPage((p) => p - 1)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Badge variant="secondary" className="px-2.5 py-1 text-xs font-extrabold bg-muted">
                    {myBlogsPage + 1} / {totalMyBlogsPages}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={myBlogsPage === totalMyBlogsPages - 1}
                    onClick={() => setMyBlogsPage((p) => p + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

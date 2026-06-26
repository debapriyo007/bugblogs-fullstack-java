import * as React from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { useConfirm } from "@/context/ConfirmContext"
import { api } from "@/services/api"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, Heart, ArrowLeft } from "lucide-react"
import LogoBug from "@/components/LogoBug"
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa"
import BlogCard from "@/components/BlogCard"

// Import modular details components
import BlogComments from "@/components/blog/BlogComments"
import SocialShareActions from "@/components/blog/SocialShareActions"

export default function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const confirm = useConfirm()
  
  const [blog, setBlog] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  
  // Share Button feedback
  const [copied, setCopied] = React.useState(false)

  // Like states
  const [liked, setLiked] = React.useState(false)
  const [likeCount, setLikeCount] = React.useState(0)
  const [likeLoading, setLikeLoading] = React.useState(false)

  // Comment states
  const [comments, setComments] = React.useState([])
  const [commentsLoading, setCommentsLoading] = React.useState(false)
  const [newComment, setNewComment] = React.useState("")
  const [submittingComment, setSubmittingComment] = React.useState(false)
  const [editingCommentId, setEditingCommentId] = React.useState(null)
  const [editingContent, setEditingContent] = React.useState("")
  const [savingCommentId, setSavingCommentId] = React.useState(null)

  // Recommended blogs states
  const [recommendedBlogs, setRecommendedBlogs] = React.useState([])

  const fetchBlogDetails = React.useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const sessionKey = `viewed_blog_${id}`
      const hasViewed = sessionStorage.getItem(sessionKey)
      let incrementParam = "false"
      
      if (!hasViewed) {
        incrementParam = "true"
        sessionStorage.setItem(sessionKey, "true")
      }

      const res = await api.get(`/api/blogs/${id}?increment=${incrementParam}`)
      setBlog(res.data)
    } catch (err) {
      setError(err.message || "Failed to load blog article details")
    } finally {
      setLoading(false)
    }
  }, [id])

  const fetchLikesAndComments = React.useCallback(async () => {
    if (!id) return
    
    try {
      const res = await api.get(`/api/blogs/${id}/likes`)
      setLikeCount(res.data.count)
    } catch (err) {
      console.error("Failed to fetch likes", err)
    }

    if (user) {
      try {
        const res = await api.get(`/api/blogs/${id}/liked`)
        setLiked(res.data.liked)
      } catch (err) {
        console.error("Failed to fetch like status", err)
      }
    } else {
      setLiked(false)
    }

    try {
      setCommentsLoading(true)
      const res = await api.get(`/api/blogs/${id}/comments`)
      setComments(res.data || [])
    } catch (err) {
      console.error("Failed to fetch comments", err)
    } finally {
      setCommentsLoading(false)
    }
  }, [id, user])

  React.useEffect(() => {
    Promise.resolve().then(() => {
      fetchBlogDetails()
      fetchLikesAndComments()
    })
  }, [id, user, fetchBlogDetails, fetchLikesAndComments])

  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like this post")
      window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { mode: "login" } }))
      return
    }
    if (!id || likeLoading) return

    setLikeLoading(true)
    try {
      if (liked) {
        await api.delete(`/api/blogs/${id}/like`)
        setLiked(false)
        setLikeCount((prev) => Math.max(0, prev - 1))
        toast.success("Like removed.")
      } else {
        await api.post(`/api/blogs/${id}/like`)
        setLiked(true)
        setLikeCount((prev) => prev + 1)
        toast.success("Post liked!")
      }
    } catch (err) {
      toast.error(err.message || "Failed to complete like operation")
    } finally {
      setLikeLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error("Please log in to write a comment")
      return
    }
    if (!newComment.trim() || submittingComment) return

    setSubmittingComment(true)
    try {
      const res = await api.post(`/api/blogs/${id}/comments`, { content: newComment.trim() })
      setComments((prev) => [res.data, ...prev])
      setNewComment("")
      toast.success("Comment posted successfully!")
    } catch (err) {
      toast.error(err.message || "Failed to post comment")
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    const confirmed = await confirm({
      title: "Delete Comment",
      message: "Are you sure you want to delete this comment?",
      confirmText: "Delete"
    })
    if (!confirmed) return

    try {
      await api.delete(`/api/comments/${commentId}`)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      toast.success("Comment deleted successfully")
    } catch (err) {
      toast.error(err.message || "Failed to delete comment")
    }
  }

  const handleSaveEditComment = async (commentId) => {
    if (!editingContent.trim()) return
    if (editingContent.trim() === comments.find((c) => c.id === commentId)?.content) {
      setEditingCommentId(null)
      return
    }

    setSavingCommentId(commentId)
    try {
      const res = await api.put(`/api/comments/${commentId}`, { content: editingContent.trim() })
      setComments((prev) => prev.map((c) => (c.id === commentId ? res.data : c)))
      setEditingCommentId(null)
      toast.success("Comment updated successfully!")
    } catch (err) {
      toast.error(err.message || "Failed to update comment")
    } finally {
      setSavingCommentId(null)
    }
  }

  React.useEffect(() => {
    const handleBlogSaved = (e) => {
      const customEvent = e
      if (blog && customEvent.detail?.blogId === blog.id) {
        fetchBlogDetails()
        fetchLikesAndComments()
      }
    }
    window.addEventListener("blog-saved", handleBlogSaved)
    return () => {
      window.removeEventListener("blog-saved", handleBlogSaved)
    }
  }, [blog, fetchBlogDetails, fetchLikesAndComments])

  const fetchRecommendedBlogs = React.useCallback(async (categoryId) => {
    try {
      const res = await api.get(`/api/blogs/category/${categoryId}?page=0&size=4`)
      if (res.data && res.data.content) {
        const filtered = res.data.content.filter((b) => b.id !== parseInt(id))
        setRecommendedBlogs(filtered.slice(0, 3))
      }
    } catch (err) {
      console.error("Failed to load recommended blogs:", err)
    }
  }, [id])

  React.useEffect(() => {
    if (blog && blog.category) {
      Promise.resolve().then(() => {
        fetchRecommendedBlogs(blog.category.id)
      })
    }
  }, [blog, fetchRecommendedBlogs])

  const handleShareSocial = (platform) => {
    const url = window.location.href
    const title = blog?.title || ""
    let shareUrl = ""
    if (platform === "twitter") {
      shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Failed to copy link", e)
      toast.error("Could not copy link to clipboard")
    }
  }

  const handleDelete = async () => {
    if (!blog) return
    const confirmed = await confirm({
      title: "Delete Blog Post",
      message: "Are you sure you want to delete this blog post? This action is permanent.",
      confirmText: "Delete"
    })
    if (!confirmed) return

    try {
      await api.delete(`/api/blogs/${blog.id}`)
      toast.success("Blog post deleted successfully!")
      navigate("/")
    } catch (err) {
      toast.error(err.message || "Failed to delete post")
    }
  }

  const calculateReadTime = (text) => {
    const wordsPerMinute = 200
    const words = text ? text.split(/\s+/).length : 0
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  const canManage = () => {
    if (!user || !blog) return false
    return user.role === "ADMIN" || blog.author.id === user.id
  }

  const getInitialColor = (username) => {
    const colors = [
      "bg-rose-500", "bg-indigo-500", "bg-emerald-500",
      "bg-amber-500", "bg-cyan-500", "bg-violet-500", "bg-orange-500"
    ]
    const hash = (username || "A").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-24 select-none animate-fade-in">
        <div className="text-center flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium">Loading article...</span>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="flex-grow flex items-center justify-center py-16 animate-fade-in select-none">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-4 border border-dashed border-border rounded-xl bg-muted/10 p-8">
          <AlertCircle className="h-12 w-12 text-destructive mb-1" />
          <h2 className="text-xl font-bold">Failed to Fetch Article</h2>
          <p className="text-sm text-muted-foreground">
            {error || "The requested blog post could not be found or has been deleted."}
          </p>
          <Button onClick={() => navigate("/")} size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Feed</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto space-y-8 py-6 md:py-10 animate-fade-in select-none">
      
      {/* Action panel */}
      <SocialShareActions
        blog={blog}
        liked={liked}
        likeCount={likeCount}
        likeLoading={likeLoading}
        copied={copied}
        canManage={canManage()}
        onLike={handleLike}
        onShare={handleShare}
        onDelete={handleDelete}
        onNavigateBack={() => navigate(-1)}
      />

      {/* Main Blog Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
          <span className="text-rose-600 dark:text-rose-400 capitalize">
            {blog.category?.name || "Uncategorized"}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-zinc-500 font-medium">
            {calculateReadTime(blog.content)}
          </span>
          {blog.tags && blog.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-[10px] font-bold rounded-lg px-2 py-0.5 ml-1">
              #{tag.name}
            </Badge>
          ))}
          {blog.status === "DRAFT" && (
            <Badge variant="destructive" className="text-[9px] uppercase font-extrabold ml-1">
              {blog.status}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-zinc-900 dark:text-zinc-50 select-text">
          {blog.title}
        </h1>
      </header>

      {/* Excerpt Quote Callout Box */}
      {blog.excerpt && (
        <div className="bg-rose-50/70 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-6 sm:p-8 rounded-3xl text-center font-semibold italic text-base sm:text-lg leading-relaxed border border-rose-100/50 dark:border-rose-900/20">
          "{blog.excerpt}"
        </div>
      )}

      {/* Cover Image Banner */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm select-none bg-zinc-50 dark:bg-zinc-950">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80"
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 flex flex-col items-center justify-center p-6 text-center select-none">
            <LogoBug className="h-16 w-16 mb-2 opacity-30" animated={false} />
            <span className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">
              bugblogs Premium Post
            </span>
          </div>
        )}
      </div>

      {/* Markdown Content */}
      <div className="py-4 select-text text-zinc-800 dark:text-zinc-200 leading-relaxed text-[16px] sm:text-[17px] markdown-content">
        <MarkdownRenderer content={blog.content || ""} />
      </div>

      {/* Author and Share Block below content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 py-6 border-t border-b border-zinc-150 dark:border-zinc-800/80 my-6">
        {/* Left: Author Block */}
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${getInitialColor(blog.author.username)}`}
          >
            {(blog.author.username || "A").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">
              Written by
            </div>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50 capitalize">
              {blog.author.username}
            </div>
          </div>
        </div>

        {/* Right: Share Block */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">
            Share this blog:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleShareSocial("facebook")}
              className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:border-rose-500 transition-colors bg-transparent cursor-pointer"
              title="Share on Facebook"
            >
              <FaFacebook className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleShareSocial("twitter")}
              className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:border-rose-500 transition-colors bg-transparent cursor-pointer"
              title="Share on Twitter"
            >
              <FaTwitter className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleShareSocial("linkedin")}
              className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:border-rose-500 transition-colors bg-transparent cursor-pointer"
              title="Share on LinkedIn"
            >
              <FaLinkedin className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Heart/Like Button & tags */}
      <div className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-zinc-400 font-extrabold uppercase tracking-wider mr-1">Tags:</span>
          {blog.tags && blog.tags.length > 0 ? (
            blog.tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/?search=${encodeURIComponent(tag.name)}`}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white dark:hover:text-white transition-all duration-200"
              >
                #{tag.name}
              </Link>
            ))
          ) : (
            <span className="text-xs text-zinc-500 italic">No tags associated</span>
          )}
        </div>

        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`group flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-extrabold transition-all active:scale-95 duration-200 ${
            liked
              ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20"
              : "bg-background hover:bg-rose-500/5 text-zinc-500 hover:text-rose-500 border-zinc-200 dark:border-zinc-800 hover:border-rose-500/30"
          }`}
        >
          <Heart className={`h-4.5 w-4.5 group-hover:scale-110 transition-transform duration-200 ${liked ? "fill-white text-white" : ""}`} />
          <span>{liked ? "Liked!" : "Like this post"}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${liked ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 group-hover:bg-rose-500/10 group-hover:text-rose-500"}`}>
            {likeCount}
          </span>
        </button>
      </div>

      {/* Recommended Posts Section */}
      {recommendedBlogs.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-zinc-150 dark:border-zinc-800/80">
          <h2 className="text-2xl font-extrabold text-center text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
            {recommendedBlogs.map((b) => (
              <BlogCard
                key={b.id}
                blog={b}
                onClick={() => navigate(`/blog/${b.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Comments Section */}
      <BlogComments
        user={user}
        blogAuthorName={blog.author.username}
        comments={comments}
        commentsLoading={commentsLoading}
        newComment={newComment}
        setNewComment={setNewComment}
        submittingComment={submittingComment}
        editingCommentId={editingCommentId}
        setEditingCommentId={setEditingCommentId}
        editingContent={editingContent}
        setEditingContent={setEditingContent}
        savingCommentId={savingCommentId}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onSaveEditComment={handleSaveEditComment}
      />

    </article>
  )
}

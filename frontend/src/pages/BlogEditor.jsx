import * as React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { api } from "@/services/api"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react"

// Import modular editor components
import MarkdownToolbar from "@/components/editor/MarkdownToolbar"
import CoverImageUploader from "@/components/editor/CoverImageUploader"
import EditorTagSelector from "@/components/editor/EditorTagSelector"

export default function BlogEditor({ isModal = false, onClose, editBlogId, onSuccess }) {
  const { user, token } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = editBlogId !== undefined ? editBlogId.toString() : searchParams.get("edit")

  // Form Fields
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState("")
  const [excerpt, setExcerpt] = React.useState("")
  const [status, setStatus] = React.useState("PUBLISHED")
  const [categoryName, setCategoryName] = React.useState("")
  const [coverImageUrl, setCoverImageUrl] = React.useState(null)
  
  // Tag fields
  const [availableTags, setAvailableTags] = React.useState([])
  const [selectedTagIds, setSelectedTagIds] = React.useState([])
  const [newTagName, setNewTagName] = React.useState("")
  const [creatingTag, setCreatingTag] = React.useState(false)

  // File Upload states
  const [imageFile, setImageFile] = React.useState(null)
  const [imagePreview, setImagePreview] = React.useState(null)

  // Cloudinary inline images uploading status
  const [uploadingImages, setUploadingImages] = React.useState(false)
  const [imageUploadProgress, setImageUploadProgress] = React.useState("")

  // System states
  const [loading, setLoading] = React.useState(false)
  const [fetchingDetails, setFetchingDetails] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [editorMode, setEditorMode] = React.useState("split") // "edit" | "split" | "preview"

  const textareaRef = React.useRef(null)

  const fetchTags = React.useCallback(async () => {
    try {
      const res = await api.get("/api/tags")
      setAvailableTags(res.data || [])
    } catch (err) {
      console.error("Failed to load tags:", err)
    }
  }, [])

  const fetchBlogDetails = React.useCallback(async (id) => {
    try {
      setFetchingDetails(true)
      const res = await api.get(`/api/blogs/${id}`)
      const blog = res.data

      // Check authorization
      if (user?.role !== "ADMIN" && blog.author.id !== user?.id) {
        toast.error("You do not have permission to edit this blog post")
        navigate("/")
        return
      }

      setTitle(blog.title)
      setContent(blog.content)
      setExcerpt(blog.excerpt || "")
      setStatus(blog.status)
      setCategoryName(blog.category?.name || "")
      
      if (blog.tags) {
        setSelectedTagIds(blog.tags.map((t) => t.id))
      }

      setCoverImageUrl(blog.coverImage)
      if (blog.coverImage) {
        setImagePreview(blog.coverImage)
      }

    } catch (err) {
      setError(err.message || "Failed to load blog post details for editing")
      toast.error("Could not load article properties")
    } finally {
      setFetchingDetails(false)
    }
  }, [user, navigate, toast])

  React.useEffect(() => {
    if (!token || !user) {
      if (!isModal) {
        navigate("/auth")
      }
      return
    }

    Promise.resolve().then(() => {
      fetchTags()
      if (editId) {
        fetchBlogDetails(parseInt(editId))
      }
    })
  }, [token, user, editId, navigate, isModal, fetchTags, fetchBlogDetails])

  React.useEffect(() => {
    if (!editId) {
      Promise.resolve().then(() => {
        setTitle("")
        setContent("")
        setExcerpt("")
        setStatus("PUBLISHED")
        setCategoryName("")
        setSelectedTagIds([])
        setCoverImageUrl(null)
        setImageFile(null)
        setImagePreview(null)
      })
    }
  }, [editId])

  const handleImageChange = (file) => {
    setError(null)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, GIF, or WEBP images are allowed.")
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setCoverImageUrl(null)
  }

  const handleToggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  const handleCreateTagInline = async () => {
    const trimmed = newTagName.trim().toLowerCase().replace(/#/g, "")
    if (!trimmed) return
    
    const existing = availableTags.find(t => t.name.toLowerCase() === trimmed)
    if (existing) {
      if (!selectedTagIds.includes(existing.id)) {
        setSelectedTagIds(prev => [...prev, existing.id])
      }
      setNewTagName("")
      return
    }

    try {
      setCreatingTag(true)
      const res = await api.post("/api/tags", { name: trimmed })
      const newTag = res.data
      setAvailableTags(prev => [...prev, newTag])
      setSelectedTagIds(prev => [...prev, newTag.id])
      setNewTagName("")
      toast.success(`Tag #${newTag.name} created and added!`)
    } catch (err) {
      toast.error(err.message || "Failed to create new tag")
    } finally {
      setCreatingTag(false)
    }
  }

  const handlePostImagesUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return
    const files = Array.from(e.target.files)

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    const invalidFile = files.find(file => !allowedTypes.includes(file.type))
    if (invalidFile) {
      toast.error("Only JPEG, PNG, GIF, or WEBP images are allowed.")
      return
    }

    const textarea = textareaRef.current
    const savedStart = textarea ? textarea.selectionStart : null
    const savedEnd = textarea ? textarea.selectionEnd : null

    try {
      setUploadingImages(true)
      setImageUploadProgress(`Uploading ${files.length} image(s)...`)

      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      const res = await api.post("/api/files/upload-multiple", formData)
      const uploaded = res.data || []
      
      if (uploaded.length > 0) {
        let insertText = ""
        uploaded.forEach((img) => {
          insertText += `![${img.fileName}](${img.fileUrl})\n`
        })
        if (textarea && savedStart !== null) {
          textarea.setSelectionRange(savedStart, savedEnd)
          textarea.focus()
        }
        insertAtCursor(insertText)
        toast.success(`Inserted ${uploaded.length} image(s) at cursor position`)
      }
    } catch (err) {
      toast.error(err.message || "Failed to upload images")
      console.error(err)
    } finally {
      setUploadingImages(false)
      setImageUploadProgress("")
      e.target.value = ""
    }
  }

  const insertAtCursor = (beforeText, afterText = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value

    const selectedText = text.substring(start, end)
    const replacement = beforeText + selectedText + afterText

    const newContent = text.substring(0, start) + replacement + text.substring(end)
    setContent(newContent)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + beforeText.length + selectedText.length + afterText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 50)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!title.trim()) {
      setError("Blog title is required")
      toast.error("Blog title is required")
      setLoading(false)
      return
    }
    if (!content.trim()) {
      setError("Blog content is required")
      toast.error("Blog content is required")
      setLoading(false)
      return
    }
    if (!categoryName.trim()) {
      setError("Category name is required")
      toast.error("Category name is required")
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("content", content.trim())
      formData.append("excerpt", excerpt.trim())
      formData.append("status", status)
      formData.append("categoryName", categoryName.trim())
      
      if (selectedTagIds.length > 0) {
        selectedTagIds.forEach((id) => {
          formData.append("tagIds", id.toString())
        })
      }

      if (imageFile) {
        formData.append("imageFile", imageFile)
      } else if (coverImageUrl) {
        formData.append("coverImage", coverImageUrl)
      }

      if (editId) {
        await api.put(`/api/blogs/${editId}`, formData)
        toast.success("Blog post saved successfully!")
        
        window.dispatchEvent(new CustomEvent("blog-saved", { detail: { blogId: parseInt(editId) } }))
        
        if (isModal) {
          onSuccess?.(parseInt(editId))
          onClose?.()
        } else {
          navigate(`/blog/${editId}`)
        }
      } else {
        const res = await api.post("/api/blogs", formData)
        toast.success("Blog post published successfully!")
        if (isModal) {
          onSuccess?.(res.data.id)
          onClose?.()
        } else {
          navigate(`/blog/${res.data.id}`)
        }
      }
    } catch (err) {
      setError(err.message || "Failed to save blog post. Please try again.")
      toast.error(err.message || "Failed to publish blog post.")
    } finally {
      setLoading(false)
    }
  }

  if (fetchingDetails) {
    return (
      <div className="flex-grow flex items-center justify-center py-24 select-none animate-fade-in">
        <div className="text-center flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium">Fetching article properties...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={isModal ? "w-full space-y-6 animate-fade-in select-none" : "max-w-4xl mx-auto space-y-6 animate-fade-in select-none"}>
      
      {/* Editor Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4 ${isModal ? 'pr-12' : ''}`}>
        <div className="flex items-center gap-2">
          {!isModal && (
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-muted shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {editId ? "Edit Blog Post" : "Write a New Article"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {editId ? "Modify and republish your draft." : "Draft and post content for the development community."}
            </p>
          </div>
        </div>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 shadow-none rounded-3xl bg-white dark:bg-zinc-950 p-2">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium animate-fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="post-title" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Article Title</Label>
              <Input
                id="post-title"
                type="text"
                placeholder="Give your article a clear, descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                className="rounded-xl border-zinc-200/80 dark:border-zinc-800"
              />
            </div>

            {/* Category & Status Selection Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="post-category" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Category</Label>
                <Input
                  id="post-category"
                  type="text"
                  placeholder="Topic area — Spring Boot, System Design, Career..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  disabled={loading}
                  className="rounded-xl border-zinc-200/80 dark:border-zinc-800"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="post-status" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Post Visibility</Label>
                <select
                  id="post-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={loading}
                  className="flex h-9 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                >
                  <option value="PUBLISHED" className="dark:bg-zinc-900">PUBLISHED (Visible to feed)</option>
                  <option value="DRAFT" className="dark:bg-zinc-900">DRAFT (Author only)</option>
                </select>
              </div>
            </div>

            {/* Tags Selector */}
            <EditorTagSelector
              availableTags={availableTags}
              selectedTagIds={selectedTagIds}
              onToggleTag={handleToggleTag}
              newTagName={newTagName}
              setNewTagName={setNewTagName}
              onAddTag={handleCreateTagInline}
              creatingTag={creatingTag}
              loading={loading}
            />

            {/* Excerpt */}
            <div className="space-y-1.5">
              <Label htmlFor="post-excerpt" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Short Summary / Excerpt</Label>
              <Input
                id="post-excerpt"
                type="text"
                placeholder="A concise summary shown on the feed — hook the reader in one sentence"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                disabled={loading}
                maxLength={500}
                className="rounded-xl border-zinc-200/80 dark:border-zinc-800"
              />
            </div>

            {/* Cover Image Upload Area */}
            <CoverImageUploader
              imagePreview={imagePreview}
              onRemoveImage={handleRemoveImage}
              onImageChange={handleImageChange}
              loading={loading}
            />

            {/* Markdown Editor Workspace */}
            <div className="space-y-2">
              <Label htmlFor="post-content" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Blog Body Content (Markdown Supported)</Label>
              
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
                {/* Formatting Toolbar */}
                <MarkdownToolbar
                  editorMode={editorMode}
                  setEditorMode={setEditorMode}
                  onInsertAtCursor={insertAtCursor}
                  onPostImagesUpload={handlePostImagesUpload}
                  uploadingImages={uploadingImages}
                  imageUploadProgress={imageUploadProgress}
                />

                {/* Split Pane / Textarea Workspace */}
                <div className={`grid gap-0 divide-x divide-border ${
                  editorMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                }`}>
                  {/* Left/Edit pane */}
                  {(editorMode === "edit" || editorMode === "split") && (
                    <div className="p-0 animate-fade-in">
                      <Textarea
                        id="post-content"
                        ref={textareaRef}
                        placeholder="Start writing your article here. Markdown is fully supported — use # for headings, **bold**, *italic*, ``` for code blocks, and the toolbar above for quick formatting."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={loading}
                        rows={16}
                        className="w-full resize-none border-0 focus-visible:ring-0 rounded-none rounded-b-lg font-mono p-4 text-[12px] leading-relaxed min-h-[350px] bg-background"
                      />
                    </div>
                  )}

                  {/* Right/Preview pane */}
                  {(editorMode === "preview" || editorMode === "split") && (
                    <div className={`p-4 bg-muted/5 overflow-y-auto max-h-[500px] min-h-[350px] select-text animate-fade-in ${
                      editorMode === "preview" ? "rounded-b-lg" : ""
                    }`}>
                      {content ? (
                        <MarkdownRenderer content={content} />
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No content written yet. Start typing to see it live here...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </CardContent>

          <CardFooter className="flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800/60 pt-4 select-none">
            <Button
              type="button"
              variant="outline"
              onClick={() => isModal ? onClose?.() : navigate(-1)}
              disabled={loading}
              className="rounded-xl border-zinc-200 dark:border-zinc-800"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{editId ? "Save Post" : "Publish Post"}</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

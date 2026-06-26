import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { useConfirm } from "@/context/ConfirmContext"
import { api } from "@/services/api"
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Loader2, Trash2, Edit3, FolderClosed, Tag as TagIcon, LayoutGrid } from "lucide-react"
import LogoBug from "../components/LogoBug"

// Import modular dialog components
import CategoryDialog from "@/components/categories/CategoryDialog"
import TagDialog from "@/components/categories/TagDialog"

export default function Categories() {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const confirm = useConfirm()
  
  const [activeTab, setActiveTab] = React.useState("categories")
  
  // Categories states
  const [categories, setCategories] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [actionLoading, setActionLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  
  // Categories Dialog State
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState("create")
  const [selectedCategory, setSelectedCategory] = React.useState(null)
  
  // Tags States
  const [tags, setTags] = React.useState([])
  const [tagsLoading, setTagsLoading] = React.useState(false)

  // Tag Dialog States
  const [tagDialogOpen, setTagDialogOpen] = React.useState(false)
  const [tagDialogMode, setTagDialogMode] = React.useState("create")
  const [selectedTag, setSelectedTag] = React.useState(null)

  const fetchCategories = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/categories")
      setCategories(res.data)
    } catch (err) {
      setError(err.message || "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTags = React.useCallback(async () => {
    try {
      setTagsLoading(true)
      const res = await api.get("/api/tags")
      setTags(res.data || [])
    } catch (err) {
      console.error("Failed to load tags:", err)
    } finally {
      setTagsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    Promise.resolve().then(() => {
      fetchCategories()
      fetchTags()
    })
  }, [fetchCategories, fetchTags])

  const handleOpenCreate = () => {
    setDialogMode("create")
    setSelectedCategory(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (category, e) => {
    e.stopPropagation()
    setDialogMode("edit")
    setSelectedCategory(category)
    setDialogOpen(true)
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    const confirmed = await confirm({
      title: "Delete Category",
      message: "Are you sure you want to delete this category? This might affect blog posts under it.",
      confirmText: "Delete"
    })
    if (!confirmed) return

    try {
      setActionLoading(true)
      await api.delete(`/api/categories/${id}`)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast.success("Category deleted successfully!")
    } catch (err) {
      toast.error(err.message || "Failed to delete category")
    } finally {
      setActionLoading(false)
    }
  }

  const handleSaveCategory = async ({ name, description }) => {
    setActionLoading(true)
    try {
      if (dialogMode === "create") {
        const res = await api.post("/api/categories", { name, description })
        setCategories((prev) => [...prev, res.data])
        toast.success("Category created successfully!")
      } else if (dialogMode === "edit" && selectedCategory) {
        const res = await api.put(`/api/categories/${selectedCategory.id}`, { name, description })
        setCategories((prev) => prev.map((c) => (c.id === selectedCategory.id ? res.data : c)))
        toast.success("Category updated successfully!")
      }
    } catch (err) {
      toast.error(err.message || "Failed to save category.")
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const handleCategoryClick = (id) => {
    navigate(`/?category=${id}`)
  }

  // Tag Handlers
  const handleOpenCreateTag = () => {
    setTagDialogMode("create")
    setSelectedTag(null)
    setTagDialogOpen(true)
  }

  const handleOpenEditTag = (tag, e) => {
    e.stopPropagation()
    setTagDialogMode("edit")
    setSelectedTag(tag)
    setTagDialogOpen(true)
  }

  const handleDeleteTag = async (tagId, e) => {
    e.stopPropagation()
    const confirmed = await confirm({
      title: "Delete Tag",
      message: "Are you sure you want to delete this tag? This might affect blog posts using it.",
      confirmText: "Delete"
    })
    if (!confirmed) return

    try {
      setActionLoading(true)
      await api.delete(`/api/tags/${tagId}`)
      setTags((prev) => prev.filter((t) => t.id !== tagId))
      toast.success("Tag deleted successfully!")
    } catch (err) {
      toast.error(err.message || "Failed to delete tag")
    } finally {
      setActionLoading(false)
    }
  }

  const handleSaveTag = async (tagName) => {
    setActionLoading(true)
    try {
      if (tagDialogMode === "create") {
        const res = await api.post("/api/tags", { name: tagName })
        setTags((prev) => [...prev, res.data])
        toast.success("Tag created successfully!")
      } else if (tagDialogMode === "edit" && selectedTag) {
        const res = await api.put(`/api/tags/${selectedTag.id}`, { name: tagName })
        setTags((prev) => prev.map((t) => (t.id === selectedTag.id ? res.data : t)))
        toast.success("Tag updated successfully!")
      }
    } catch (err) {
      toast.error(err.message || "Failed to save tag.")
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in select-none">
      
      {/* Dynamic Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Taxonomy Glossary</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover blog posts organized by technical tags, development categories, and frameworks.
          </p>
        </div>
        {user && (
          <div className="flex items-center gap-2 shrink-0">
            {activeTab === "categories" ? (
              <Button onClick={handleOpenCreate} className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold">
                <PlusCircle className="h-4 w-4" />
                <span>New Category</span>
              </Button>
            ) : (
              <Button onClick={handleOpenCreateTag} className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold">
                <TagIcon className="h-4 w-4" />
                <span>New Tag</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-border/60 pb-0 w-full justify-start items-center gap-6">
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 text-sm font-extrabold tracking-tight transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "categories"
              ? "border-rose-600 text-foreground font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Categories ({categories.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("tags")}
          className={`pb-3 text-sm font-extrabold tracking-tight transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "tags"
              ? "border-rose-600 text-foreground font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <TagIcon className="h-4 w-4" />
          <span>Tags ({tags.length})</span>
        </button>
      </div>

      {/* Categories View */}
      {activeTab === "categories" && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-muted/10 p-6">
              <FolderClosed className="h-12 w-12 text-muted-foreground/60 mb-2" />
              <h3 className="text-lg font-semibold">No Categories Found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-sm">
                There are currently no categories available in the application. Create one to get started!
              </p>
              {user && (
                <Button onClick={handleOpenCreate} size="sm">
                  Create First Category
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="cursor-pointer border border-zinc-200 dark:border-zinc-800/80 hover:border-rose-500 dark:hover:border-rose-500 shadow-none transition-all duration-200 p-5 rounded-2xl bg-white dark:bg-zinc-950 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-[9px] py-0 px-1.5 font-bold uppercase bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-950/50 text-rose-600 dark:text-rose-400">
                        ID: {category.id}
                      </Badge>
                      {user && (
                        <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                            onClick={(e) => handleOpenEdit(category, e)}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-full hover:bg-destructive/10"
                            onClick={(e) => handleDelete(category.id, e)}
                            disabled={actionLoading}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-foreground capitalize truncate">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[32px] leading-snug">
                        {category.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-[10px] text-muted-foreground flex items-center justify-between mt-2 select-none">
                    <span className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                      <LogoBug className="h-3.5 w-3.5" animated={true} />
                      <span>Browse Feed</span>
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Tags View */}
      {activeTab === "tags" && (
        <>
          {tagsLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-muted/10 p-6">
              <TagIcon className="h-12 w-12 text-muted-foreground/60 mb-2" />
              <h3 className="text-lg font-semibold">No Tags Found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-sm">
                There are currently no tags available in the database glossary. Create one to get started!
              </p>
              {user && (
                <Button onClick={handleOpenCreateTag} size="sm">
                  Create First Tag
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {tags.map((tag) => (
                <Card
                  key={tag.id}
                  onClick={() => navigate(`/?search=${encodeURIComponent(tag.name)}`)}
                  className="cursor-pointer border border-zinc-200 dark:border-zinc-800/80 hover:border-rose-500 dark:hover:border-rose-500 shadow-none transition-all duration-200 bg-white dark:bg-zinc-950 rounded-2xl flex flex-col justify-between"
                >
                  <CardHeader className="p-4 flex flex-row items-center justify-between gap-2">
                    <span className="font-extrabold text-sm text-foreground truncate select-text hover:text-rose-600 dark:hover:text-rose-400">
                      #{tag.name}
                    </span>
                    {user && (
                      <div className="flex items-center shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                          onClick={(e) => handleOpenEditTag(tag, e)}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-full hover:bg-destructive/10"
                          onClick={(e) => handleDeleteTag(tag.id, e)}
                          disabled={actionLoading}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modular Category Creation/Editing Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        dialogMode={dialogMode}
        category={selectedCategory}
        actionLoading={actionLoading}
        onSave={handleSaveCategory}
      />

      {/* Modular Tag Creation/Editing Dialog */}
      <TagDialog
        open={tagDialogOpen}
        onOpenChange={setTagDialogOpen}
        tagDialogMode={tagDialogMode}
        tag={selectedTag}
        actionLoading={actionLoading}
        onSave={handleSaveTag}
      />
    </div>
  )
}

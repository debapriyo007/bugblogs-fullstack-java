import * as React from "react"
import { Tag, FolderOpen, Pencil, Plus, Trash2, X, Filter } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { useConfirm } from "@/context/ConfirmContext"
import { api } from "@/services/api"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function TopicBrowseSection({
  categories = [],
  tags = [],
  categoryIdVal = "",
  searchVal = "",
  handleSelectCategory,
  handleSelectTag,
  handleClearFilters,
  onRefreshCategories,
  onRefreshTags,
}) {
  const { user } = useAuth()
  const toast = useToast()
  const confirm = useConfirm()

  // Filter display states (all, categories, tags)
  const [displayFilter, setDisplayFilter] = React.useState("all")

  // Panel states
  const [showManagePanel, setShowManagePanel] = React.useState(false)
  const [managePanelTab, setManagePanelTab] = React.useState("categories")
  const [newCategoryName, setNewCategoryName] = React.useState("")
  const [newTagName, setNewTagName] = React.useState("")
  const [savingCategory, setSavingCategory] = React.useState(false)
  const [savingTag, setSavingTag] = React.useState(false)

  // Show all states
  const [showAllCategories, setShowAllCategories] = React.useState(false)
  const [showAllTags, setShowAllTags] = React.useState(false)

  const visibleCategories = showAllCategories ? (categories || []) : (categories || []).slice(0, 8)
  const visibleTags = showAllTags ? (tags || []) : (tags || []).slice(0, 12)

  // Add Category Handler
  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    setSavingCategory(true)
    try {
      await api.post("/api/categories", { name: newCategoryName.trim() })
      toast.success(`Category "${newCategoryName.trim()}" created!`)
      setNewCategoryName("")
      if (onRefreshCategories) onRefreshCategories()
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create category")
    } finally {
      setSavingCategory(false)
    }
  }

  // Delete Category Handler
  const handleDeleteCategory = async (id, name) => {
    const confirmed = await confirm({
      title: "Delete Category",
      message: `Are you sure you want to delete category "${name}"?`,
      confirmText: "Delete"
    })
    if (!confirmed) return
    try {
      await api.delete(`/api/categories/${id}`)
      toast.success(`Category "${name}" deleted.`)
      if (onRefreshCategories) onRefreshCategories()
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete category")
    }
  }

  // Add Tag Handler
  const handleAddTag = async (e) => {
    e.preventDefault()
    if (!newTagName.trim()) return
    setSavingTag(true)
    try {
      await api.post("/api/tags", { name: newTagName.trim() })
      toast.success(`Tag "${newTagName.trim()}" created!`)
      setNewTagName("")
      if (onRefreshTags) onRefreshTags()
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create tag")
    } finally {
      setSavingTag(false)
    }
  }

  // Delete Tag Handler
  const handleDeleteTag = async (id, name) => {
    const confirmed = await confirm({
      title: "Delete Tag",
      message: `Are you sure you want to delete tag "${name}"?`,
      confirmText: "Delete"
    })
    if (!confirmed) return
    try {
      await api.delete(`/api/tags/${id}`)
      toast.success(`Tag "${name}" deleted.`)
      if (onRefreshTags) onRefreshTags()
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete tag")
    }
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2
            className="text-xl font-bold text-zinc-900 dark:text-zinc-100"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Browse by Topic
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            Filter articles by category or tag
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 transition-colors h-8 select-none">
                <Filter className="h-3.5 w-3.5" />
                <span className="capitalize">
                  Show: {displayFilter === "all" ? "All" : displayFilter === "categories" ? "Categories" : "Tags"}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right" className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xl w-40 rounded-xl p-1 animate-zoom-in">
              <DropdownMenuItem
                onClick={() => setDisplayFilter("all")}
                className={`flex items-center justify-between text-xs font-bold rounded-lg px-2.5 py-1.5 cursor-pointer ${
                  displayFilter === "all"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                All Topics
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDisplayFilter("categories")}
                className={`flex items-center justify-between text-xs font-bold rounded-lg px-2.5 py-1.5 cursor-pointer ${
                  displayFilter === "categories"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                Categories
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDisplayFilter("tags")}
                className={`flex items-center justify-between text-xs font-bold rounded-lg px-2.5 py-1.5 cursor-pointer ${
                  displayFilter === "tags"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                Tags
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user && (
            <button
              onClick={() => setShowManagePanel(!showManagePanel)}
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 transition-colors h-8"
            >
              <Pencil className="h-3 w-3" />
              Manage
            </button>
          )}
        </div>
      </div>

      {/* Manage Panel — logged-in only */}
      {user && showManagePanel && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-4 space-y-4 animate-fade-in">
          <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-700 pb-3">
            <button
              onClick={() => setManagePanelTab("categories")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                managePanelTab === "categories" ? "bg-rose-600 text-white" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              <FolderOpen className="h-3 w-3" />
              Categories
            </button>
            <button
              onClick={() => setManagePanelTab("tags")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                managePanelTab === "tags" ? "bg-rose-600 text-white" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              <Tag className="h-3 w-3" />
              Tags
            </button>
            <button onClick={() => setShowManagePanel(false)} className="ml-auto text-zinc-400 hover:text-zinc-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          {managePanelTab === "categories" && (
            <div className="space-y-3">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name..."
                  className="flex-1 h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <button
                  type="submit"
                  disabled={savingCategory || !newCategoryName.trim()}
                  className="flex items-center gap-1 px-3 h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                {(categories || []).length === 0 && <p className="text-xs text-zinc-400">No categories yet.</p>}
                {(categories || []).map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    <span>{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="text-zinc-400 hover:text-rose-500">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {managePanelTab === "tags" && (
            <div className="space-y-3">
              <form onSubmit={handleAddTag} className="flex gap-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="New tag name..."
                  className="flex-1 h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <button
                  type="submit"
                  disabled={savingTag || !newTagName.trim()}
                  className="flex items-center gap-1 px-3 h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                {(tags || []).length === 0 && <p className="text-xs text-zinc-400">No tags yet.</p>}
                {(tags || []).map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    <Tag className="h-2.5 w-2.5 text-zinc-400" />
                    <span>{tag.name}</span>
                    <button onClick={() => handleDeleteTag(tag.id, tag.name)} className="text-zinc-400 hover:text-rose-500">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Pills */}
      {(displayFilter === "all" || displayFilter === "categories") && (
        <div className="flex flex-wrap gap-2 items-center w-full select-none animate-fade-in">
          <button
            onClick={handleClearFilters}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              !categoryIdVal && !searchVal
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-transparent border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-rose-300 hover:text-rose-600"
            }`}
          >
            All
          </button>
          {visibleCategories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
                categoryIdVal === cat.id.toString()
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-transparent border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-rose-300 hover:text-rose-600"
              } ${!showAllCategories && idx >= 5 ? "hidden md:inline-flex" : "inline-flex"}`}
            >
              {cat.name}
            </button>
          ))}
          {(categories || []).length > 5 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className={`text-xs font-bold text-rose-500 hover:text-rose-600 px-3 py-1.5 transition-colors underline underline-offset-2 ${
                (categories || []).length <= 8 ? "md:hidden" : ""
              }`}
            >
              {showAllCategories ? (
                "Show Less"
              ) : (
                <>
                  <span className="md:hidden">+{(categories || []).length - 5} More</span>
                  <span className="hidden md:inline">+{(categories || []).length - 8} More</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Tag Cloud */}
      {(displayFilter === "all" || displayFilter === "tags") && (tags || []).length > 0 && (
        <div className="flex flex-wrap gap-2 items-center w-full select-none animate-fade-in">
          {visibleTags.map((tag, idx) => (
            <button
              key={tag.id}
              onClick={() => handleSelectTag(tag.name)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-rose-300 hover:text-rose-600 dark:hover:text-rose-400 transition-all bg-zinc-50 dark:bg-zinc-900/50 ${
                !showAllTags && idx >= 5 ? "hidden md:flex" : "flex"
              }`}
            >
              <Tag className="h-2.5 w-2.5" />
              {tag.name}
            </button>
          ))}
          {(tags || []).length > 5 && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className={`text-xs font-bold text-rose-500 hover:text-rose-600 px-3 py-1.5 transition-colors underline underline-offset-2 ${
                (tags || []).length <= 12 ? "md:hidden" : ""
              }`}
            >
              {showAllTags ? (
                "Show Less"
              ) : (
                <>
                  <span className="md:hidden">+{(tags || []).length - 5} More</span>
                  <span className="hidden md:inline">+{(tags || []).length - 12} More</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

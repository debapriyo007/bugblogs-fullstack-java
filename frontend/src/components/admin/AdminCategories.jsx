import * as React from "react"
import { Plus, Edit3, Trash2, Loader2, AlertCircle, Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function AdminCategories({
  categories,
  categoriesLoading,
  actionLoading,
  onDeleteCategory,
  onSaveCategory
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState("create")
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(null)
  const [categoryName, setCategoryName] = React.useState("")
  const [categoryDesc, setCategoryDesc] = React.useState("")
  const [categoryError, setCategoryError] = React.useState(null)

  const [searchTerm, setSearchTerm] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(0)
  const itemsPerPage = 10

  const filteredCategories = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return categories
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(term) ||
        (cat.description && cat.description.toLowerCase().includes(term))
    )
  }, [categories, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage))

  React.useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0)
    }
  }, [filteredCategories, totalPages, currentPage])

  const paginatedCategories = React.useMemo(() => {
    const startIndex = currentPage * itemsPerPage
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredCategories, currentPage, itemsPerPage])

  const handleOpenCreate = () => {
    setDialogMode("create")
    setSelectedCategoryId(null)
    setCategoryName("")
    setCategoryDesc("")
    setCategoryError(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (cat) => {
    setDialogMode("edit")
    setSelectedCategoryId(cat.id)
    setCategoryName(cat.name)
    setCategoryDesc(cat.description || "")
    setCategoryError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCategoryError(null)
    if (!categoryName.trim()) {
      setCategoryError("Category name is required")
      return
    }

    try {
      await onSaveCategory(dialogMode, selectedCategoryId, {
        name: categoryName.trim(),
        description: categoryDesc.trim()
      })
      setDialogOpen(false)
    } catch (err) {
      setCategoryError(err.message || "An error occurred during category operation")
    }
  }

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-none rounded-3xl bg-white dark:bg-zinc-950 p-2">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
        <div className="md:min-w-[200px]">
          <CardTitle className="text-base font-sans font-extrabold text-zinc-900 dark:text-zinc-50">Categories</CardTitle>
          <CardDescription className="text-xs">Create or manage blog categorization nodes.</CardDescription>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 flex-grow justify-center max-w-md mx-auto w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(0)
              }}
              className="pl-9 pr-8 py-1.5 w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all text-foreground font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("")
                  setCurrentPage(0)
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </form>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="h-8 text-xs font-bold rounded-xl flex items-center gap-1 px-3 bg-rose-600 hover:bg-rose-700 text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Category</span>
          </Button>
          <div className="h-8 px-3 text-xs font-bold text-muted-foreground bg-muted border border-zinc-200 dark:border-zinc-800/80 rounded-xl flex items-center justify-center min-w-[100px]">
            Page {currentPage + 1} of {totalPages}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {categoriesLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <h3 className="text-sm font-semibold text-muted-foreground">No Categories Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {paginatedCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm min-h-[140px]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground capitalize">{cat.name}</span>
                      <span className="text-[9px] font-mono font-bold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">
                        #{cat.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(cat)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={actionLoading}
                        onClick={() => onDeleteCategory(cat.id, cat.name)}
                        className="h-7 w-7 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                    {cat.description || "No description provided."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!categoriesLoading && totalPages >= 1 && (
          <div className="flex items-center justify-between border-t border-border/40 p-3">
            <span className="text-[10px] text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 0 || actionLoading}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="h-7 px-2 text-xs gap-1"
              >
                <ChevronLeft className="h-3 w-3" />
                <span>Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages - 1 || actionLoading}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="h-7 px-2 text-xs gap-1"
              >
                <span>Next</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Category Creation / Edit Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Create New Category" : "Edit Category"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {dialogMode === "create"
                ? "Add a new categorization node so that authors can file posts correctly."
                : "Modify the category details. This will update live across all posts using it."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {categoryError && (
              <div className="flex items-center gap-2 p-2.5 text-xs rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 font-medium animate-fade-in">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{categoryError}</span>
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="category-name" className="text-xs font-semibold text-foreground">Category Name</Label>
              <Input
                id="category-name"
                type="text"
                placeholder="Name for this topic area"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                disabled={actionLoading}
                className="h-9 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-rose-500 focus-visible:border-rose-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="category-description" className="text-xs font-semibold text-foreground">Description</Label>
              <Textarea
                id="category-description"
                placeholder="Describe the types of articles that belong in this category"
                value={categoryDesc}
                onChange={(e) => setCategoryDesc(e.target.value)}
                disabled={actionLoading}
                className="text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-rose-500 focus-visible:border-rose-500 transition-all"
                rows={3}
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={actionLoading}
                className="h-9 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className="h-9 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 px-4"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{dialogMode === "create" ? "Create Category" : "Save Changes"}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

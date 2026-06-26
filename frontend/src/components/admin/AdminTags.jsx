import * as React from "react"
import { Plus, Edit3, Trash2, Loader2, AlertCircle, Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function AdminTags({
  tags,
  tagsLoading,
  actionLoading,
  onDeleteTag,
  onSaveTag
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState("create")
  const [selectedTagId, setSelectedTagId] = React.useState(null)
  const [tagName, setTagName] = React.useState("")
  const [tagError, setTagError] = React.useState(null)

  const [searchTerm, setSearchTerm] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(0)
  const itemsPerPage = 10

  const filteredTags = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return tags
    return tags.filter((tag) => tag.name.toLowerCase().includes(term))
  }, [tags, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredTags.length / itemsPerPage))

  React.useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0)
    }
  }, [filteredTags, totalPages, currentPage])

  const paginatedTags = React.useMemo(() => {
    const startIndex = currentPage * itemsPerPage
    return filteredTags.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredTags, currentPage, itemsPerPage])

  const handleOpenCreate = () => {
    setDialogMode("create")
    setSelectedTagId(null)
    setTagName("")
    setTagError(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (tag) => {
    setDialogMode("edit")
    setSelectedTagId(tag.id)
    setTagName(tag.name)
    setTagError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTagError(null)
    if (!tagName.trim()) {
      setTagError("Tag name is required")
      return
    }

    try {
      await onSaveTag(dialogMode, selectedTagId, tagName.trim())
      setDialogOpen(false)
    } catch (err) {
      setTagError(err.message || "An error occurred during tag operation")
    }
  }

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-none rounded-3xl bg-white dark:bg-zinc-950 p-2">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
        <div className="md:min-w-[200px]">
          <CardTitle className="text-base font-sans font-extrabold text-zinc-900 dark:text-zinc-50">Tags</CardTitle>
          <CardDescription className="text-xs">Create or manage taxonomy tag badges.</CardDescription>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 flex-grow justify-center max-w-md mx-auto w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tags..."
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
            <span>New Tag</span>
          </Button>
          <div className="h-8 px-3 text-xs font-bold text-muted-foreground bg-muted border border-zinc-200 dark:border-zinc-800/80 rounded-xl flex items-center justify-center min-w-[100px]">
            Page {currentPage + 1} of {totalPages}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {tagsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <h3 className="text-sm font-semibold text-muted-foreground">No Tags Found</h3>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5 p-4 justify-start">
            {paginatedTags.map((tag) => (
              <div
                key={tag.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 group hover:border-rose-500/50 hover:bg-rose-50/10 transition-all shadow-sm"
              >
                <span>#{tag.name}</span>
                <span className="text-[8px] opacity-40 font-bold">({tag.id})</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 ml-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(tag)}
                    className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-zinc-250 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => onDeleteTag(tag.id, tag.name)}
                    className="p-0.5 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!tagsLoading && totalPages >= 1 && (
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

      {/* Tag Creation / Edit Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Create New Tag" : "Edit Tag"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {dialogMode === "create"
                ? "Add a tag badge to group specific frameworks or subtopics."
                : "Modify the tag name badge. Live posts using this tag will sync automatically."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {tagError && (
              <div className="flex items-center gap-2 p-2.5 text-xs rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 font-medium animate-fade-in">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{tagError}</span>
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="tag-name" className="text-xs font-semibold text-foreground">Tag Name</Label>
              <Input
                id="tag-name"
                type="text"
                placeholder="Lowercase tag slug (no spaces)"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                disabled={actionLoading}
                className="h-9 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-rose-500 focus-visible:border-rose-500 transition-all"
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
                  <span>{dialogMode === "create" ? "Create Tag" : "Save Changes"}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

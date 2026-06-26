import * as React from "react"
import { Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function CoverImageUploader({
  imagePreview,
  onRemoveImage,
  onImageChange,
  loading
}) {
  const [isDragOver, setIsDragOver] = React.useState(false)

  const handleFileDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageChange(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Cover Image Banner</Label>
      
      {imagePreview ? (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-none group">
          <img src={imagePreview} alt="Cover Preview" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onRemoveImage}
              className="flex items-center gap-1 shrink-0 rounded-xl"
            >
              <Trash2 className="h-4 w-4" />
              <span>Remove Banner</span>
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? "border-rose-500 bg-rose-500/10 scale-[0.99]"
              : "border-zinc-200 dark:border-zinc-800 hover:border-rose-500 dark:hover:border-rose-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
          }`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && onImageChange(e.target.files[0])}
            disabled={loading}
          />
          <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-sm">Upload Cover Image</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Drag and drop your banner here, or click to browse. Max size 5MB (JPG, PNG, GIF, WEBP).
          </p>
        </div>
      )}
    </div>
  )
}

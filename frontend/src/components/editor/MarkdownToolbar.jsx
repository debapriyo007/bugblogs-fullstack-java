import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Terminal,
  Image,
  Link as LinkIcon,
  Quote
} from "lucide-react"

export default function MarkdownToolbar({
  editorMode,
  setEditorMode,
  onInsertAtCursor,
  onPostImagesUpload,
  uploadingImages,
  imageUploadProgress
}) {
  return (
    <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/20 flex-wrap select-none">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onInsertAtCursor("# ")}
        title="Heading 1"
        className="h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-muted animate-fade-in"
      >
        <span className="font-extrabold text-xs">H1</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onInsertAtCursor("## ")}
        title="Heading 2"
        className="h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-muted animate-fade-in"
      >
        <span className="font-bold text-xs">H2</span>
      </Button>
      <div className="w-[1px] h-4 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onInsertAtCursor("**", "**")}
        title="Bold"
        className="h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-muted animate-fade-in"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onInsertAtCursor("*", "*")}
        title="Italic"
        className="h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-muted animate-fade-in"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <div className="w-[1px] h-4 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onInsertAtCursor("- ")}
        title="Bullet List"
        className="h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-muted animate-fade-in"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onInsertAtCursor("1. ")}
        title="Numbered List"
        className="h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-muted animate-fade-in"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <div className="w-[1px] h-4 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onInsertAtCursor("`", "`")}
        title="Inline Code"
        className="h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-muted animate-fade-in"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onInsertAtCursor("```javascript\n", "\n```")}
        title="Code Block"
        className="h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-muted animate-fade-in"
      >
        <Terminal className="h-4 w-4" />
      </Button>
      <div className="w-[1px] h-4 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => document.getElementById("post-images-input")?.click()}
        title="Upload Inline Image"
        className="h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-muted animate-fade-in"
      >
        <Image className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onInsertAtCursor("[Link Text](", ")")}
        title="Insert Link"
        className="h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-muted animate-fade-in"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onInsertAtCursor("> ")}
        title="Blockquote"
        className="h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-muted animate-fade-in"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <input
        id="post-images-input"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={onPostImagesUpload}
        disabled={uploadingImages}
      />

      {uploadingImages && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-2.5 py-1 rounded border border-border/60 animate-pulse mr-2 select-none ml-2">
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
          <span>{imageUploadProgress}</span>
        </div>
      )}

      {/* Editor Layout mode tabs */}
      <div className="ml-auto flex items-center gap-1 bg-muted/40 p-0.5 rounded-md border border-border">
        <button
          type="button"
          onClick={() => setEditorMode("edit")}
          className={`text-[10px] font-bold px-2.5 py-1 rounded transition-all duration-200 ${
            editorMode === "edit"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setEditorMode("split")}
          className={`text-[10px] font-bold px-2.5 py-1 rounded transition-all duration-200 ${
            editorMode === "split"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Split
        </button>
        <button
          type="button"
          onClick={() => setEditorMode("preview")}
          className={`text-[10px] font-bold px-2.5 py-1 rounded transition-all duration-200 ${
            editorMode === "preview"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Preview
        </button>
      </div>
    </div>
  )
}

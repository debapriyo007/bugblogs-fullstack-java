import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Search, Loader2, TrendingUp, FolderOpen, Tag, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { api } from "@/services/api"

export default function BlogSearchFilters({
  searchField,
  setSearchField,
  handleSearchSubmit,
  handleSelectCategory,
  categories,
  tags = [],
  handleSelectTag,
}) {
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = React.useState([])
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const dropdownRef = React.useRef(null)
  const inputRef = React.useRef(null)

  const trimmedQuery = searchField.trim().toLowerCase()

  // Match categories locally
  const matchingCategories = React.useMemo(() => {
    if (trimmedQuery.length < 2) return []
    return (categories || []).filter(c => 
      c.name.toLowerCase().includes(trimmedQuery)
    ).slice(0, 3)
  }, [categories, trimmedQuery])

  // Match tags locally
  const matchingTags = React.useMemo(() => {
    if (trimmedQuery.length < 2) return []
    return (tags || []).filter(t => 
      t.name.toLowerCase().includes(trimmedQuery)
    ).slice(0, 3)
  }, [tags, trimmedQuery])

  // Fetch suggestions with debounce
  React.useEffect(() => {
    const query = searchField.trim()
    if (query.length < 2) {
      Promise.resolve().then(() => {
        setSuggestions([])
      })
      return
    }

    Promise.resolve().then(() => {
      setLoadingSuggestions(true)
    })
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await api.get(`/api/blogs/search?keyword=${encodeURIComponent(query)}&page=0&size=5`)
        if (res && res.data && res.data.content) {
          setSuggestions(res.data.content)
        } else {
          setSuggestions([])
        }
      } catch (err) {
        console.error("Suggestions fetch failed:", err)
        setSuggestions([])
      } finally {
        setLoadingSuggestions(false)
      }
    }, 300) // 300ms debounce delay

    return () => clearTimeout(delayDebounceFn)
  }, [searchField])

  // Close suggestions when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCategoryClick = (catId) => {
    handleSelectCategory(catId)
    setSearchField("") // Clear search text when user filters by category explicitly
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  const handleTagClick = (tagName) => {
    handleSelectTag(tagName)
    setSearchField(tagName)
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  const handleArticleClick = (blogId) => {
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.blur()
    }
    navigate(`/blog/${blogId}`)
  }

  const handleSearchForQueryClick = () => {
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.blur()
    }
    handleSearchSubmit({ preventDefault: () => {} })
  }

  const onFormSubmit = (e) => {
    e.preventDefault()
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.blur()
    }
    handleSearchSubmit(e)
  }

  return (
    <div className="w-full max-w-xl mx-auto relative" ref={dropdownRef}>
      <form onSubmit={onFormSubmit} className="relative flex items-center w-full group">
        <div className="absolute left-4 text-rose-500 pointer-events-none transition-colors">
          <Search className="h-4 w-4 stroke-[2.5]" />
        </div>
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search our blogs by topic or keywords..."
          value={searchField}
          onChange={(e) => {
            setSearchField(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full h-12 pl-11 pr-10 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-rose-400 transition-all text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 shadow-sm"
        />
        {searchField && (
          <button
            type="button"
            onClick={() => {
              setSearchField("")
              setSuggestions([])
              if (inputRef.current) {
                inputRef.current.focus()
              }
            }}
            className="absolute right-4 text-zinc-400 hover:text-rose-500 transition-colors p-1"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        )}
      </form>

      {/* Auto-suggest Dropdown */}
      {showSuggestions && searchField.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-55 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden p-2 flex flex-col gap-0.5 animate-zoom-in">
          
          {/* Option: Search for exact query */}
          <div
            onClick={handleSearchForQueryClick}
            className="flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-zinc-650 dark:text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl cursor-pointer transition-colors select-none"
          >
            <Search className="h-3.5 w-3.5 text-zinc-450 shrink-0" />
            <span>Search for "<span className="font-bold">{searchField}</span>"</span>
          </div>

          {/* Categories matches */}
          {matchingCategories.length > 0 && (
            <>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-3.5 py-1.5 border-t border-zinc-100 dark:border-zinc-800/40 mt-1 first:border-0 first:mt-0 select-none">
                Categories
              </div>
              {matchingCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex items-center gap-3 px-3.5 py-2 text-xs font-bold text-zinc-750 dark:text-zinc-350 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl cursor-pointer transition-colors select-none"
                >
                  <FolderOpen className="h-3.5 w-3.5 text-zinc-455 shrink-0" />
                  <span className="capitalize">{cat.name}</span>
                </div>
              ))}
            </>
          )}

          {/* Tags matches */}
          {matchingTags.length > 0 && (
            <>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-3.5 py-1.5 border-t border-zinc-100 dark:border-zinc-800/40 mt-1 select-none">
                Tags
              </div>
              {matchingTags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => handleTagClick(tag.name)}
                  className="flex items-center gap-3 px-3.5 py-2 text-xs font-bold text-zinc-755 dark:text-zinc-355 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl cursor-pointer transition-colors select-none"
                >
                  <Tag className="h-3.5 w-3.5 text-zinc-455 shrink-0" />
                  <span className="capitalize">#{tag.name}</span>
                </div>
              ))}
            </>
          )}

          {/* Articles matches */}
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-3.5 py-1.5 border-t border-zinc-100 dark:border-zinc-800/40 mt-1 select-none">
            Suggested Articles
          </div>

          {loadingSuggestions ? (
            <div className="flex items-center justify-center py-4 text-zinc-400 gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
              <span className="text-xs font-semibold">Fetching suggestions...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((blog) => (
              <div
                key={blog.id}
                onClick={() => handleArticleClick(blog.id)}
                className="flex items-start gap-3 px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl cursor-pointer transition-colors select-none group"
              >
                <TrendingUp className="h-4 w-4 text-zinc-400 group-hover:text-rose-600 dark:group-hover:text-rose-450 shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 truncate">
                    {blog.title}
                  </span>
                  
                  {/* Small keywords / tags below the title */}
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {blog.category && (
                      <span className="text-[10px] font-extrabold text-rose-500 dark:text-rose-400 capitalize bg-rose-500/5 dark:bg-rose-400/5 px-1 py-0.2 rounded shrink-0">
                        {blog.category.name}
                      </span>
                    )}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex items-center gap-1 overflow-hidden">
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-550">&bull;</span>
                        {blog.tags.slice(0, 3).map((tag, idx) => (
                          <span key={tag.id} className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-500 capitalize truncate">
                            {tag.name}{idx < Math.min(blog.tags.length, 3) - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-zinc-400 text-xs font-medium select-none">
              No matching articles found.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

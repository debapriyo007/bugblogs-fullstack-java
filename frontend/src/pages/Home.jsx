import * as React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { api } from "@/services/api"
import BlogSearchFilters from "../components/BlogSearchFilters"
import BlogFeedGrid from "../components/BlogFeedGrid"
import HeroHeader from "../components/HeroHeader"
import TopicBrowseSection from "../components/TopicBrowseSection"
import WriteBanner from "../components/WriteBanner"
import ContactSection from "../components/ContactSection"

export default function Home() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Filter states parsed from URL query
  const searchVal = searchParams.get("search") || ""
  const categoryIdVal = searchParams.get("category") || ""
  const pageVal = searchParams.get("page") || "0"

  // React states
  const [blogs, setBlogs] = React.useState([])
  const [categories, setCategories] = React.useState([])
  const [tags, setTags] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  // Pagination details
  const currentPage = parseInt(pageVal) || 0
  const [totalPages, setTotalPages] = React.useState(1)

  // Local search
  const [searchField, setSearchField] = React.useState(searchVal)

  // Sync search input with URL param when it changes (standard React pattern)
  const [prevSearchVal, setPrevSearchVal] = React.useState(searchVal)
  if (searchVal !== prevSearchVal) {
    setPrevSearchVal(searchVal)
    setSearchField(searchVal)
  }

  const fetchCategories = React.useCallback(async () => {
    try {
      const res = await api.get("/api/categories")
      setCategories(res.data)
    } catch (err) {
      console.error("Failed to load categories:", err)
    }
  }, [])

  const fetchTags = React.useCallback(async () => {
    try {
      const res = await api.get("/api/tags")
      setTags(res.data)
    } catch (err) {
      console.error("Failed to load tags:", err)
    }
  }, [])

  const fetchBlogs = React.useCallback(async (page, search, category) => {
    try {
      setLoading(true)
      let endpoint = `/api/blogs?page=${page}&size=10&sortBy=createdAt&direction=desc`

      if (search.trim()) {
        endpoint = `/api/blogs/search?keyword=${encodeURIComponent(search.trim())}&page=${page}&size=10`
      } else if (category) {
        endpoint = `/api/blogs/category/${category}?page=${page}&size=10`
      }

      const res = await api.get(endpoint)
      if (res.data) {
        const newBlogs = res.data.content || []
        setBlogs(newBlogs)
        setTotalPages(res.data.totalPages || 1)
      }
    } catch (err) {
      console.error("Failed to load blogs:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    Promise.resolve().then(() => {
      fetchCategories()
      fetchTags()
    })
  }, [fetchCategories, fetchTags])

  React.useEffect(() => {
    Promise.resolve().then(() => {
      fetchBlogs(currentPage, searchVal, categoryIdVal)
    })
  }, [pageVal, searchVal, categoryIdVal, fetchBlogs, currentPage])

  React.useEffect(() => {
    const handleBlogSaved = () => {
      fetchBlogs(currentPage, searchVal, categoryIdVal)
      fetchCategories()
      fetchTags()
    }
    window.addEventListener("blog-saved", handleBlogSaved)
    return () => window.removeEventListener("blog-saved", handleBlogSaved)
  }, [currentPage, searchVal, categoryIdVal, fetchBlogs, fetchCategories, fetchTags])

  React.useEffect(() => {
    const scrollParam = searchParams.get("scroll")
    if (scrollParam) {
      setTimeout(() => {
        const element = document.getElementById(`${scrollParam}-section`)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
          const params = new URLSearchParams(searchParams)
          params.delete("scroll")
          setSearchParams(params, { replace: true })
        }
      }, 300)
    }
  }, [searchParams, setSearchParams])

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    setSearchParams(params)
    
    // Smoothly scroll back to the exact top of the blog grid, offsetting for the sticky header (64px + 16px padding)
    setTimeout(() => {
      const element = document.getElementById("blog-feed-section")
      if (element) {
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.scrollY - headerOffset
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        })
      }
    }, 100)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchField.trim()) params.set("search", searchField.trim())
    params.set("page", "0")
    setSearchParams(params)
  }

  const handleSelectCategory = (id) => {
    const params = new URLSearchParams()
    if (id !== null) params.set("category", id.toString())
    params.set("page", "0")
    setSearchParams(params)
  }

  const handleSelectTag = (tagName) => {
    const params = new URLSearchParams()
    params.set("search", tagName)
    params.set("page", "0")
    setSearchParams(params)
  }

  const handleClearFilters = () => {
    setSearchField("")
    setSearchParams(new URLSearchParams())
  }

  // Separate featured, top 3, remaining
  const featuredBlog = currentPage === 0 && !searchVal && !categoryIdVal && blogs.length > 0 ? blogs[0] : null
  const topThreeBlogs = featuredBlog ? blogs.slice(1, 4) : []
  const remainingBlogs = featuredBlog ? blogs.slice(4) : blogs
  const showSplitLayout = !!featuredBlog

  return (
    <div className="flex flex-col gap-16 py-8 md:py-12 animate-fade-in select-none">

      {/* ── Hero Header ──────────────────────────────────────── */}
      <HeroHeader />

      {/* ── Search Bar ───────────────────────────────────────── */}
      <BlogSearchFilters
        searchField={searchField}
        setSearchField={setSearchField}
        handleSearchSubmit={handleSearchSubmit}
        handleSelectCategory={handleSelectCategory}
        categoryIdVal={categoryIdVal}
        categories={categories}
        tags={tags}
        handleSelectTag={handleSelectTag}
      />

      {/* ── Browse by Topic ──────────────────────────────────── */}
      <TopicBrowseSection
        categories={categories}
        tags={tags}
        categoryIdVal={categoryIdVal}
        searchVal={searchVal}
        handleSelectCategory={handleSelectCategory}
        handleSelectTag={handleSelectTag}
        handleClearFilters={handleClearFilters}
        onRefreshCategories={fetchCategories}
        onRefreshTags={fetchTags}
      />

      {/* ── Active filter indicator ───────────────────────────── */}
      {searchVal ? (
        <div className="flex items-center justify-center gap-3 animate-fade-in">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Results for: <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{searchVal}"</span>
          </span>
          <button onClick={handleClearFilters} className="text-xs font-bold text-rose-500 hover:text-rose-600 underline underline-offset-2">
            Clear
          </button>
        </div>
      ) : null}

      {/* ── Blog Grid ────────────────────────────────────────── */}
      <BlogFeedGrid
        loading={loading}
        blogs={blogs}
        featuredBlog={featuredBlog}
        topThreeBlogs={topThreeBlogs}
        remainingBlogs={remainingBlogs}
        showSplitLayout={showSplitLayout}
        handleClearFilters={handleClearFilters}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        navigate={navigate}
      />

      {/* ── Write Banner ─────────────────────────────────────── */}
      <WriteBanner />

      {/* ── Contact Us Section ───────────────────────────────── */}
      <ContactSection />

    </div>
  )
}

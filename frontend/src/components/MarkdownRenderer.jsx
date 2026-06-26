import * as React from "react"
import { marked } from "marked"
import hljs from "highlight.js"

/**
 * MarkdownRenderer
 * Renders markdown content with IDE-quality code blocks:
 *  - Syntax highlighting (highlight.js)
 *  - Language badge (top-left)
 *  - Copy button (top-right) with feedback
 *  - Line numbers
 */
export default function MarkdownRenderer({ content, className = "" }) {
  const containerRef = React.useRef(null)

  // Configure marked with custom code block renderer
  const renderedHtml = React.useMemo(() => {
    const renderer = new marked.Renderer()

    renderer.code = ({ text, lang }) => {
      const language = lang && hljs.getLanguage(lang) ? lang : "plaintext"
      let highlighted
      try {
        highlighted =
          language === "plaintext"
            ? hljs.highlightAuto(text).value
            : hljs.highlight(text, { language }).value
      } catch {
        highlighted = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
      }

      // Add line numbers by wrapping each line
      const lines = highlighted.split("\n")
      // Remove trailing empty line if present
      if (lines[lines.length - 1] === "") lines.pop()

      const numberedLines = lines
        .map(
          (line, i) =>
            `<span class="code-line"><span class="line-num">${i + 1}</span><span class="line-content">${line || " "}</span></span>`
        )
        .join("")

      const langDisplay = language === "plaintext" ? "code" : language

      return `
        <div class="code-block-wrapper">
          <div class="code-block-header">
            <div class="code-block-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <span class="code-block-lang">${langDisplay}</span>
            <button class="code-copy-btn" data-code="${encodeURIComponent(text)}" title="Copy code">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Copy</span>
            </button>
          </div>
          <pre class="code-block-pre"><code class="hljs language-${language} code-block-code">${numberedLines}</code></pre>
        </div>
      `
    }

    marked.setOptions({ renderer })
    return marked.parse(content || "")
  }, [content])

  // Attach copy button event listeners after render
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleClick = async (e) => {
      const btn = e.target.closest(".code-copy-btn")
      if (!btn) return

      const encoded = btn.getAttribute("data-code")
      if (!encoded) return

      const code = decodeURIComponent(encoded)
      try {
        await navigator.clipboard.writeText(code)
        const span = btn.querySelector("span")
        const svg = btn.querySelector("svg")
        const originalSpan = span.textContent
        span.textContent = "Copied!"
        btn.classList.add("code-copy-btn--copied")
        // Swap icon to checkmark
        svg.innerHTML = `<polyline points="20 6 9 17 4 12"/>`
        setTimeout(() => {
          span.textContent = originalSpan
          btn.classList.remove("code-copy-btn--copied")
          svg.innerHTML = `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>`
        }, 2000)
      } catch {
        // Fallback for browsers without clipboard API
        const ta = document.createElement("textarea")
        ta.value = code
        ta.style.position = "fixed"
        ta.style.opacity = "0"
        document.body.appendChild(ta)
        ta.select()
        document.execCommand("copy")
        document.body.removeChild(ta)
      }
    }

    container.addEventListener("click", handleClick)
    return () => container.removeEventListener("click", handleClick)
  }, [renderedHtml])

  return (
    <div
      ref={containerRef}
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  )
}

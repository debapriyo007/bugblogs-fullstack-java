const BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

async function request(url, options = {}) {
  const targetUrl = url.startsWith("/api") && !url.startsWith("http")
    ? `${BASE_URL}${url}`
    : url

  const headers = new Headers(options.headers || {})

  // Only set Content-Type to application/json if we are NOT sending FormData
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  // Inject Bearer token from localStorage if available
  const savedUser = localStorage.getItem("user")
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser)
      if (parsed && parsed.token) {
        headers.set("Authorization", `Bearer ${parsed.token}`)
      }
    } catch (e) {
      console.error("Error parsing user token from localStorage:", e)
    }
  }

  const response = await fetch(targetUrl, {
    ...options,
    headers,
    credentials: "include",
  })

  // Handle unauthorized/session expiry
  if (response.status === 401 || response.status === 403) {
    if (!url.includes("/api/auth/login")) {
      localStorage.removeItem("user")
      window.dispatchEvent(new Event("auth-changed"))
    }
  }

  let result
  const contentType = response.headers.get("content-type")
  const isJson = contentType && contentType.includes("application/json")

  try {
    if (isJson) {
      result = await response.json()
    } else {
      const text = await response.text()
      if (text.trim() === "") {
        result = {
          success: true,
          message: "Operation completed",
          data: null,
        }
      } else {
        throw new Error("Server returned non-JSON response")
      }
    }
  } catch (err) {
    throw new Error(`Failed to parse server response: ${err.message}`, { cause: err })
  }

  if (!response.ok || !result.success) {
    const error = new Error(result.message || "An unexpected error occurred")
    error.status = response.status
    throw error
  }

  return result
}

export const api = {
  get: (url, options) =>
    request(url, { method: "GET", ...options }),
  
  post: (url, body, options) => {
    const isFormData = body instanceof FormData
    return request(url, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    })
  },

  put: (url, body, options) => {
    const isFormData = body instanceof FormData
    return request(url, {
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    })
  },

  delete: (url, options) =>
    request(url, { method: "DELETE", ...options }),
}

async function request(url, options = {}) {
  const headers = new Headers(options.headers || {})

  // Only set Content-Type to application/json if we are NOT sending FormData
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(url, {
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
  try {
    result = await response.json()
  } catch (err) {
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`, { cause: err })
    }
    result = {
      success: true,
      message: "Operation completed",
      data: null,
    }
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

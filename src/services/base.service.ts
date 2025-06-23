export class BaseService {
  private baseURL: string

  constructor() {
    this.baseURL = ""
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, params?: Record<string, any>): Promise<T> {
    try {
      let url = `/api${endpoint}`

      // Add query parameters if provided
      if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value))
          }
        })
        const queryString = searchParams.toString()
        if (queryString) {
          url += `?${queryString}`
        }
      }

      console.log("🌐 Making API request to:", url)
      console.log("📋 Request options:", { method: options.method || "GET", hasBody: !!options.body })

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      console.log("📡 Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      })

      // Get response text first
      const responseText = await response.text()
      console.log("📄 Response body (first 500 chars):", responseText.substring(0, 500))

      if (!response.ok) {
        const errorInfo = {
          url,
          status: response.status,
          statusText: response.statusText,
          body: responseText,
        }
        console.error("❌ API Error:", errorInfo)
        throw new Error(JSON.stringify(errorInfo))
      }

      // Try to parse as JSON
      if (!responseText.trim()) {
        console.log("⚠️ Empty response body")
        return {} as T
      }

      try {
        const data = JSON.parse(responseText)
        console.log("✅ Successfully parsed JSON response")
        return data
      } catch (parseError) {
        console.error("❌ Failed to parse JSON:", parseError)
        console.error("📄 Raw response:", responseText)
        throw new Error("Invalid JSON response: " + responseText.substring(0, 100))
      }
    } catch (error) {
      console.error("💥 Request failed:", error)
      throw error
    }
  }

  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, params)
  }

  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

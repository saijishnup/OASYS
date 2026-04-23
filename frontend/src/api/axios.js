const ENV_API_BASE = import.meta.env.VITE_API_BASE?.trim()
const API_BASE_CANDIDATES = ENV_API_BASE
  ? [ENV_API_BASE]
  : ['http://localhost:5001/api', 'http://localhost:5002/api', 'http://localhost:5000/api']

function getToken() {
  return localStorage.getItem('oasys_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let networkError = null

  for (const apiBase of API_BASE_CANDIDATES) {
    try {
      const response = await fetch(`${apiBase}${path}`, {
        ...options,
        headers,
      })

      const contentType = response.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await response.json() : await response.text()

      if (!response.ok) {
        const message = typeof data === 'object' && data?.error ? data.error : 'Request failed'
        throw new Error(message)
      }

      return { data }
    } catch (error) {
      // Retry only for local fallback candidates on network-level failures.
      const isNetworkFailure = error instanceof TypeError
      if (!ENV_API_BASE && isNetworkFailure) {
        networkError = error
        continue
      }
      throw error
    }
  }

  if (networkError) {
    throw new Error('Unable to reach API. Start backend or set VITE_API_BASE in frontend/.env')
  }

  throw new Error('Request failed')
}

const api = {
  get(path) {
    return request(path)
  },
  post(path, body) {
    return request(path, {
      method: 'POST',
      body: JSON.stringify(body || {}),
    })
  },
  patch(path, body) {
    return request(path, {
      method: 'PATCH',
      body: JSON.stringify(body || {}),
    })
  },
  delete(path) {
    return request(path, {
      method: 'DELETE',
    })
  },
}

export default api

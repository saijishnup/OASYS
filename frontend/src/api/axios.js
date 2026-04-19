const API_BASE = 'http://localhost:5000/api'

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

  const response = await fetch(`${API_BASE}${path}`, {
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

// Centralized API calls
export async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error('API error');
  return res.json();
}

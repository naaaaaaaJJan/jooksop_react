const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function fetchPosts() {
  const res = await fetch(`${API_BASE_URL}/api/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return await res.json();
}

export async function apiFetch(path, { method, body }) {
  const res = await fetch(`/api/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method !== 'GET' ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`API call failed: ${res.status}`);
  }

  // Only try to parse JSON if there's content
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }
  
  return null;
}

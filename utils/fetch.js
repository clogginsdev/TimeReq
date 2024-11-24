export async function apiFetch(path, { method, body }) {
  try {
    const res = await fetch(`/api/${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    // Only try to parse JSON if there's content
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `API call failed: ${res.status}`);
      }
      return data;
    }
    
    if (!res.ok) {
      throw new Error(`API call failed: ${res.status}`);
    }
    
    return null;
  } catch (error) {
    console.error('API Error:', error);
    return []; // Return empty array for GET requests that fail
  }
}

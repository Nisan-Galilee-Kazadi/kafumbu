const ADMIN_API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/admin";

export async function getPublicContent() {
  const res = await fetch(`${ADMIN_API_BASE}/public/content`);
  if (!res.ok) throw new Error("public_content_failed");
  return res.json();
}

export async function searchPublicContent(query) {
  const res = await fetch(
    `${ADMIN_API_BASE}/public/search?q=${encodeURIComponent(query)}`,
  );
  if (!res.ok) throw new Error("public_search_failed");
  return res.json();
}

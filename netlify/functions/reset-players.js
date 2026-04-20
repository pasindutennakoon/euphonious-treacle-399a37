import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const { pwd } = await req.json().catch(() => ({}));
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Pasiya@2003";

  if (pwd !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const store = getStore("elephant-players");
  const { blobs } = await store.list();

  let deleted = 0;
  for (const blob of blobs) {
    await store.delete(blob.key);
    deleted++;
  }

  return new Response(JSON.stringify({ success: true, deleted }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = { path: "/api/reset-players" };
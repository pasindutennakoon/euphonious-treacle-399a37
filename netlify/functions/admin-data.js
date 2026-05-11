import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const pwd = url.searchParams.get("pwd");

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Pasiya@2003";
  if (pwd !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const store = getStore("elephant-players");
  const { blobs } = await store.list();

  // Fetch all players in parallel instead of one at a time
  const players = (
    await Promise.all(
      blobs.map(blob => store.get(blob.key, { type: "json" }).catch(() => null))
    )
  ).filter(Boolean);

  players.sort((a, b) => a.distance - b.distance);

  return new Response(JSON.stringify({ players }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/admin-data" };

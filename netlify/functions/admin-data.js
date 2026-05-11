import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("elephant-players");
  const { blobs } = await store.list();

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

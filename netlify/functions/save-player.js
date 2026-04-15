import { getStore } from "@netlify/blobs";

export default async (req) => {
  const body = await req.json();
  const { epf, name, location, distance, isWinner, timestamp } = body;

  if (!epf || !name || !location) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  const store = getStore("elephant-players");

  // Double-check server side — prevent duplicate plays
  const existing = await store.get(epf.toUpperCase(), { type: "json" }).catch(() => null);
  if (existing) {
    return new Response(JSON.stringify({ error: "Already played" }), { status: 409 });
  }

  const record = {
    epf: epf.toUpperCase(),
    name,
    location,
    distance,
    isWinner,
    timestamp: timestamp || new Date().toISOString()
  };

  await store.setJSON(epf.toUpperCase(), record);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/save-player" };
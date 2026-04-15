import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const epf = url.searchParams.get("epf")?.toUpperCase();

  if (!epf) {
    return new Response(JSON.stringify({ error: "EPF required" }), { status: 400 });
  }

  const store = getStore("elephant-players");
  const existing = await store.get(epf, { type: "json" }).catch(() => null);

  return new Response(JSON.stringify({ exists: !!existing }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/check-player" };
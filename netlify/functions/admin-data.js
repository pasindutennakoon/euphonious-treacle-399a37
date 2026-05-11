import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("elephant-players");
  const { blobs } = await store.list();

  // Fetch in batches of 50 to avoid overwhelming memory/rate limits
  const players = [];
  const batchSize = 50;
  for (let i = 0; i < blobs.length; i += batchSize) {
    const batch = blobs.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(b => store.get(b.key, { type: "json" }).catch(() => null))
    );
    players.push(...results.filter(Boolean));
  }

  players.sort((a, b) => a.distance - b.distance);

  // Return as CSV directly — smaller and easier to handle
  const keys = ["epf", "name", "location", "distance", "isWinner", "timestamp"];
  const csv = [
    keys.join(","),
    ...players.map(p =>
      keys.map(k => `"${String(p[k] ?? "").replace(/"/g, '""')}"`).join(",")
    )
  ].join("\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="players.csv"'
    }
  });
};

export const config = { path: "/api/admin-data" };

// src/app/(app)/teams/page.tsx
import { getPayload } from "payload";
import type { Player, Team } from "@/lib/db/types"; // Import generated types
import config from "../../../../payload.config"; // Path from /app/(app)/teams to root

// This is a helper function to safely get the payload instance
async function getLocalPayload() {
  const payload = await getPayload({
    config,
  });
  return payload;
}

// Helper type guard to check if a player is populated
function isPlayer(doc: number | Player): doc is Player {
  return typeof doc === "object" && doc !== null && "name" in doc;
}

export default async function TeamsPage() {
  const payload = await getLocalPayload();

  let teams: Team[] = [];

  try {
    const result = await payload.find({
      collection: "teams",
      depth: 1, // This is key to populating the 'players' array
      sort: "name",
    });
    teams = result.docs as Team[]; // Cast to Team[]
  } catch (error) {
    console.error("Error fetching teams:", error);
    // You could render an error message here
  }

  if (!teams || teams.length === 0) {
    return (
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Teams</h1>
        <p className="text-muted-foreground">
          No teams found. Go to the admin panel to create some!
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>
      <div className="space-y-8">
        {teams.map((team) => (
          <section
            key={team.id}
            className="border p-4 rounded-lg shadow-md bg-card text-card-foreground"
          >
            <h2 className="text-2xl font-semibold mb-4">{team.name}</h2>

            {team.players && team.players.length > 0 ? (
              <ul className="space-y-2">
                {team.players.map((player) => {
                  // Type guard to ensure player is populated
                  if (isPlayer(player)) {
                    return (
                      <li
                        key={player.id}
                        className="flex justify-between items-center p-3 bg-secondary text-secondary-foreground rounded-md"
                      >
                        <span className="font-medium">{player.name}</span>
                        <span className="text-xs font-semibold uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          {player.role}
                        </span>
                      </li>
                    );
                  }
                  // This will show if depth=0 or if relation is broken
                  return (
                    <li key={String(player)}>Player ID: {String(player)}</li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-muted-foreground">This team has no players.</p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}

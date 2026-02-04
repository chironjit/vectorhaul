import type { APIEvent } from "@solidjs/start/server";
import { getSession } from "vinxi/http";

const SESSION_NAME = "datahub-auth";

function getSessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  const isDev =
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === undefined;
  if (isDev) return "logistics-datahub-dev-session-secret-min-32-chars";
  return null;
}

export async function GET(event: APIEvent) {
  const SESSION_SECRET = getSessionSecret();
  if (!SESSION_SECRET) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const session = await getSession<{ username: string }>(event.nativeEvent, {
    password: SESSION_SECRET,
    name: SESSION_NAME,
  });
  const username = session?.data?.username;
  if (!username) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(
    JSON.stringify({ user: { email: username } }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

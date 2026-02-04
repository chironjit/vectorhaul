import type { APIEvent } from "@solidjs/start/server";
import { useSession } from "vinxi/http";

const SESSION_NAME = "dashboard-auth";

function getSessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  const isDev =
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === undefined;
  if (isDev) {
    return "logistics-dashboard-dev-session-secret-min-32-chars";
  }
  return null;
}

export async function POST(event: APIEvent) {
  const SESSION_SECRET = getSessionSecret();
  const EXPECTED_USERNAME = process.env.DASHBOARD_LOGIN_USERNAME?.trim() ?? "admin";
  const EXPECTED_PASSWORD = process.env.DASHBOARD_LOGIN_PASSWORD ?? "admin";

  if (!SESSION_SECRET) {
    return new Response(
      JSON.stringify({
        error:
          "Set SESSION_SECRET in .env (min 32 characters) and restart the server. Generate one with: openssl rand -base64 32",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  let body: { username?: string; password?: string };
  try {
    body = await event.request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (username !== EXPECTED_USERNAME || password !== EXPECTED_PASSWORD) {
    return new Response(
      JSON.stringify({ error: "Invalid credentials" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  const session = await useSession<{ username: string }>(event.nativeEvent, {
    password: SESSION_SECRET,
    name: SESSION_NAME,
  });
  await session.update({ username });
  return new Response(JSON.stringify({ ok: true, username }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

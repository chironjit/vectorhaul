import type { APIEvent } from "@solidjs/start/server";
import { useSession } from "vinxi/http";

const SESSION_NAME = "datahub-auth";

function getSessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  const isDev =
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === undefined;
  if (isDev) return "logistics-datahub-dev-session-secret-min-32-chars";
  return null;
}

export async function POST(event: APIEvent) {
  const SESSION_SECRET = getSessionSecret();
  if (!SESSION_SECRET) {
    return new Response(null, { status: 204 });
  }
  const session = await useSession<{ username: string }>(event.nativeEvent, {
    password: SESSION_SECRET,
    name: SESSION_NAME,
  });
  await session.clear();
  return new Response(null, { status: 204 });
}

import { clearAuthCookies } from "@/lib/api/server/cookies";
import { jsonOk } from "@/lib/api/server/http";

export async function POST() {
  await clearAuthCookies();
  return jsonOk(null, "Signed out");
}

// Proof that a request comes from one of this project's own GitHub workflows, without any shared password: the
// workflow asks GitHub for a signed ID token (OIDC) for our audience, and we check GitHub's signature and its claims.
const ISSUER = "https://token.actions.githubusercontent.com";
export const PUSH_AUDIENCE = "https://www.nepsisshield.com/api/push-send";
const OWNER = "midnixhtw";
const WORKFLOWS = ["push-reminders.yml", "announce-update.yml"];

type Jwk = JsonWebKey & { kid?: string };
let jwksCache: { at: number; keys: Jwk[] } | null = null;

async function githubKeys(): Promise<Jwk[]> {
  if (jwksCache && Date.now() - jwksCache.at < 60 * 60 * 1000) return jwksCache.keys;
  const response = await fetch(`${ISSUER}/.well-known/jwks`);
  if (!response.ok) throw new Error("Could not load GitHub keys");
  const { keys } = (await response.json()) as { keys: Jwk[] };
  jwksCache = { at: Date.now(), keys };
  return keys;
}

function b64urlBytes(part: string) {
  const padded = part.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (part.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

function b64urlJson<T>(part: string): T {
  return JSON.parse(new TextDecoder().decode(b64urlBytes(part))) as T;
}

/** True only for a valid, unexpired GitHub token minted for our audience by one of our workflows. */
export async function fromOurWorkflow(authorization: string | null): Promise<boolean> {
  try {
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
    const [head, body, signature] = token.split(".");
    if (!head || !body || !signature) return false;
    const header = b64urlJson<{ alg?: string; kid?: string }>(head);
    if (header.alg !== "RS256" || !header.kid) return false;
    const jwk = (await githubKeys()).find((key) => key.kid === header.kid);
    if (!jwk) return false;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlBytes(signature), new TextEncoder().encode(`${head}.${body}`));
    if (!ok) return false;

    const claims = b64urlJson<{ iss?: string; aud?: string | string[]; exp?: number; nbf?: number; repository_owner?: string; workflow_ref?: string }>(body);
    const now = Math.floor(Date.now() / 1000);
    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (claims.iss !== ISSUER || !audiences.includes(PUSH_AUDIENCE)) return false;
    if (!claims.exp || claims.exp < now || (claims.nbf && claims.nbf > now + 60)) return false;
    if ((claims.repository_owner ?? "").toLowerCase() !== OWNER) return false;
    // workflow_ref looks like "Owner/repo/.github/workflows/push-reminders.yml@refs/heads/main".
    const file = (claims.workflow_ref ?? "").split("@")[0].split("/").pop() ?? "";
    return WORKFLOWS.includes(file);
  } catch {
    return false;
  }
}

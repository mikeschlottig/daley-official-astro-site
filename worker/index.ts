// Worker entry. Static assets are still served directly by Cloudflare: wrangler.jsonc sets
// assets.run_worker_first to ["/api/*", "/lv-relay/*"], so this script only runs for the
// contact form API and the PostHog relay.
import { handleContact, handleNewsletter, type ContactEnv } from "./contact";
import { handleRelay, isRelayPath, type RelayEnv, type WaitUntilContext } from "./posthog-relay";

type AssetBinding = {
  fetch: (request: Request) => Promise<Response>;
};

type Env = { ASSETS: AssetBinding } & RelayEnv & ContactEnv;

export default {
  async fetch(request: Request, env: Env, ctx: WaitUntilContext): Promise<Response> {
    const url = new URL(request.url);
    if (isRelayPath(url.pathname)) return handleRelay(request, env, ctx);
    if (url.pathname === "/api/contact") return handleContact(request, env);
    if (url.pathname === "/api/newsletter") return handleNewsletter(request, env);
    return env.ASSETS.fetch(request);
  },
};

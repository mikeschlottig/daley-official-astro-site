# Daley Organics — contact form, cameron@ mailbox, click-to-call + AI receptionist

Session 2026-10-14 (Claude, WSL). Reference build: `/home/mikes/Astro-leverage-ai-site-rebuild` (skill
`website-booking-and-click-to-call`). Reasoning log: `hypothesis.md`.

## Open — not done

- **B2 `cameron@daleyorganics.com` → macmonk@live.com is NOT live.** Cloudflare refuses the rule
  (`2054 Destination address is not verified`) until someone opens the verification mail Cloudflare sent to
  macmonk@live.com on 2026-10-14 21:12 UTC and clicks the link. Until then, mail to cameron@ falls to the
  catch-all → ceo@leverageai.network (nothing is lost). After the click, run:
  ```bash
  keyring exec -p email-routing -- bash -c 'curl -s -X POST https://api.cloudflare.com/client/v4/zones/92e727cc87416d2985250b29efd87164/email/routing/rules -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "content-type: application/json" -d "{\"name\":\"cameron@daleyorganics.com to macmonk@live.com\",\"enabled\":true,\"matchers\":[{\"type\":\"literal\",\"field\":\"to\",\"value\":\"cameron@daleyorganics.com\"}],\"actions\":[{\"type\":\"forward\",\"value\":[\"macmonk@live.com\"]}]}" | jq -c "{success, errors}"'
  ```
- **Delivery minimum conflict:** `src/pages/delivery/williams.astro` and `murphy.astro` say 4 cubic yards; the yard
  assistant (`daley-organics-voice/src/agent.js:31-35`) records Mike settling 10 yards on 2026-09-12. The receptionist
  states no minimum until one number is confirmed (`CloudflareRealTime-Admin-App/wrangler.jsonc`, env.daley BUSINESS_FACTS).
- **Inbox arrival not observed.** Email Sending accepted every message (message ids in logs); nobody has looked in
  macmonk@live.com or the proton inbox behind ceo@ to confirm arrival / spam placement.
- **Real-device check not done:** camera/mic prompt on a phone, and who staffs the Daley desk
  (`https://daley-organics-call.ceo-a53.workers.dev/admin`, password in keyring `daley-organics-call` /
  `~/.env-vars-cloudflare/daley-organics-call.env`). With the desk closed every call goes to the AI receptionist.

## What existed (found before editing)

- Site Worker `daley-organics` serves `daleyorganics.com` (www 301 → apex). `worker/contact.ts` already did
  D1 `leads` insert → alerts → confirmation, sender `notifications@leverageai.network`.
- D1 `daley-organics-leads`: `leads`, `subscribers`, both 0 rows — never proven with a real submission.
- `click-to-call` (CloudflareRealTime-Admin-App): single-tenant LEVERAGEAI.
- `daley-organics-voice` (older push-to-talk, OpenRouter + KV): not touched; its approved facts fed the receptionist.

## Tasks

### A. Contact form
- [x] A1 Real submission through a staged twin (alerts → ceo@ only) — curl 200 in 4.8 s, browser 200 in 8.1 s,
      visitor sees "Thank you!"; D1 `notified=["ceo@…"]`, `confirmation_sent=1`. Backend was working; defect = latency.
- [x] A2 Respond right after the D1 insert, all mail concurrently in `waitUntil`; `mail_error` column (migration 0003,
      applied); UI required markers match the server (name, email, message) and browser validation is on;
      observability logs+traces declared — server latency 0.7–0.95 s on twin `6e533ed9`; D1 rows still notified+confirmed.
- [x] A3 Newsletter — twin `383b0769`: new 200, duplicate `alreadySubscribed`, log `subscriber_added notified:1`.

### B. cameron@daleyorganics.com → macmonk@live.com
- [x] B1 Destination macmonk@live.com created (verified = null, verification mail sent). Token: minted role
      `email-routing-mailboxes-20261014` into keyring `email-routing` (STD-CF-AUTH-001 table updated).
- [ ] B2 Routing rule — **blocked on the verification click**, command above.

### C. Click-to-call + AI receptionist for Daley
- [x] C1 Call app per-instance config (BUSINESS_FACTS, alert list, DESK_URL, brand via Vite mode) — typecheck + both builds.
- [x] C2 Worker `daley-organics-call`: D1 `daley-organics-leads` (+`calls`, `messages`, `scripts`, ledger
      `d1_migrations_call`), R2 `daley-organics-call-scripts`, sender notifications@leverageai.network, alerts
      macmonk@live.com + ceo@leverageai.network — deploy output bindings; version `6cd2cf56`.
- [x] C3 Secrets ADMIN_PASSWORD (new) + REALTIMEKIT_API_TOKEN — `wrangler secret list` names.
- [x] C4 voice-ws PASS twice: greeting "thanks for calling Daley Organics"; price question → "$55 a yard", no
      delivery fee invented; D1 `messages` rows; `alert_email_sent` with a leverageai.network message id.
- [x] C5 LEVERAGEAI `click-to-call` promoted `1c0d19bb` (rollback `c2ab72bf`) — router-ws 3/3; Daley router-ws 3/3.

### D. Site integration
- [x] D1 "Talk to the yard now" in the `#contact` section; floating widget hidden — call gate: in-frame page says
      "Daley Organics · Start a call" at 1280 and 390.
- [x] D2 Staged release: `62c0dc84` at 0% → gates → promoted; production = `62c0dc84` alone. Rollback: `865df018`.
- [x] D3 Production re-check: call gate PASS, 0 console errors; `POST /api/contact {}` → 400. Test rows archived
      (`/home/mikes/_archive/daley-organics-leads-test-rows-*.json`) and removed; all four tables at 0.

### E. Close
- [x] E1 Commits, SCOREBOARD entry, skill gotchas.

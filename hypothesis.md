# Hypothesis log — Daley Organics

Loop: predict → run → diff → why. Newest last.

## 2026-10-14 · A1 contact form real submission
- **Prediction:** the code path works end-to-end (D1 insert, 2 alerts, confirmation). If anything fails it is the
  Email Sending send from `notifications@leverageai.network` out of the `daley-organics` Worker, because no
  submission has ever reached D1 (0 rows) and the sender belongs to another zone.
- **Reality:** staged version 543a92b2 (code = prod 865df018, alerts redirected to ceo@): curl → 200 in 4.8 s;
  browser gate → 200 in 8.1 s, visitor sees "Thank you!". D1 row `notified=["ceo@leverageai.network"]`,
  `confirmation_sent=1`; log `lead_received stored:true notified:1 confirmationSent:true`, no `retry` events.
- **Diff:** prediction wrong. Sender works. The defect is latency: alert(s) and confirmation are awaited one after
  another before the response, ~2.4 s per send.
- **Why it looked broken:** D1 had 0 rows before today — nobody had completed a submission since the 2026-10-10 fix,
  so nothing had ever proven it. "Never proven" read as "broken".
- **Next:** respond right after the D1 insert, send all mail concurrently in `waitUntil`; record `mail_error` like
  the reference. Predict: browser POST < 1.5 s, D1 row still shows notified + confirmation_sent.

- **Reality (A2):** twin 6e533ed9: 717 ms and 949 ms server-side; browser gate 3.9 s with `ERR_NETWORK_CHANGED`
  in the same run (WSL mirrored networking). D1 rows notified + confirmed, `mail_error` NULL. Prediction held for
  the server; the browser figure is network noise, not the Worker.

## 2026-10-14 · C receptionist facts
- **Prediction:** with BUSINESS_FACTS the agent answers "how much is Merlin Blend" with $55 and refuses a delivery fee.
- **Reality:** "A yard of Merlin Blend is 55 dollars, and yes, Daley Organics does deliver to Murphy…" — no fee named.
  Held. Side effect seen: one reply both asked "is that right?" and said goodbye (pre-existing prompt behaviour).

## 2026-10-14 · B cameron@ forward
- **Prediction:** destination + rule in one go.
- **Reality:** destination created (verified=null); rule refused: `2054 Destination address is not verified`.
- **Why:** Cloudflare requires the inbox owner to click the verification mail before any rule may forward to it.

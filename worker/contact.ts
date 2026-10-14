// Contact form → D1 + email alerts + submitter confirmation.
// Same architecture as morningwood-firewood: D1 `leads` table, Cloudflare Email Service
// (Email Sending) via the EMAIL binding, sender notifications@leverageai.network, alerts to every
// address in NOTIFICATION_EMAIL. Additionally: the customer gets a confirmation email, alerts set
// Reply-To to the customer, all user input is HTML-escaped, and D1/email calls retry with backoff.

import type { WaitUntilContext } from "./posthog-relay";

type D1Result = { success: boolean; meta?: { changes?: number } };
type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  run: () => Promise<D1Result>;
};
type D1Database = { prepare: (sql: string) => D1PreparedStatement };

type EmailAddress = { email: string; name?: string };
type SendEmailBinding = {
  send: (message: {
    to: string | EmailAddress;
    from: string | EmailAddress;
    subject: string;
    html?: string;
    text?: string;
    replyTo?: string | EmailAddress;
  }) => Promise<{ messageId: string }>;
};

export type ContactEnv = {
  DB: D1Database;
  EMAIL: SendEmailBinding;
  NOTIFICATION_EMAIL?: string;
  FROM_EMAIL?: string;
  REPLY_TO_EMAIL?: string;
  ALLOWED_ORIGINS?: string;
};

type Lead = {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  projectSize: string;
  message: string;
  sourcePage: string;
};

class ContactValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContactValidationError";
  }
}

const MAX_ATTEMPTS = 3;
const LIMITS = { name: 120, email: 254, phone: 40, preferredDate: 40, projectSize: 60, message: 5000, sourcePage: 300 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const log = (level: "info" | "warn" | "error", event: string, fields: Record<string, unknown> = {}) =>
  console[level](JSON.stringify({ level, event, component: "contact", ...fields }));

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function withRetry<T>(label: string, fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      log("warn", "retry", { label, attempt, message: error instanceof Error ? error.message : String(error) });
      if (attempt < MAX_ATTEMPTS - 1) await sleep(2 ** attempt * 250 + Math.random() * 250);
    }
  }
  throw lastError;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

const field = (body: Record<string, unknown>, key: string, max: number): string => {
  const raw = body[key];
  const value = typeof raw === "string" ? raw.trim() : "";
  if (value.length > max) throw new ContactValidationError(`${key} is too long.`);
  return value;
};

function parseLead(body: Record<string, unknown>): Lead {
  const lead: Lead = {
    name: field(body, "name", LIMITS.name),
    email: field(body, "email", LIMITS.email),
    phone: field(body, "phone", LIMITS.phone),
    preferredDate: field(body, "visitDate", LIMITS.preferredDate),
    projectSize: field(body, "visitors", LIMITS.projectSize),
    message: field(body, "message", LIMITS.message),
    sourcePage: field(body, "sourcePage", LIMITS.sourcePage),
  };
  if (!lead.name) throw new ContactValidationError("Please enter your name.");
  if (!EMAIL_PATTERN.test(lead.email)) throw new ContactValidationError("Please enter a valid email address.");
  if (lead.message.length < 2) throw new ContactValidationError("Please enter a message.");
  return lead;
}

const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status });

function alertEmail(lead: Lead, id: string): { subject: string; text: string; html: string } {
  const when = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  const rows: Array<[string, string]> = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone || "Not provided"],
    ["Preferred contact date", lead.preferredDate || "Not provided"],
    ["Project size", lead.projectSize || "Not provided"],
    ["Sent from", lead.sourcePage || "Unknown page"],
  ];
  const text = [
    "New contact form submission — daleyorganics.com",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    lead.message,
    "",
    `Lead ID: ${id} · ${when} PT`,
    "Reply to this email to answer the customer directly.",
  ].join("\n");
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">
  <div style="background:#1f3d1f;color:#fff;padding:16px 20px"><strong>Daley Organics</strong> — new contact form submission</div>
  <div style="padding:20px;color:#222">
    <table style="width:100%;border-collapse:collapse;font-size:15px">${rows
      .map(([k, v]) => `<tr><td style="padding:6px 0;color:#666;width:170px">${escapeHtml(k)}</td><td style="padding:6px 0">${escapeHtml(v)}</td></tr>`)
      .join("")}</table>
    <p style="margin:16px 0 6px;color:#666">Message</p>
    <p style="margin:0;white-space:pre-wrap">${escapeHtml(lead.message)}</p>
    <p style="margin:20px 0 0;font-size:12px;color:#888">Lead ID ${escapeHtml(id)} · ${escapeHtml(when)} PT · Reply to this email to answer the customer directly.</p>
  </div></div>`;
  return { subject: `New inquiry from ${lead.name} — Daley Organics`, text, html };
}

function confirmationEmail(lead: Lead): { subject: string; text: string; html: string } {
  const first = lead.name.split(/\s+/)[0] ?? lead.name;
  const body = "We've received your form submission and will respond to your inquiry promptly. Thanks!";
  return {
    subject: "We received your message — Daley Organics",
    text: `Hi ${first},\n\n${body}\n\n— Daley Organics\nhttps://daleyorganics.com`,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#222;font-size:15px;line-height:1.6">
  <p>Hi ${escapeHtml(first)},</p><p>${body}</p><p>— Daley Organics<br><a href="https://daleyorganics.com" style="color:#1f3d1f">daleyorganics.com</a></p></div>`,
  };
}

export async function handleContact(request: Request, env: ContactEnv, ctx: WaitUntilContext): Promise<Response> {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } });

  const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean);
  const origin = request.headers.get("origin");
  if (origin && allowed.length > 0 && !allowed.includes(origin)) {
    log("warn", "origin_rejected", { origin });
    return json({ ok: false, error: "This form only accepts submissions from daleyorganics.com." }, 403);
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new ContactValidationError("Invalid form data.");
    body = parsed as Record<string, unknown>;
  } catch (error) {
    if (error instanceof ContactValidationError) return json({ ok: false, error: error.message }, 400);
    return json({ ok: false, error: "Invalid form data." }, 400);
  }

  // Honeypot: real visitors never fill the hidden "website" field. Pretend success.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    log("info", "honeypot_triggered");
    return json({ ok: true });
  }

  let lead: Lead;
  try {
    lead = parseLead(body);
  } catch (error) {
    if (error instanceof ContactValidationError) return json({ ok: false, error: error.message }, 400);
    throw error;
  }

  const id = crypto.randomUUID();
  const from: EmailAddress = { email: env.FROM_EMAIL ?? "notifications@leverageai.network", name: "Daley Organics" };
  const recipients = (env.NOTIFICATION_EMAIL ?? "").split(",").map((r) => r.trim()).filter(Boolean);

  let stored = false;
  try {
    await withRetry("d1_insert", () =>
      env.DB.prepare(
        `INSERT INTO leads (id, name, email, phone, preferred_date, project_size, message, source_page)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(id, lead.name, lead.email, lead.phone, lead.preferredDate, lead.projectSize, lead.message, lead.sourcePage)
        .run(),
    );
    stored = true;
  } catch (error) {
    log("error", "d1_insert_failed", { id, message: error instanceof Error ? error.message : String(error) });
  }

  const delivery = deliverLead(env, lead, id, recipients, from, stored);

  // Stored in D1 = received (Speed-to-Lead): answer the visitor now and send the mail after the response.
  // Each send takes ~2.4 s; awaiting them serially kept the visitor on a spinner for 5–8 s (2026-10-14).
  if (stored) {
    ctx.waitUntil(delivery);
    return json({ ok: true, id });
  }
  // Not stored: the email is the only record, so the visitor's answer depends on it.
  const { notified } = await delivery;
  if (notified.length === 0) {
    return json({ ok: false, error: "We couldn't send your message. Please call or email us directly." }, 502);
  }
  return json({ ok: true, id });
}

/** Alerts and the submitter confirmation, sent concurrently; the outcome is written back to the lead row. */
async function deliverLead(
  env: ContactEnv,
  lead: Lead,
  id: string,
  recipients: string[],
  from: EmailAddress,
  stored: boolean,
): Promise<{ notified: string[]; confirmationSent: boolean }> {
  const alert = alertEmail(lead, id);
  const confirmation = confirmationEmail(lead);
  const [alertResults, confirmationResult] = await Promise.all([
    Promise.allSettled(
      recipients.map((to) =>
        withRetry(`alert:${to}`, () =>
          env.EMAIL.send({ to, from, subject: alert.subject, text: alert.text, html: alert.html, replyTo: { email: lead.email, name: lead.name } }),
        ).then(() => to),
      ),
    ),
    withRetry("confirmation", () =>
      env.EMAIL.send({
        to: { email: lead.email, name: lead.name },
        from,
        subject: confirmation.subject,
        text: confirmation.text,
        html: confirmation.html,
        replyTo: env.REPLY_TO_EMAIL ?? recipients[0] ?? from.email,
      }),
    ).then(
      () => null,
      (error: unknown) => (error instanceof Error ? error.message : String(error)),
    ),
  ]);

  const notified = alertResults.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  const errors: string[] = [];
  alertResults.forEach((r, i) => {
    if (r.status === "rejected") {
      errors.push(`alert ${recipients[i]}: ${String(r.reason)}`);
      log("error", "alert_failed", { id, to: recipients[i], message: String(r.reason) });
    }
  });
  const confirmationSent = confirmationResult === null;
  if (!confirmationSent) {
    errors.push(`confirmation: ${confirmationResult}`);
    log("error", "confirmation_failed", { id, message: confirmationResult });
  }

  if (stored) {
    await env.DB.prepare("UPDATE leads SET notified = ?, confirmation_sent = ?, mail_error = ? WHERE id = ?")
      .bind(JSON.stringify(notified), confirmationSent ? 1 : 0, errors.length ? errors.join("\n").slice(0, 500) : null, id)
      .run()
      .catch((error: unknown) => log("warn", "d1_update_failed", { id, message: String(error) }));
  }

  log("info", "lead_received", { id, stored, notified: notified.length, recipients: recipients.length, confirmationSent });
  return { notified, confirmationSent };
}

/** Footer newsletter signup → D1 `subscribers` (deduplicated) + alert + subscriber confirmation. */
export async function handleNewsletter(request: Request, env: ContactEnv, ctx: WaitUntilContext): Promise<Response> {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } });

  const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean);
  const origin = request.headers.get("origin");
  if (origin && allowed.length > 0 && !allowed.includes(origin)) {
    log("warn", "origin_rejected", { origin, form: "newsletter" });
    return json({ ok: false, error: "This form only accepts submissions from daleyorganics.com." }, 403);
  }

  let email: string;
  let sourcePage: string;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new ContactValidationError("Invalid form data.");
    const body = parsed as Record<string, unknown>;
    if (typeof body.website === "string" && body.website.trim() !== "") return json({ ok: true });
    email = field(body, "email", LIMITS.email).toLowerCase();
    sourcePage = field(body, "sourcePage", LIMITS.sourcePage);
    if (!EMAIL_PATTERN.test(email)) throw new ContactValidationError("Please enter a valid email address.");
  } catch (error) {
    if (error instanceof ContactValidationError) return json({ ok: false, error: error.message }, 400);
    return json({ ok: false, error: "Invalid form data." }, 400);
  }

  let isNew = false;
  try {
    const result = await withRetry("d1_subscriber", () =>
      env.DB.prepare("INSERT OR IGNORE INTO subscribers (email, source_page) VALUES (?, ?)").bind(email, sourcePage).run(),
    );
    isNew = result.meta?.changes === 1;
  } catch (error) {
    log("error", "d1_subscriber_failed", { message: error instanceof Error ? error.message : String(error) });
    return json({ ok: false, error: "We couldn't save your signup. Please try again." }, 502);
  }

  if (!isNew) return json({ ok: true, alreadySubscribed: true });

  // The row is in D1, so the signup is safe: answer now, send the mail after the response.
  ctx.waitUntil(sendNewsletterMail(env, email, sourcePage));
  return json({ ok: true });
}

/** Signup alerts + subscriber confirmation, sent concurrently. */
async function sendNewsletterMail(env: ContactEnv, email: string, sourcePage: string): Promise<void> {
  const from: EmailAddress = { email: env.FROM_EMAIL ?? "notifications@leverageai.network", name: "Daley Organics" };
  const recipients = (env.NOTIFICATION_EMAIL ?? "").split(",").map((r) => r.trim()).filter(Boolean);
  const alertsSent = Promise.allSettled(
    recipients.map((to) =>
      withRetry(`newsletter_alert:${to}`, () =>
        env.EMAIL.send({
          to,
          from,
          subject: `New newsletter signup — Daley Organics`,
          text: `New newsletter signup: ${email}\nSigned up from: ${sourcePage || "Unknown page"}`,
          html: `<p>New newsletter signup: <strong>${escapeHtml(email)}</strong><br>Signed up from: ${escapeHtml(sourcePage || "Unknown page")}</p>`,
          replyTo: email,
        }),
      ),
    ),
  );
  const confirmationSent = withRetry("newsletter_confirmation", () =>
    env.EMAIL.send({
      to: email,
      from,
      subject: "You're signed up — Daley Organics",
      text: "Thanks for signing up for Daley Organics updates. We've received your request and will keep you posted.\n\n— Daley Organics\nhttps://daleyorganics.com",
      html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#222"><p>Thanks for signing up for Daley Organics updates. We've received your request and will keep you posted.</p><p>— Daley Organics<br><a href="https://daleyorganics.com" style="color:#1f3d1f">daleyorganics.com</a></p></div>`,
      replyTo: env.REPLY_TO_EMAIL ?? recipients[0] ?? from.email,
    }),
  ).catch((error: unknown) => log("error", "newsletter_confirmation_failed", { message: String(error) }));

  const [alerts] = await Promise.all([alertsSent, confirmationSent]);
  alerts.forEach((r, i) => {
    if (r.status === "rejected") log("error", "newsletter_alert_failed", { to: recipients[i], message: String(r.reason) });
  });
  log("info", "subscriber_added", { notified: alerts.filter((r) => r.status === "fulfilled").length });
}

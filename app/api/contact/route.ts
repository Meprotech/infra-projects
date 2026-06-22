import { NextResponse } from "next/server";

// Edge-compatible: no Node-only APIs, so this deploys cleanly to Vercel.
export const runtime = "edge";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  // Minimal server-side validation (never trust the client).
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required.";
  if (!email || !EMAIL_RE.test(email)) errors.email = "A valid email is required.";
  if (!message || message.length < 10)
    errors.message = "Please include a short message (10+ characters).";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // TODO: connect to Brevo SMTP
  // Wire the real transactional email here — e.g. POST to the Brevo (Sendinblue)
  // transactional email API with BREVO_API_KEY from env, sending to the company
  // inbox and (optionally) an auto-reply to the sender. Keep it serverless-
  // friendly (fetch-based, no nodemailer) so it stays edge-compatible.
  //
  // const res = await fetch("https://api.brevo.com/v3/smtp/email", {
  //   method: "POST",
  //   headers: {
  //     "api-key": process.env.BREVO_API_KEY!,
  //     "content-type": "application/json",
  //   },
  //   body: JSON.stringify({ ... }),
  // });

  // For now, log and acknowledge so the UI flow is fully testable.
  console.log("[contact] new enquiry:", { name, email, subject: body.subject });

  return NextResponse.json(
    { ok: true, message: "Thanks — your enquiry has been received." },
    { status: 200 },
  );
}

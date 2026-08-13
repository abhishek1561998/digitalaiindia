import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser"; // works in Node/Edge
import { api } from "@/convex/_generated/api";
import { sendContactNotificationEmail } from "@/lib/server/email";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // (Basic required-field safety)
    ["name", "email", "subject", "message"].forEach((k) => {
      if (!body?.[k] || String(body[k]).trim() === "") {
        throw new Error(`Missing required field: ${k}`);
      }
    });

    const name = String(body.name);
    const email = String(body.email);
    const subject = String(body.subject);
    const message = String(body.message);

    const [convexResult, emailResult] = await Promise.allSettled([
      convex.mutation(api.contact.createContactMessage, {
        name,
        email,
        phone: body.phone ? String(body.phone) : undefined,
        company: body.company ? String(body.company) : undefined,
        subject,
        message,
        service: body.service ? String(body.service) : undefined,
      }),
      sendContactNotificationEmail({ name, email, subject, message }),
    ]);

    if (convexResult.status === "rejected") {
      console.error("contact route: convex store failed:", convexResult.reason);
    }
    if (emailResult.status === "rejected") {
      console.error("contact route: email send failed:", emailResult.reason);
    }

    // Succeed if either side actually captured the message — don't lose a
    // real inquiry just because one of two independent paths is down.
    if (convexResult.status === "rejected" && emailResult.status === "rejected") {
      throw new Error("Both storage and email delivery failed");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact route error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

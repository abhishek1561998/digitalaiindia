import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser"; // works in Node/Edge
import { api } from "@/convex/_generated/api";

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

    await convex.mutation(api.contact.createContactMessage, {
      name: String(body.name),
      email: String(body.email),
      phone: body.phone ? String(body.phone) : undefined,
      company: body.company ? String(body.company) : undefined,
      subject: String(body.subject),
      message: String(body.message),
      service: body.service ? String(body.service) : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact route error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

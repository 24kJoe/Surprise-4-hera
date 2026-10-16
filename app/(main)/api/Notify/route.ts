import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  console.log("🔔 [NOTIFY API] Route was triggered by the website!");

  if (!process.env.RESEND_API_KEY) {
    console.log("❌ [NOTIFY API] ERROR: RESEND_API_KEY is missing or empty in .env");
    return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
  }

  try {
    console.log("⏳ [NOTIFY API] Attempting to send email via Resend...");
    
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["yh2112008@gmail.com"],
      subject: "Someone unlocked the site! 🌹",
      html: "<p>Someone just entered the correct passcode and accessed the website.</p>",
    });

    if (error) {
      console.error("❌ [NOTIFY API] RESEND REJECTED IT:", error);
      return NextResponse.json({ error }, { status: 400 });
    }
    
    console.log("✅ [NOTIFY API] SUCCESS! Email sent. Resend ID:", data?.id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("❌ [NOTIFY API] CODE CRASHED:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
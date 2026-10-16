import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>", // Resend's default testing address
      to: ["yh2112008@gmail.com"], // Replace with the email where you want to receive the notification
      subject: "Someone unlocked the site! 🌹",
      html: "<p>Someone just entered the correct passcode and accessed the website.</p>",
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
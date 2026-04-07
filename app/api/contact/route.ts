import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

interface ContactBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  details: string;
}

export async function POST(req: Request) {
  try {
    const body: ContactBody = await req.json();
    const { firstName, lastName, email, phone, service, details } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !service) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        service,
        details,
      });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save your enquiry. Please try again." },
        { status: 500 }
      );
    }

    // 2. Send notification email via Resend
    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.CONTACT_NOTIFY_EMAIL!,
      subject: `New Enquiry: ${service} — ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${phone || "Not provided"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Service</td><td style="padding:8px">${service}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Details</td><td style="padding:8px">${details || "None"}</td></tr>
        </table>
      `,
    });

    if (emailError) {
      console.error("Resend email error:", emailError);
      console.error("RESEND_API_KEY loaded:", !!process.env.RESEND_API_KEY);
      console.error("RESEND_FROM_EMAIL:", process.env.RESEND_FROM_EMAIL);
      console.error("CONTACT_NOTIFY_EMAIL:", process.env.CONTACT_NOTIFY_EMAIL);
      // DB saved, but flag that email failed
      return NextResponse.json({ success: true, emailError: emailError.message });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

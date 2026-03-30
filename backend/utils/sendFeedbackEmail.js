import axios from "axios";

export const sendFeedbackEmail = (name, email, message) => {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY is missing in environment variables");
    return;
  }

  const fromEmail = process.env.EMAIL_FROM;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!fromEmail) {
    console.error("EMAIL_FROM is missing in environment variables");
    return;
  }

  if (!adminEmail) {
    console.error("ADMIN_EMAIL is missing in environment variables");
    return;
  }

  const senderEmail = fromEmail.includes("<")
    ? fromEmail.match(/<(.*)>/)?.[1]
    : fromEmail;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto;">
      <h2 style="color: #d63384;">📬 New Feedback — Floral Heaven</h2>
      <hr style="border: 1px solid #f0f0f0;" />

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>

      <div style="background: #f9f9f9; border-left: 4px solid #d63384; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <p style="margin: 0; color: #333;"><strong>Message:</strong></p>
        <p style="margin: 8px 0 0; color: #555;">${message}</p>
      </div>

      <p style="color: gray; font-size: 12px;">
        This feedback was submitted via the Floral Heaven website.
      </p>
    </div>
  `;

  // Fire and forget — matches existing sendEmail.js pattern
  axios
    .post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Floral Heaven",
          email: senderEmail,
        },
        to: [{ email: adminEmail }],
        replyTo: { email, name },
        subject: `New Feedback from ${name} — Floral Heaven`,
        htmlContent,
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        timeout: 10000,
      }
    )
    .catch((err) => {
      console.error(
        "BREVO FEEDBACK EMAIL ERROR:",
        err.response?.data || err.message
      );
    });

  return true;
};

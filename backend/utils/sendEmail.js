import axios from "axios";

export const sendOtpEmail = (email, otp) => {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY is missing in environment variables");
    return;
  }

  const fromEmail = process.env.EMAIL_FROM;

  if (!fromEmail) {
    console.error("EMAIL_FROM is missing in environment variables");
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2> Welcome to Floral Heaven</h2>

        <p>Use the OTP below to complete your signup:</p>

        <h1 style="letter-spacing: 4px; font-weight: bold; color: #d63384;">
        ${otp}
        </h1>

        <p>This OTP is valid for <b>5 minutes</b>.</p>

        <p style="color: gray; font-size: 12px;">
        If you did not request this, you can safely ignore this email.
        </p>
    </div>
  `;

  // Fire and forget - send email in background without blocking
  axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "Floral Heaven",
        email: fromEmail.includes("<")
          ? fromEmail.match(/<(.*)>/)?.[1]
          : fromEmail,
      },
      to: [{ email }],
      subject: "Your OTP for Floral Heaven Signup",
      htmlContent,
    },
    {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      timeout: 10000, // Reduced from 20s to 10s
    }
  ).catch(err => {
    // Log errors but don't throw - email failure won't crash the app
    console.error("BREVO API EMAIL ERROR:", err.response?.data || err.message);
  });

  // Return immediately - don't wait for email to send
  return true;
};
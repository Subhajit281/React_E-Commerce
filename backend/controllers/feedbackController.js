import Feedback from "../models/feedback.js";
import axios from "axios";

// ─── POST feedback (public) ───────────────────────────────────────────────────
export const submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }

    // Save to DB
    const feedback = await Feedback.create({ name, email, message });

    // Fire email to supplier in background
    sendFeedbackEmail({ name, email, message });

    return res.status(201).json({ success: true, message: "Feedback received! We'll get back to you soon." });
  } catch (err) {
    return res.status(500).json({ message: "Failed to submit feedback", error: err.message });
  }
};

// ─── GET all feedback (admin) ─────────────────────────────────────────────────
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, feedbacks });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch feedback", error: err.message });
  }
};

// ─── Send feedback email to supplier ─────────────────────────────────────────
const sendFeedbackEmail = ({ name, email, message }) => {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;
  const SUPPLIER_EMAIL = "subhajitportfolio018@gmail.com";

  if (!BREVO_API_KEY || !fromEmail) return;

  const htmlContent = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      <div style="background:linear-gradient(135deg,#c2185b,#e91e8c);padding:28px 32px;">
        <h2 style="color:#fff;margin:0;font-size:20px;">🌸 New Message — Floral Heaven</h2>
      </div>
      <div style="padding:28px 32px;">
        <table style="width:100%;font-size:14px;color:#555;margin-bottom:20px;">
          <tr><td style="padding:6px 0;color:#999;width:80px;">From</td><td style="font-weight:600;color:#111;">${name}</td></tr>
          <tr><td style="padding:6px 0;color:#999;">Email</td><td><a href="mailto:${email}" style="color:#c2185b;">${email}</a></td></tr>
        </table>
        <div style="background:#fdf6fb;border-radius:10px;padding:18px 20px;font-size:14px;color:#333;line-height:1.8;border-left:4px solid #c2185b;">
          ${message.replace(/\n/g, "<br/>")}
        </div>
      </div>
      <div style="padding:16px 32px;background:#fdf6fb;border-top:1px solid #f0e6f0;font-size:12px;color:#aaa;text-align:center;">
         Floral Heaven | @floral_heaven02 | Automated contact notification
      </div>
    </div>
  `;

  axios.post("https://api.brevo.com/v3/smtp/email", {
    sender: {
      name: "Floral Heaven Contact",
      email: fromEmail.includes("<") ? fromEmail.match(/<(.*)>/)?.[1] : fromEmail,
    },
    to: [{ email: SUPPLIER_EMAIL, name: "Floral Heaven" }],
    replyTo: { email, name },
    subject: `💬 New Message from ${name} — Floral Heaven`,
    htmlContent,
  }, {
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json", accept: "application/json" },
    timeout: 10000,
  }).catch(err => console.error("Feedback email error:", err.response?.data || err.message));
};

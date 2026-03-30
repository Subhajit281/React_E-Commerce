import axios from "axios";

const SUPPLIER_EMAIL = "subhajitsarkar281@gmail.com";

// ─── Build beautiful HTML invoice ────────────────────────────────────────────
const buildInvoiceHTML = ({ orderId, date, customer, address, items, subtotal, shipping, total, paymentMethod }) => {
  const itemRows = items.map((item) => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6f0;">${item.title}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6f0; text-align:center;">${item.qty}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6f0; text-align:right;">₹${Math.round(item.price)}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6f0; text-align:right; font-weight:600;">₹${Math.round(item.price * item.qty)}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0; padding:0; background:#f9f4f9; font-family: 'Segoe UI', Arial, sans-serif;">

  <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(180,80,120,0.10);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #c2185b, #e91e8c); padding: 36px 40px; text-align:center;">
      <h1 style="margin:0; color:#fff; font-size:28px; letter-spacing:1px;">🌸 Floral Heaven</h1>
      <p style="margin:6px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">New Order Received!</p>
    </div>

    <!-- Order Meta -->
    <div style="padding: 28px 40px 0;">
      <table style="width:100%; font-size:14px; color:#555;">
        <tr>
          <td style="padding:4px 0;"><span style="color:#999;">Order ID</span></td>
          <td style="text-align:right; font-weight:700; color:#c2185b;">${orderId}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;"><span style="color:#999;">Date</span></td>
          <td style="text-align:right;">${date}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;"><span style="color:#999;">Payment</span></td>
          <td style="text-align:right;">
            <span style="background:${paymentMethod === "COD" ? "#fff3e0" : "#e8f5e9"}; color:${paymentMethod === "COD" ? "#e65100" : "#2e7d32"}; padding:2px 10px; border-radius:20px; font-size:12px; font-weight:600;">
              ${paymentMethod === "COD" ? "🚚 Cash on Delivery" : "📱 UPI / Online"}
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Customer Details -->
    <div style="margin: 24px 40px 0; background:#fdf6fb; border-radius:10px; padding:18px 20px;">
      <h3 style="margin:0 0 12px; font-size:14px; color:#c2185b; text-transform:uppercase; letter-spacing:0.5px;">👤 Customer Details</h3>
      <p style="margin:4px 0; font-size:14px; color:#333;"><strong>${customer.name}</strong></p>
      <p style="margin:4px 0; font-size:14px; color:#555;">📧 ${customer.email}</p>
      <p style="margin:4px 0; font-size:14px; color:#555;">📱 +91 ${customer.mobile}</p>
      <p style="margin:4px 0; font-size:14px; color:#555;">📍 ${address}</p>
    </div>

    <!-- Items Table -->
    <div style="margin: 24px 40px 0;">
      <h3 style="margin:0 0 12px; font-size:14px; color:#c2185b; text-transform:uppercase; letter-spacing:0.5px;">🛒 Items Ordered</h3>
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <thead>
          <tr style="background:#fdf6fb;">
            <th style="padding:10px 12px; text-align:left; color:#888; font-weight:600; font-size:12px; text-transform:uppercase;">Product</th>
            <th style="padding:10px 12px; text-align:center; color:#888; font-weight:600; font-size:12px; text-transform:uppercase;">Qty</th>
            <th style="padding:10px 12px; text-align:right; color:#888; font-weight:600; font-size:12px; text-transform:uppercase;">Price</th>
            <th style="padding:10px 12px; text-align:right; color:#888; font-weight:600; font-size:12px; text-transform:uppercase;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
    </div>

    <!-- Totals -->
    <div style="margin: 20px 40px 0;">
      <table style="width:100%; font-size:14px;">
        <tr>
          <td style="padding:6px 0; color:#666;">Subtotal</td>
          <td style="text-align:right; color:#333;">₹${Math.round(subtotal)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0; color:#666;">Shipping</td>
          <td style="text-align:right; color:#333;">₹${shipping}</td>
        </tr>
        <tr style="border-top: 2px solid #f0e6f0;">
          <td style="padding:12px 0 6px; font-size:16px; font-weight:700; color:#c2185b;">TOTAL</td>
          <td style="text-align:right; font-size:18px; font-weight:700; color:#c2185b; padding-top:12px;">₹${Math.round(total)}</td>
        </tr>
      </table>
    </div>

    <!-- Action Note -->
    <div style="margin: 24px 40px 32px; background: linear-gradient(135deg, #fff8e1, #fff3cd); border-left: 4px solid #ffc107; border-radius:8px; padding:16px 20px;">
      <p style="margin:0; font-size:14px; color:#795548;">
        ⚡ <strong>Action Required:</strong> Please contact the customer at
        <strong>📱 +91 ${customer.mobile}</strong> or
        <strong>📧 ${customer.email}</strong> to confirm this order and arrange delivery.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#fdf6fb; padding:20px 40px; text-align:center; border-top:1px solid #f0e6f0;">
      <p style="margin:0; font-size:12px; color:#aaa;">🌸 Floral Heaven &nbsp;|&nbsp; @_epic_18 &nbsp;|&nbsp; This is an automated order notification</p>
    </div>

  </div>
</body>
</html>
  `;
};

// ─── Send invoice to supplier ─────────────────────────────────────────────────
export const sendOrderInvoiceToSupplier = ({ orderId, date, customer, address, items, subtotal, shipping, total, paymentMethod }) => {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;

  if (!BREVO_API_KEY || !fromEmail) {
    console.error("Missing BREVO_API_KEY or EMAIL_FROM in .env");
    return;
  }

  const htmlContent = buildInvoiceHTML({ orderId, date, customer, address, items, subtotal, shipping, total, paymentMethod });

  axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "Floral Heaven Orders",
        email: fromEmail.includes("<") ? fromEmail.match(/<(.*)>/)?.[1] : fromEmail,
      },
      to: [{ email: SUPPLIER_EMAIL, name: "Floral Heaven Supplier" }],
      subject: `🌸 New Order ${orderId} — ₹${Math.round(total)} — ${paymentMethod}`,
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
  ).catch((err) => {
    console.error("Order invoice email error:", err.response?.data || err.message);
  });

  return true;
};

// ─── Send confirmation to customer ───────────────────────────────────────────
export const sendOrderConfirmationToCustomer = ({ orderId, customerEmail, customerName, total, paymentMethod }) => {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;

  if (!BREVO_API_KEY || !fromEmail) return;

  const htmlContent = `
    <div style="font-family:'Segoe UI',Arial,sans-serif; max-width:500px; margin:0 auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      <div style="background:linear-gradient(135deg,#c2185b,#e91e8c); padding:32px; text-align:center;">
        <h1 style="color:#fff; margin:0; font-size:26px;">🌸 Floral Heaven</h1>
      </div>
      <div style="padding:32px;">
        <h2 style="color:#c2185b; margin-top:0;">Order Received! ✅</h2>
        <p style="color:#555; font-size:15px;">Hi <strong>${customerName}</strong>, thank you for your order!</p>
        <div style="background:#fdf6fb; border-radius:10px; padding:16px; margin:20px 0;">
          <p style="margin:4px 0; font-size:14px;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin:4px 0; font-size:14px;"><strong>Total:</strong> ₹${Math.round(total)}</p>
          <p style="margin:4px 0; font-size:14px;"><strong>Payment:</strong> ${paymentMethod === "COD" ? "Cash on Delivery" : "UPI / Online"}</p>
        </div>
        <p style="color:#555; font-size:14px;">Our team will reach out to you shortly to confirm your order and arrange delivery.</p>
        <p style="color:#555; font-size:14px;">You can also reach us on Instagram: <strong>@floral_heaven02</strong></p>
      </div>
      <div style="background:#fdf6fb; padding:16px; text-align:center; border-top:1px solid #f0e6f0;">
        <p style="margin:0; font-size:12px; color:#aaa;">🌸 Floral Heaven &nbsp;|&nbsp; @floral_heaven02</p>
      </div>
    </div>
  `;

  axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "Floral Heaven",
        email: fromEmail.includes("<") ? fromEmail.match(/<(.*)>/)?.[1] : fromEmail,
      },
      to: [{ email: customerEmail, name: customerName }],
      subject: `✅ Order Confirmed — ${orderId} | Floral Heaven`,
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
  ).catch((err) => {
    console.error("Customer confirmation email error:", err.response?.data || err.message);
  });

  return true;
};
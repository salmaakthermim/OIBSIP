import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"PizzaHub 🍕" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  return sendEmail({
    to: email,
    subject: 'Verify your PizzaHub email',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FFF8F3;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#FF4D00,#FF8C42);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:2rem;">🍕 PizzaHub</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">Verify your email address</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1A0500;margin-top:0;">Welcome to PizzaHub!</h2>
          <p style="color:#555;line-height:1.7;">Click the button below to verify your email and start ordering delicious pizzas.</p>
          <div style="text-align:center;margin:28px 0;">
            <a href="${url}" style="background:linear-gradient(135deg,#FF4D00,#FF8C42);color:#fff;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:800;font-size:1rem;box-shadow:0 6px 24px rgba(255,77,0,0.35);">
              Verify Email ✓
            </a>
          </div>
          <p style="color:#aaa;font-size:0.85rem;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
        </div>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  return sendEmail({
    to: email,
    subject: 'Reset your PizzaHub password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FFF8F3;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#FF4D00,#FF8C42);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:2rem;">🍕 PizzaHub</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">Password Reset Request</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1A0500;margin-top:0;">Reset Your Password</h2>
          <p style="color:#555;line-height:1.7;">You requested a password reset. Click the button below to set a new password.</p>
          <div style="text-align:center;margin:28px 0;">
            <a href="${url}" style="background:linear-gradient(135deg,#FF4D00,#FF8C42);color:#fff;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:800;font-size:1rem;box-shadow:0 6px 24px rgba(255,77,0,0.35);">
              Reset Password →
            </a>
          </div>
          <p style="color:#aaa;font-size:0.85rem;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `,
  });
};

export const sendLowStockAlert = async (ingredients) => {
  const rows = ingredients.map(ing =>
    `<tr style="border-bottom:1px solid #EDE0D8;">
      <td style="padding:10px 16px;font-weight:600;color:#1A0500;">${ing.name}</td>
      <td style="padding:10px 16px;text-transform:capitalize;color:#888;">${ing.category}</td>
      <td style="padding:10px 16px;color:#EF4444;font-weight:800;">${ing.stock}</td>
      <td style="padding:10px 16px;color:#F59E0B;">${ing.lowStockThreshold}</td>
    </tr>`
  ).join('');

  return sendEmail({
    to: process.env.EMAIL_USER,
    subject: `⚠️ PizzaHub Low Stock Alert — ${ingredients.length} item(s) need restocking`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;background:#FFF8F3;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#EF4444,#F97316);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:2rem;">⚠️ Low Stock Alert</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">PizzaHub Inventory Management</p>
        </div>
        <div style="padding:32px;">
          <p style="color:#555;line-height:1.7;margin-top:0;">The following ingredients are below their low-stock threshold and need immediate restocking:</p>
          <table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;border:1px solid #EDE0D8;">
            <thead>
              <tr style="background:#FF4D00;color:#fff;">
                <th style="padding:12px 16px;text-align:left;">Ingredient</th>
                <th style="padding:12px 16px;text-align:left;">Category</th>
                <th style="padding:12px 16px;text-align:left;">Current Stock</th>
                <th style="padding:12px 16px;text-align:left;">Threshold</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="color:#aaa;font-size:0.85rem;margin-top:24px;">Please log in to the admin panel to update stock levels.</p>
        </div>
      </div>
    `,
  });
};

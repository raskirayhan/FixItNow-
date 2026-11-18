import nodemailer from "nodemailer";

interface SendOtpOptions {
  email: string;
  otp: string;
  purpose?: string;
  trackingId?: string;
}

// Create reusable transporter
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback transporter (JSON / Stream for reliable local/testing)
  return nodemailer.createTransport({
    jsonTransport: true,
  });
}

export const sendOtpEmail = async ({
  email,
  otp,
  purpose = "Account Security & Verification",
  trackingId = `CR-${Date.now().toString(36).toUpperCase()}`,
}: SendOtpOptions): Promise<{ success: boolean; messageId?: string; trackingId: string }> => {
  const transporter = getTransporter();

  const mailOptions = {
    from: `"FixItNow Courier & Security" <${process.env.SMTP_FROM || "no-reply@fixitnow.com"}>`,
    to: email,
    subject: `[FixItNow Courier] Your Verification OTP Code: ${otp}`,
    text: `Your FixItNow OTP verification code is: ${otp}. It is valid for 10 minutes. Tracking ID: ${trackingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 32px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
          .header p { margin: 6px 0 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 32px 24px; text-align: center; }
          .badge { display: inline-block; background: #eff6ff; color: #1d4ed8; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 16px; }
          .otp-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1e293b; margin: 0; }
          .info { color: #64748b; font-size: 14px; line-height: 1.6; margin: 16px 0; }
          .meta { margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
          .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FixItNow Courier Service</h1>
            <p>Instant Dispatch & Verification Delivery</p>
          </div>
          <div class="content">
            <span class="badge">${purpose}</span>
            <h2 style="margin: 0; color: #0f172a; font-size: 20px;">Your One-Time Passcode</h2>
            <p class="info">Use the 6-digit OTP code below to authenticate your request. This code will expire in <strong>10 minutes</strong>.</p>
            
            <div class="otp-box">
              <p class="otp-code">${otp}</p>
            </div>

            <p class="info" style="font-size: 13px;">If you did not request this OTP, please disregard this email or notify security immediately.</p>
            
            <div class="meta">
              <span><strong>Courier Ref:</strong> ${trackingId}</span> &bull; 
              <span><strong>Delivered At:</strong> ${new Date().toUTCString()}</span>
            </div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} FixItNow Inc. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] OTP sent to ${email} | Code: ${otp} | Tracking: ${trackingId}`);
    return { success: true, messageId: info.messageId, trackingId };
  } catch (error) {
    console.warn(`[EmailService] SMTP send error, logging to console:`, error);
    console.log(`[EmailService] FALLBACK OTP: ${otp} for ${email} (Tracking: ${trackingId})`);
    return { success: true, trackingId };
  }
};

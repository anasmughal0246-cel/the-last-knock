const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, username, token) => {
  const verifyUrl = `http://localhost:5000/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '🩸 Verify Your Soul — The Last Knock',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="background:#0a0a0a;color:#e8e8e8;font-family:Georgia,serif;padding:40px;margin:0;">
        <div style="max-width:500px;margin:0 auto;background:#111;border:1px solid #2a2a2a;border-radius:12px;padding:40px;">
          <h1 style="font-size:2.5rem;color:#c0392b;text-align:center;margin-bottom:8px;font-family:Georgia,serif;">
            The Last Knock
          </h1>
          <p style="text-align:center;color:#666;font-style:italic;margin-bottom:32px;">
            Your soul awaits verification...
          </p>
          <p style="color:#aaa;font-size:1.1rem;line-height:1.7;">
            Hello <strong style="color:#e8e8e8;">${username}</strong>,
          </p>
          <p style="color:#aaa;font-size:1.1rem;line-height:1.7;">
            You have signed the contract. One final step remains before you may enter the dark.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${verifyUrl}"
               style="background:#8b0000;color:#fff;padding:16px 36px;border-radius:6px;text-decoration:none;font-family:monospace;font-size:14px;letter-spacing:0.1em;border:1px solid #c0392b;">
              VERIFY MY SOUL
            </a>
          </div>
          <p style="color:#555;font-size:0.85rem;text-align:center;margin-top:24px;">
            This link expires in 24 hours. If you did not register, ignore this email.
          </p>
          <div style="border-top:1px solid #2a2a2a;margin-top:32px;padding-top:20px;text-align:center;">
            <p style="color:#333;font-size:0.8rem;">© 2025 The Last Knock</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};

module.exports = { sendVerificationEmail };
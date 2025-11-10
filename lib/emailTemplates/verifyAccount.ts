export function renderVerificationEmail(displayName: string, url: string) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#11092a;padding:32px 0;font-family:'Inter','Segoe UI',system-ui,-apple-system,sans-serif;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#19143e;border-radius:24px;padding:48px;border:1px solid rgba(140,133,255,0.22);box-shadow:0 40px 120px rgba(31,19,70,0.55);color:#d6dbf4;">
          <tr>
            <td style="text-align:center;">
              <div style="display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:18px;background:linear-gradient(135deg,#673de6,#8c85ff);color:#ffffff;font-weight:600;font-size:20px;">SC</div>
              <h1 style="margin:28px 0 12px;font-size:26px;font-weight:700;color:#ffffff;">Confirm your email</h1>
              <p style="margin:0 0 32px;font-size:16px;line-height:1.6;color:#c8ceef;">
                Hi ${displayName.split(' ')[0] || 'there'}, welcome to SimplyCode!<br />
                Please confirm your email address to activate your account.
              </p>
              <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#20e052,#bded00);color:#0b0a1d;font-size:15px;font-weight:600;padding:16px 34px;border-radius:999px;text-decoration:none;letter-spacing:0.14em;text-transform:uppercase;">
                Verify email
              </a>
              <p style="margin:34px 0 0;font-size:13px;line-height:1.5;color:#a3a7c7;">
                This link will expire in 24 hours. If the button doesn’t work, copy and paste this link into your browser:<br />
                <span style="word-break:break-all;color:#8c85ff;">${url}</span>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin-top:24px;font-size:12px;color:#7d81a3;">If you didn’t create an account, you can safely ignore this email.</p>
      </td>
    </tr>
  </table>
  `
}

export function renderVerificationText(url: string, senderName: string) {
  return `Welcome to SimplyCode!

Please confirm your email address to activate your account:
${url}

This link will expire in 24 hours. If you didn’t create an account, you can ignore this email.

— ${senderName}`
}


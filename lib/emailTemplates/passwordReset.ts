export function renderPasswordResetEmail(displayName: string, url: string) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:24px;padding:48px;border:1px solid rgba(255,255,255,0.08);box-shadow:0 40px 120px rgba(15,23,42,0.45);color:#e2e8f0;">
          <tr>
            <td style="text-align:center;">
              <div style="display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:18px;background:linear-gradient(135deg,#ec4899,#6366f1);color:#fff;font-weight:600;font-size:20px;">SC</div>
              <h1 style="margin:28px 0 12px;font-size:26px;font-weight:700;color:#fff;">Reset your password</h1>
              <p style="margin:0 0 32px;font-size:16px;line-height:1.6;color:#cbd5f5;">
                Hi ${displayName.split(' ')[0] || 'there'}, we received a request to reset your SimplyCode password.<br />
                Click the button below to choose a new password.
              </p>
              <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#f8fafc;font-size:15px;font-weight:600;padding:16px 34px;border-radius:999px;text-decoration:none;letter-spacing:0.14em;text-transform:uppercase;">
                Reset password
              </a>
              <p style="margin:34px 0 0;font-size:13px;line-height:1.5;color:#94a3b8;">
                This link will expire in 60 minutes. If you didn’t request a password reset, you can safely ignore this email.<br />
                <span style="display:block;margin-top:16px;word-break:break-all;color:#38bdf8;">${url}</span>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin-top:24px;font-size:12px;color:#64748b;">— SimplyCode support</p>
      </td>
    </tr>
  </table>
  `
}

export function renderPasswordResetText(url: string, senderName: string) {
  return `Hi there,

We received a request to reset your SimplyCode password.

Use the link below to choose a new password:
${url}

This link expires in 60 minutes. If you didn’t request a password reset, you can ignore this email.

— ${senderName}`
}


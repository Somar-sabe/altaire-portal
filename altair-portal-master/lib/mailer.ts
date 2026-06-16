/**
 * @file lib/mailer.ts
 * @purpose Nodemailer helpers for invitation and audit alert emails.
 * @dependencies nodemailer
 *
 * Security notes:
 *  - All user-controlled values are HTML-encoded before interpolation (escapeHtml).
 *  - Error messages returned to callers are STATIC; raw error.message is never forwarded.
 *  - AUDIT_ALERT_EMAIL must be set in env; missing value throws (no hardcoded fallback).
 */

import nodemailer from 'nodemailer';

// ---------------------------------------------------------------------------
// HTML escape helper — prevents injection of user-controlled values into email HTML.
// ---------------------------------------------------------------------------

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------------------------------------------------------------------------
// Invitation email
// ---------------------------------------------------------------------------

export interface InvitationEmailPayload {
  to: string;
  inviteLink: string;
  department: string;
  role: string;
}

export async function sendInvitationEmail(
  payload: InvitationEmailPayload
): Promise<{ success: boolean; message: string }> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? '"Altair Unified Portal" <noreply@acme.com>';

  const safeDept = escapeHtml(payload.department);
  const safeRole = escapeHtml(payload.role);
  const safeLink = escapeHtml(payload.inviteLink);

  const emailHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;background-color:#ffffff;">
      <h2 style="color:#0f172a;margin-bottom:5px;">You've been invited!</h2>
      <p style="color:#64748b;font-size:14px;margin-top:0;">Altair Platform Invitation</p>
      <hr style="border:0;border-top:1px solid #e2e8f0;margin:20px 0;" />
      <p style="font-size:15px;color:#334155;line-height:1.5;">
        Hello,<br/><br/>
        You have been formally invited to join the <strong>Altair Unified SaaS Platform</strong>.
      </p>
      <div style="background-color:#f8fafc;padding:15px;border-radius:8px;margin:20px 0;border-left:4px solid #10b981;">
        <ul style="margin:0;padding-left:20px;color:#475569;font-size:14px;line-height:1.6;">
          <li><strong>Department:</strong> ${safeDept}</li>
          <li><strong>Role:</strong> ${safeRole}</li>
        </ul>
      </div>
      <div style="text-align:center;margin-bottom:30px;">
        <a href="${safeLink}" style="background-color:#0f172a;color:#ffffff;text-decoration:none;padding:12px 24px;font-size:14px;font-weight:bold;border-radius:6px;display:inline-block;">
          Accept Invitation &amp; Join
        </a>
      </div>
      <p style="font-size:12px;color:#94a3b8;line-height:1.4;">
        If you cannot click the button, copy and paste this URL into your browser:<br/>
        <span style="word-break:break-all;color:#3b82f6;">${safeLink}</span>
      </p>
      <hr style="border:0;border-top:1px solid #e2e8f0;margin:20px 0;" />
      <p style="font-size:11px;color:#94a3b8;margin:0;text-align:center;">
        This email was sent by the Altair Administration system.
      </p>
    </div>
  `;

  if (!host || !user || !pass) {
    console.log('INVITATION EMAIL (SMTP not configured): to=%s role=%s dept=%s', payload.to, payload.role, payload.department);
    return { success: false, message: 'Email logged in system console (SMTP is not configured yet in settings).' };
  }

  try {
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    await transporter.sendMail({ from, to: payload.to, subject: 'Formal Invitation to join the Altair Platform', html: emailHtml });
    return { success: true, message: 'Invitation sent successfully.' };
  } catch (error: unknown) {
    console.error('Mailer invitation error:', error);
    return { success: false, message: 'Failed to send invitation email.' };
  }
}

// ---------------------------------------------------------------------------
// Lead deletion audit email
// ---------------------------------------------------------------------------

export interface LeadDeletionEmailPayload {
  leadName: string;
  deletedBy: string;
  reason: string;
  date: string;
}

export async function sendLeadDeletionEmail(
  payload: LeadDeletionEmailPayload
): Promise<{ success: boolean; message: string }> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? '"Altair Unified Portal" <noreply@acme.com>';

  const safeName = escapeHtml(payload.leadName);
  const safeBy   = escapeHtml(payload.deletedBy);
  const safeReason = escapeHtml(payload.reason);
  const safeDate = escapeHtml(payload.date);

  const emailHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #f1f5f9;border-radius:10px;background-color:#ffffff;">
      <h2 style="color:#e11d48;margin-bottom:5px;">ALERT: Lead Deleted from Platform</h2>
      <p style="color:#64748b;font-size:14px;margin-top:0;">Altair Platform Notification</p>
      <hr style="border:0;border-top:1px solid #e2e8f0;margin:20px 0;" />
      <div style="background-color:#fff1f2;padding:15px;border-radius:8px;margin:20px 0;border-left:4px solid #f43f5e;">
        <ul style="margin:0;padding-left:20px;color:#475569;font-size:14px;line-height:1.8;list-style-type:square;">
          <li><strong>Lead Name:</strong> ${safeName}</li>
          <li><strong>Deleted By:</strong> ${safeBy}</li>
          <li><strong>Documented Reason:</strong> ${safeReason}</li>
          <li><strong>Timestamp (UTC):</strong> ${safeDate}</li>
        </ul>
      </div>
      <hr style="border:0;border-top:1px solid #e2e8f0;margin:20px 0;" />
      <p style="font-size:11px;color:#94a3b8;margin:0;text-align:center;">
        This email was automatically generated by the Altair Administration system.
      </p>
    </div>
  `;

  if (!host || !user || !pass) {
    console.log('LEAD DELETION EMAIL (SMTP not configured): lead=%s deletedBy=%s', payload.leadName, payload.deletedBy);
    return { success: false, message: 'Email logged in system console (SMTP is not configured yet).' };
  }

  const auditEmail = process.env.AUDIT_ALERT_EMAIL;
  if (!auditEmail) {
    throw new Error('AUDIT_ALERT_EMAIL env var is not configured');
  }

  try {
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    await transporter.sendMail({ from, to: auditEmail, subject: `[ALERT] Lead Deletion: ${payload.leadName}`, html: emailHtml });
    return { success: true, message: 'Deletion alert sent successfully.' };
  } catch (error: unknown) {
    console.error('Mailer deletion error:', error);
    return { success: false, message: 'Failed to send deletion alert.' };
  }
}

// ---------------------------------------------------------------------------
// Generic send email
// ---------------------------------------------------------------------------

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail(
  payload: SendEmailPayload
): Promise<{ success: boolean; message: string }> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? '"Altair Unified Portal" <noreply@acme.com>';

  if (!host || !user || !pass) {
    console.log('SEND EMAIL (SMTP not configured): to=%s subject=%s', payload.to, payload.subject);
    return { success: false, message: 'Email logged in system console (SMTP is not configured).' };
  }

  try {
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    await transporter.sendMail({ from, to: payload.to, subject: payload.subject, text: payload.body });
    return { success: true, message: 'Email sent successfully.' };
  } catch (error: unknown) {
    console.error('Mailer send error:', error);
    return { success: false, message: 'Failed to send email.' };
  }
}

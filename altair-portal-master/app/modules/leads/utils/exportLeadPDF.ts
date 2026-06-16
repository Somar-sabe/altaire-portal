/**
 * @file /app/modules/leads/utils/exportLeadPDF.ts
 * @description Generates and prints a PDF profile for a lead.
 * @dependencies window.open, @/app/modules/leads/store
 * @workplan WP-030
 */

import { LrmLead, LeadComment } from '../store';

export function exportLeadPDF(
  lead: LrmLead,
  comments: LeadComment[],
  isSuperAdminOrAdmin: boolean,
  currentUser: any
) {
  const printWindow = window.open('', '', 'height=600,width=800');
  if (!printWindow) return;

  const displayedPhone = isSuperAdminOrAdmin ? lead.phone : lead.phone.replace(/(\d{4})\d{4,}(\d{2})/, '$1 ****** $2');
  const displayedEmail = isSuperAdminOrAdmin ? lead.email : lead.email.replace(/(.{2}).+@(.+)/, '$1***@$2');

  const interactionsHtml = comments.map(c => `
    <div style="border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 10px;">
      <strong>[${new Date(c.createdAt).toLocaleString()}] ${c.authorName} (${c.authorRole})</strong>
      ${c.isReminder ? '<span style="background:#fff3cd; color:#856404; padding:2px 5px; font-size:10px; border-radius:3px;">Reminder</span>' : ''}
      <p style="white-space: pre-wrap; margin-top: 4px;">${c.content}</p>
    </div>
  `).join('');

  const htmlContent = `
    <html>
      <head>
        <title>Lead Export - ${lead.name}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          h1 { font-size: 24px; margin-bottom: 5px; }
          h2 { font-size: 18px; color: #555; border-bottom: 2px solid #eee; padding-bottom: 5px; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
          th { width: 30%; color: #666; }
          .badge { display: inline-block; padding: 3px 8px; background: #eee; border-radius: 4px; font-size: 12px; font-weight: bold; margin-right: 5px; }
        </style>
      </head>
      <body>
        <h1>Lead Profile: ${lead.name}</h1>
        <p><strong>Company/Target:</strong> ${lead.company} &middot; ${lead.targetProject}</p>
        <p><span class="badge">${lead.stage}</span> <span class="badge">${(lead.tags || []).join(', ') || 'Unassigned'}</span></p>
        
        <h2>Contact Information</h2>
        <table>
          <tr><th>Phone</th><td>${displayedPhone}</td></tr>
          ${lead.altPhone ? `<tr><th>Alt Phone</th><td>${lead.altPhone}</td></tr>` : ''}
          <tr><th>Email</th><td>${displayedEmail}</td></tr>
          ${lead.whatsapp ? `<tr><th>WhatsApp</th><td>${lead.whatsapp}</td></tr>` : ''}
          <tr><th>Language</th><td>${lead.lang || 'N/A'}</td></tr>
          <tr><th>Country</th><td>${lead.country || 'Worldwide'}</td></tr>
        </table>

        <h2>Lead Specifics</h2>
        <table>
          <tr><th>Date Created</th><td>${lead.dateCreated}</td></tr>
          <tr><th>Assigned Agent ID</th><td>${lead.assignedAgentId || 'Unassigned'}</td></tr>
        </table>

        ${lead.notes ? `<h2>Initial Notes</h2><p style="white-space: pre-wrap;">${lead.notes}</p>` : ''}

        <h2>Interaction History</h2>
        ${comments.length > 0 ? interactionsHtml : '<p>No interactions recorded.</p>'}
        
        <div style="margin-top: 40px; font-size: 11px; text-align: center; color: #999;">
          Confidential Lead Export generated on ${new Date().toLocaleString()} by ${currentUser?.firstName} ${currentUser?.lastName}.
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => printWindow.print(), 250);
}

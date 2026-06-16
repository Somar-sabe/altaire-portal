/**
 * @file /app/modules/leads/utils/generateExportHTML.ts
 * @purpose Generates the HTML content for the visual leads report.
 */

export function generateExportHTML(
  filtered: any[],
  filterStage: string,
  filterTag: string,
  filterAgent: string,
  stagesKeys: string[],
  stageCounts: number[],
  topTags: [string, number][]
) {
  const totalLeads = filtered.length;
  const totalVal = filtered.reduce((sum, current) => sum + current.value, 0);
  const convertedLeads = filtered.filter(l => l.stage === 'Converted' || l.stage === 'Booked').length;
  const convRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Executive Leads Report</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; color: #0f172a; padding: 40px; margin: 0; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
          .header h1 { margin: 0 0 10px 0; font-size: 28px; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; }
          .header p { margin: 0; color: #64748b; font-size: 14px; }
          .kpi-grid { display: flex; gap: 20px; margin-bottom: 30px; }
          .kpi-card { flex: 1; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .kpi-value { font-size: 32px; font-weight: 900; color: #4f46e5; margin: 10px 0 5px 0; }
          .kpi-label { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b; letter-spacing: 0.5px; }
          .charts-grid { display: flex; gap: 20px; margin-bottom: 30px; }
          .chart-card { flex: 1; min-width: 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .chart-card h3 { margin-top: 0; font-size: 14px; text-transform: uppercase; color: #334155; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
          .chart-container-bar { height: 260px; position: relative; }
          .chart-container-pie { height: 260px; position: relative; display: flex; justify-content: center; }
          table { width: 100%; background: #fff; border-collapse: separate; border-spacing: 0; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
          th, td { padding: 12px 15px; text-align: left; font-size: 12px; }
          th { background: #f8fafc; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; font-size: 10px; border-bottom: 1px solid #e2e8f0; }
          td { border-bottom: 1px solid #f1f5f9; color: #334155; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; background: #e0e7ff; color: #3730a3; }
          .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; }
          @media print { body { background: #fff; } .kpi-card, .chart-card, table { box-shadow: none; border: 1px solid #cbd5e1; } .chart-container-bar, .chart-container-pie { break-inside: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Visual Pipeline Report</h1>
          <p>Generated on ${new Date().toLocaleString()} &bull; Filters: Stage (${filterStage}), Quality (${filterTag}), Agent (${filterAgent})</p>
        </div>
        <div class="kpi-grid">
          <div class="kpi-card"><div class="kpi-label">Total Leads</div><div class="kpi-value">${totalLeads}</div></div>
          <div class="kpi-card"><div class="kpi-label">Total Pipeline Value</div><div class="kpi-value">${totalVal.toLocaleString()}</div></div>
          <div class="kpi-card"><div class="kpi-label">Converted/Booked</div><div class="kpi-value">${convertedLeads}</div></div>
          <div class="kpi-card"><div class="kpi-label">Conversion Rate</div><div class="kpi-value">${convRate}%</div></div>
        </div>
        <div class="charts-grid">
          <div class="chart-card"><h3>Pipeline Distribution by Stage</h3><div class="chart-container-bar"><canvas id="stageChart"></canvas></div></div>
          <div class="chart-card"><h3>Lead Quality Breakdown</h3><div class="chart-container-pie"><canvas id="qualityChart"></canvas></div></div>
        </div>
        <div class="chart-card" style="margin-bottom: 30px;">
          <h3>Recent Pipeline Data (Max 20 rows)</h3>
          <table>
            <thead><tr><th>Lead Name</th><th>Stage</th><th>Quality</th><th>Value</th><th>Created</th></tr></thead>
            <tbody>
              ${filtered.slice(0, 20).map(l => `<tr><td><strong>${l.name}</strong></td><td><span class="badge">${l.stage}</span></td><td>${(l.tags || []).join(', ') || 'Unassigned'}</td><td>${l.value.toLocaleString()}</td><td>${l.dateCreated}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="footer">End of Report &bull; Altair CRM Export</div>
        <script>
          window.onload = function() {
            const stageCtx = document.getElementById('stageChart').getContext('2d');
            new Chart(stageCtx, {
              type: 'bar',
              data: { labels: ${JSON.stringify(stagesKeys)}, datasets: [{ label: 'Leads Count', data: ${JSON.stringify(stageCounts)}, backgroundColor: '#6366f1', borderRadius: 4 }] },
              options: { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
            });
            const qualityCtx = document.getElementById('qualityChart').getContext('2d');
            new Chart(qualityCtx, {
              type: 'doughnut',
              data: { labels: ${JSON.stringify(topTags.map(t => t[0]))}, datasets: [{ data: ${JSON.stringify(topTags.map(t => t[1]))}, backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'] }] },
              options: { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 10 } } } } }
            });
            setTimeout(() => window.print(), 800);
          };
        </script>
      </body>
    </html>
  `;
}

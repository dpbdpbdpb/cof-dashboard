---
title: COF Portfolio Dashboard
---

# COF Portfolio Dashboard

```js
// Load data
const linearData = FileAttachment("../data/linear-issues.json").json();
const config = FileAttachment("../data/service-lines.json").json();
```

```js
// Brand colors
const brand = config.brand;
```

```js
// Service line selector
const serviceLineOptions = config.serviceLines.map(sl => ({value: sl.id, label: `${sl.icon} ${sl.name}`}));
const selectedServiceLine = view(Inputs.select(serviceLineOptions, {label: "Service Line", format: x => x.label, value: serviceLineOptions[0]}));
```

```js
// Current data
const currentSL = config.serviceLines.find(sl => sl.id === selectedServiceLine.value);
const currentIssues = linearData[selectedServiceLine.value] || [];
const currentLeaders = config.pillarLeaders[selectedServiceLine.value];
```

<!-- Hero Section -->
<div class="hero-section compact">
  <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
    <div style="font-size: 48px;">${currentSL.icon}</div>
    <div>
      <h1>${currentSL.name} Service Line</h1>
      <p style="opacity: 0.9; margin: 0;">Clinical-Operational-Financial Three-Pillar Governance</p>
    </div>
  </div>
  
  <div class="stat-grid" style="grid-template-columns: repeat(4, 1fr);">
    <div class="stat-card">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8;">Active Items</div>
      <div style="font-size: 36px; font-weight: 800;">${currentIssues.length}</div>
    </div>
    <div class="stat-card">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8;">💰 Projected Savings</div>
      <div style="font-size: 28px; font-weight: 800;">${calculateSavings(currentIssues)}</div>
    </div>
    <div class="stat-card">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8;">📈 New Revenue</div>
      <div style="font-size: 28px; font-weight: 800;">${calculateRevenue(currentIssues)}</div>
    </div>
    <div class="stat-card">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8;">Clinical Champion</div>
      <div style="font-size: 18px; font-weight: 700;">${currentLeaders.clinical}</div>
    </div>
  </div>
</div>

```js
function calculateSavings(issues) {
  let low = 0, high = 0;
  issues.forEach(i => {
    if (i.projectedSavings) {
      const match = i.projectedSavings.match(/\$?([\d.]+)(?:-([\d.]+))?\s*M?/i);
      if (match) {
        low += parseFloat(match[1]);
        high += match[2] ? parseFloat(match[2]) : parseFloat(match[1]);
      }
    }
  });
  if (low === 0) return "—";
  return low === high ? `$${low}M` : `$${low}-${high}M`;
}

function calculateRevenue(issues) {
  let low = 0, high = 0;
  issues.forEach(i => {
    if (i.projectedRevenue) {
      const match = i.projectedRevenue.match(/\$?([\d.]+)(?:-([\d.]+))?\s*M?/i);
      if (match) {
        low += parseFloat(match[1]);
        high += match[2] ? parseFloat(match[2]) : parseFloat(match[1]);
      }
    }
  });
  if (low === 0) return "—";
  return low === high ? `$${low}M` : `$${low}-${high}M`;
}
```

## Three-Pillar Representatives

<div class="grid-3" style="margin-bottom: 32px;">
  <div class="card" style="background: ${brand.magenta}10; border-left: 4px solid ${brand.magenta};">
    <h4 style="color: ${brand.magenta}; margin-bottom: 8px;">Clinical Pillar</h4>
    <div style="font-size: 16px; font-weight: 600;">${currentLeaders.clinical}</div>
  </div>
  <div class="card" style="background: ${brand.purple}10; border-left: 4px solid ${brand.purple};">
    <h4 style="color: ${brand.purple}; margin-bottom: 8px;">Operations Pillar</h4>
    <div style="font-size: 16px; font-weight: 600;">${currentLeaders.operations}</div>
  </div>
  <div class="card" style="background: ${brand.teal}10; border-left: 4px solid ${brand.teal};">
    <h4 style="color: ${brand.teal}; margin-bottom: 8px;">Financial Pillar</h4>
    <div style="font-size: 16px; font-weight: 600;">${currentLeaders.financial}</div>
  </div>
</div>

## Product & Sourcing Kanban

```js
// Render Kanban board
function renderKanban(issues, kanbanStates, swimlanes, columnDescriptions) {
  const columns = kanbanStates;
  
  return html`
    <div class="card" style="padding: 24px; overflow-x: auto;">
      <!-- Column Headers -->
      <div style="display: grid; grid-template-columns: 180px repeat(${columns.length}, 1fr); gap: 8px; margin-bottom: 12px; min-width: 1000px;">
        <div style="font-size: 11px; color: ${brand.grayLight}; padding: 4px 8px;">Archetype</div>
        ${columns.map(col => html`
          <div style="font-size: 11px; font-weight: 600; color: white; background: ${col.color}; padding: 8px; border-radius: 6px; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${col.label}
          </div>
        `)}
      </div>
      
      <!-- Swimlanes -->
      ${swimlanes.map(swimlane => {
        const swimlaneIssues = issues.filter(i => i.archetype === swimlane.id);
        const descriptions = columnDescriptions[swimlane.id];
        
        return html`
          <div style="margin-bottom: 20px; min-width: 1000px;">
            <!-- Swimlane Header -->
            <div style="display: grid; grid-template-columns: 180px repeat(${columns.length}, 1fr); gap: 8px; margin-bottom: 4px;">
              <div style="font-size: 12px; font-weight: 600; color: ${swimlane.color}; background: ${swimlane.color}15; padding: 10px; border-radius: 8px; overflow: hidden;">
                ${swimlane.label}
              </div>
              ${columns.map(col => html`
                <div style="font-size: 10px; color: ${brand.grayLight}; padding: 4px; line-height: 1.3; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                  ${descriptions[col.id]}
                </div>
              `)}
            </div>
            
            <!-- Issue Cards -->
            <div style="display: grid; grid-template-columns: 180px repeat(${columns.length}, 1fr); gap: 8px;">
              <div></div>
              ${columns.map(col => {
                const cellIssues = swimlaneIssues.filter(i => i.status === col.id);
                return html`
                  <div style="min-height: 60px; background: #f8fafc; border-radius: 6px; padding: 6px;">
                    ${cellIssues.map(issue => {
                      const isBlocked = issue.labels?.some(l => l.toLowerCase().includes('blocked'));
                      return html`
                        <a href="${issue.url}" target="_blank" style="display: block; background: white; border-radius: 6px; padding: 10px; margin-bottom: 6px; border: 1px solid ${isBlocked ? '#fca5a5' : '#e2e8f0'}; border-left: ${isBlocked ? '4px solid #ef4444' : '1px solid #e2e8f0'}; text-decoration: none; transition: all 0.2s;">
                          <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="font-size: 12px; font-weight: 600; color: ${brand.gray};">${issue.title}</div>
                            ${isBlocked ? html`<div style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444; flex-shrink: 0;"></div>` : ''}
                          </div>
                          <div style="font-size: 10px; color: ${brand.grayLight}; margin-top: 4px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${issue.brief}</div>
                          ${issue.projectedSavings || issue.projectedRevenue ? html`
                            <div style="font-size: 10px; margin-top: 6px; font-weight: 600;">
                              ${issue.projectedSavings ? html`<span style="color: ${brand.teal};">${issue.projectedSavings}</span>` : ''}
                              ${issue.projectedRevenue ? html`<span style="color: ${brand.magenta}; margin-left: 6px;">+${issue.projectedRevenue}</span>` : ''}
                            </div>
                          ` : ''}
                          <div style="font-size: 10px; color: ${brand.purple}; margin-top: 6px;">
                            🎯 ${issue.kaizenDate || 'TBD'}
                          </div>
                        </a>
                      `;
                    })}
                  </div>
                `;
              })}
            </div>
          </div>
        `;
      })}
    </div>
  `;
}
```

${renderKanban(currentIssues, config.kanbanStates, config.swimlanes, config.columnDescriptions)}

## Quantified Items

```js
const savingsItems = currentIssues.filter(i => i.projectedSavings);
const revenueItems = currentIssues.filter(i => i.projectedRevenue);
const quantifiedCount = new Set([...savingsItems, ...revenueItems].map(i => i.id)).size;
```

<div class="card">
  <h4 style="margin-bottom: 16px;">📊 Financial Quantification Progress</h4>
  
  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
    <span style="color: ${brand.grayLight}; font-size: 14px;">Items quantified</span>
    <span style="font-weight: 600;">${quantifiedCount} of ${currentIssues.length}</span>
  </div>
  
  <div style="width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; margin-bottom: 20px;">
    <div style="width: ${(quantifiedCount / currentIssues.length) * 100}%; height: 100%; background: ${brand.teal}; border-radius: 4px;"></div>
  </div>
  
  ${savingsItems.length > 0 || revenueItems.length > 0 ? html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${savingsItems.map(item => html`
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: ${brand.teal}08; border-radius: 6px;">
          <span style="color: ${brand.gray};">${item.title}</span>
          <span style="font-weight: 600; color: ${brand.teal};">${item.projectedSavings}</span>
        </div>
      `)}
      ${revenueItems.map(item => html`
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: ${brand.magenta}08; border-radius: 6px;">
          <span style="color: ${brand.gray};">${item.title}</span>
          <span style="font-weight: 600; color: ${brand.magenta};">+${item.projectedRevenue}</span>
        </div>
      `)}
    </div>
  ` : html`<p style="color: ${brand.grayLight};">No items quantified yet</p>`}
</div>

---

<div style="text-align: center; color: ${brand.grayLight}; font-size: 12px; margin-top: 32px;">
  Last updated: ${linearData.metadata?.lastUpdated ? new Date(linearData.metadata.lastUpdated).toLocaleString() : 'N/A'} | 
  <a href="https://linear.app/commonspirit" target="_blank" style="color: ${brand.purple};">Open Linear →</a>
</div>

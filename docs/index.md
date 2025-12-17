---
title: COF Portfolio Dashboard
---

```js
// ============================================
// CONFIGURATION & BRAND COLORS
// ============================================

const brand = {
  magenta: "#C4177A",
  magentaLight: "#E91E8C",
  magentaDark: "#9E1362",
  gray: "#54585A",
  grayLight: "#7A7D80",
  grayDark: "#3D4042",
  purple: "#6B3FA0",
  teal: "#008B8B",
  white: "#FFFFFF",
  warmWhite: "#FAFAFA",
  warmGray: "#F5F5F5"
};

const serviceLines = [
  { id: "cardiovascular", name: "Cardiovascular", icon: "❤️", color: brand.magenta, champion: "Dr. Nezar Falluji" },
  { id: "orthopedic", name: "Orthopedic", icon: "🦴", color: brand.teal, champion: "Dr. Ranjan Gupta" },
  { id: "neuroscience", name: "Neuroscience", icon: "🧠", color: brand.purple, champion: "Dr. Tom Devlin" },
];

const pillarLeaders = {
  cardiovascular: { clinical: "Dr. Nezar Falluji", operations: "TBD (Terika Designee)", financial: "TBD (JP Designee)" },
  orthopedic: { clinical: "Dr. Ranjan Gupta", operations: "TBD (Terika Designee)", financial: "TBD (JP Designee)" },
  neuroscience: { clinical: "Dr. Tom Devlin", operations: "TBD (Terika Designee)", financial: "TBD (JP Designee)" },
};

const kanbanStates = [
  { id: "Funnel", label: "Funnel", color: brand.grayLight },
  { id: "Reviewing", label: "Reviewing", color: brand.purple },
  { id: "Analyzing", label: "Analyzing", color: brand.teal },
  { id: "Backlog", label: "Backlog", color: "#D97706" },
  { id: "Implementing", label: "Implementing", color: brand.magenta },
  { id: "Done", label: "Done", color: brand.gray },
];

const swimlanes = [
  { id: "new-product", label: "📦 New Product Evaluation", color: brand.teal },
  { id: "re-evaluation", label: "🔄 Product Re-evaluation", color: "#D97706" },
  { id: "sourcing", label: "🎯 Sourcing Strategy", color: brand.magenta },
];

const columnDescriptions = {
  "new-product": {
    "Funnel": "Request received, initial triage",
    "Reviewing": "Evidence gathering, clinical review",
    "Analyzing": "Financial modeling, 3-pillar prep",
    "Backlog": "Awaiting Kaizen scheduling",
    "Implementing": "Pilot/rollout in progress",
    "Done": "Formulary decision complete",
  },
  "re-evaluation": {
    "Funnel": "Trigger identified (safety, evidence)",
    "Reviewing": "Lookback data collection",
    "Analyzing": "Impact assessment, alternatives",
    "Backlog": "Awaiting reassessment Kaizen",
    "Implementing": "Sustain/Modify/Remove action",
    "Done": "Reassessment complete",
  },
  "sourcing": {
    "Funnel": "Category identified, RFI/RFP prep",
    "Reviewing": "Vendor submissions, evaluations",
    "Analyzing": "Clinical equivalence, pricing",
    "Backlog": "Awaiting strategy Kaizen",
    "Implementing": "Contract execution, transition",
    "Done": "Contract live, savings realized",
  },
};
```

```js
// ============================================
// SAMPLE DATA (Replace with Linear API later)
// ============================================

const cardiovascularIssues = [
  { id: "COM-380", title: "AGENT Drug-Coated Balloon", brief: "Peripheral artery disease intervention", status: "Implementing", priority: "High", kaizenDate: "2025-10-08", champion: "Dr. Falluji", archetype: "new-product", completion: 90, projectedSavings: null, projectedRevenue: null },
  { id: "COM-386", title: "T/EVAR Sourcing", brief: "Aortic stent graft consolidation", status: "Implementing", priority: "High", kaizenDate: null, champion: "CVSL Council", archetype: "sourcing", completion: 75, projectedSavings: null, projectedRevenue: null },
  { id: "COM-387", title: "Renal Denervation", brief: "Resistant hypertension treatment hubs", status: "Analyzing", priority: "Medium", kaizenDate: null, champion: "Dr. Falluji", archetype: "new-product", completion: 65, projectedSavings: null, projectedRevenue: null },
  { id: "COM-396", title: "EVOQUE", brief: "Tricuspid valve replacement system", status: "Analyzing", priority: "Medium", kaizenDate: null, champion: "Dr. Falluji", archetype: "new-product", completion: 50, projectedSavings: null, projectedRevenue: null },
  { id: "COM-395", title: "DETOUR", brief: "Femoropopliteal bypass system", status: "Analyzing", priority: "Medium", kaizenDate: null, champion: "Dr. Falluji", archetype: "new-product", completion: 0, projectedSavings: null, projectedRevenue: null },
  { id: "COM-397", title: "ESPRIT-BTK", brief: "Below-the-knee drug-eluting stent", status: "Analyzing", priority: "Medium", kaizenDate: null, champion: "Dr. Falluji", archetype: "new-product", completion: 0, projectedSavings: null, projectedRevenue: null },
  { id: "COM-457", title: "GE Cath Lab Modernization", brief: "Imaging equipment standardization", status: "Implementing", priority: "Urgent", kaizenDate: null, champion: "Mary Osborne", archetype: "sourcing", completion: 60, projectedSavings: null, projectedRevenue: null },
];

const orthopedicIssues = [
  { id: "COM-381", title: "Hip/Knee Sourcing Strategy", brief: "$161M implant consolidation, 106→4 vendors", status: "Analyzing", priority: "Urgent", kaizenDate: "2026-01-12", champion: "Dr. Ranjan Gupta", archetype: "sourcing", completion: 60, projectedSavings: "$10-16M", projectedRevenue: null },
  { id: "COM-426", title: "Trauma & Distal Extremity", brief: "$84M nails, plates, external fixation", status: "Funnel", priority: "High", kaizenDate: null, champion: "Dr. Cliff Jones", archetype: "sourcing", completion: 20, projectedSavings: null, projectedRevenue: null },
  { id: "COM-427", title: "Sports Medicine Sourcing", brief: "$42M anchors, shavers, RF pumps", status: "Funnel", priority: "Medium", kaizenDate: null, champion: "TBD", archetype: "sourcing", completion: 40, projectedSavings: null, projectedRevenue: null },
  { id: "COM-428", title: "Spine Sourcing Strategy", brief: "$94M implants, 50 vendors, ortho+neuro", status: "Funnel", priority: "High", kaizenDate: null, champion: "TBD", archetype: "sourcing", completion: 30, projectedSavings: null, projectedRevenue: null },
  { id: "COM-425", title: "Shoulders Sourcing", brief: "$38M total/reverse shoulder implants", status: "Funnel", priority: "Medium", kaizenDate: null, champion: "TBD", archetype: "sourcing", completion: 25, projectedSavings: null, projectedRevenue: null },
];

const neuroscienceIssues = [
  { id: "COM-383", title: "Robotic TCD for PFO Detection", brief: "Automated stroke risk screening, 3x better than echo", status: "Reviewing", priority: "High", kaizenDate: "2026-01-15", champion: "Dr. Tom Devlin", archetype: "new-product", completion: 75, projectedSavings: null, projectedRevenue: null },
  { id: "COM-307", title: "Medivis AI Navigation", brief: "AR surgical navigation for spine procedures", status: "Reviewing", priority: "Medium", kaizenDate: null, champion: "TBD", archetype: "new-product", completion: 20, projectedSavings: null, projectedRevenue: null, labels: ["blocked"] },
];

const allData = {
  cardiovascular: cardiovascularIssues,
  orthopedic: orthopedicIssues,
  neuroscience: neuroscienceIssues,
};
```

```js
// ============================================
// SERVICE LINE SELECTOR
// ============================================

const serviceLineSelect = view(Inputs.select(serviceLines, {
  label: "Service Line",
  format: sl => `${sl.icon} ${sl.name}`,
  value: serviceLines[0]
}));
```

```js
// ============================================
// CURRENT DATA
// ============================================

const currentSL = serviceLineSelect;
const currentIssues = allData[currentSL.id] || [];
const currentLeaders = pillarLeaders[currentSL.id];
```

```js
// ============================================
// HELPER FUNCTIONS
// ============================================

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

## Three-Pillar Representatives

<div class="grid-3" style="margin-bottom: 32px;">
  <div class="card" style="border-left: 4px solid ${brand.magenta};">
    <h4 style="color: ${brand.magenta}; margin-bottom: 8px;">Clinical Pillar</h4>
    <div style="font-size: 16px; font-weight: 600;">${currentLeaders.clinical}</div>
  </div>
  <div class="card" style="border-left: 4px solid ${brand.purple};">
    <h4 style="color: ${brand.purple}; margin-bottom: 8px;">Operations Pillar</h4>
    <div style="font-size: 16px; font-weight: 600;">${currentLeaders.operations}</div>
  </div>
  <div class="card" style="border-left: 4px solid ${brand.teal};">
    <h4 style="color: ${brand.teal}; margin-bottom: 8px;">Financial Pillar</h4>
    <div style="font-size: 16px; font-weight: 600;">${currentLeaders.financial}</div>
  </div>
</div>

## Product & Sourcing Kanban

```js
// Render Kanban board
function renderKanban(issues) {
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
                <div style="font-size: 10px; color: ${brand.grayLight}; padding: 4px; line-height: 1.3; overflow: hidden;">
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
                      const isBlocked = issue.labels?.some(l => l.toLowerCase().includes("blocked"));
                      return html`
                        <a href="https://linear.app/commonspirit/issue/${issue.id}" target="_blank" style="display: block; background: white; border-radius: 6px; padding: 10px; margin-bottom: 6px; border: 1px solid ${isBlocked ? '#fca5a5' : '#e2e8f0'}; border-left: ${isBlocked ? '4px solid #ef4444' : '1px solid #e2e8f0'}; text-decoration: none; transition: all 0.2s;">
                          <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="font-size: 12px; font-weight: 600; color: ${brand.gray};">${issue.title}</div>
                            ${isBlocked ? html`<div style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444; flex-shrink: 0;"></div>` : ""}
                          </div>
                          <div style="font-size: 10px; color: ${brand.grayLight}; margin-top: 4px;">${issue.brief}</div>
                          ${issue.projectedSavings || issue.projectedRevenue ? html`
                            <div style="font-size: 10px; margin-top: 6px; font-weight: 600;">
                              ${issue.projectedSavings ? html`<span style="color: ${brand.teal};">${issue.projectedSavings}</span>` : ""}
                              ${issue.projectedRevenue ? html`<span style="color: ${brand.magenta}; margin-left: 6px;">+${issue.projectedRevenue}</span>` : ""}
                            </div>
                          ` : ""}
                          <div style="font-size: 10px; color: ${brand.purple}; margin-top: 6px;">
                            🎯 ${issue.kaizenDate || "TBD"}
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

${renderKanban(currentIssues)}

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
    <div style="width: ${(quantifiedCount / Math.max(currentIssues.length, 1)) * 100}%; height: 100%; background: ${brand.teal}; border-radius: 4px;"></div>
  </div>
  
  ${savingsItems.length > 0 || revenueItems.length > 0 ? html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${savingsItems.map(item => html`
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #f0fdfa; border-radius: 6px;">
          <span style="color: ${brand.gray};">${item.title}</span>
          <span style="font-weight: 600; color: ${brand.teal};">${item.projectedSavings}</span>
        </div>
      `)}
      ${revenueItems.map(item => html`
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #fdf4f8; border-radius: 6px;">
          <span style="color: ${brand.gray};">${item.title}</span>
          <span style="font-weight: 600; color: ${brand.magenta};">+${item.projectedRevenue}</span>
        </div>
      `)}
    </div>
  ` : html`<p style="color: ${brand.grayLight};">No items quantified yet</p>`}
</div>

---

<div style="text-align: center; color: ${brand.grayLight}; font-size: 12px; margin-top: 32px;">
  <a href="https://linear.app/commonspirit" target="_blank" style="color: ${brand.purple};">Open Linear →</a>
</div>

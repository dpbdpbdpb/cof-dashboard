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
  { id: "cardiovascular", name: "Cardiovascular", icon: "❤️", color: brand.magenta, champion: "Dr. Nezar Falluji", dyad: "Mary Osborne" },
  { id: "orthopedic", name: "Orthopedic", icon: "🦴", color: brand.teal, champion: "Dr. Ranjan Gupta", dyad: "Amy Magin" },
  { id: "neuroscience", name: "Neuroscience", icon: "🧠", color: brand.purple, champion: "Dr. Tom Devlin", dyad: "Anu LoCricchio" },
  { id: "womens-childrens", name: "Women's & Children's", icon: "👶", color: brand.magentaLight, champion: "Dr. Larry Shields", dyad: "Mindy Foster" },
  { id: "cross-disciplinary", name: "Cross-Disciplinary", icon: "🔗", color: brand.grayDark, champion: "TBD", dyad: "TBD" },
];

const pillarLeaders = {
  cardiovascular: { clinical: "Dr. Nezar Falluji", operations: "TBD (Terika Designee)", financial: "TBD (JP Designee)" },
  orthopedic: { clinical: "Dr. Ranjan Gupta", operations: "TBD (Terika Designee)", financial: "TBD (JP Designee)" },
  neuroscience: { clinical: "Dr. Tom Devlin", operations: "TBD (Terika Designee)", financial: "TBD (JP Designee)" },
  "womens-childrens": { clinical: "Dr. Larry Shields", operations: "TBD (Terika Designee)", financial: "TBD (JP Designee)" },
  "cross-disciplinary": { clinical: "TBD", operations: "TBD (Terika Designee)", financial: "TBD (JP Designee)" },
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
  { id: "sourcing", label: "🎯 Sourcing Strategy", color: brand.magenta },
  { id: "new-product", label: "📦 New Product Evaluation", color: brand.teal },
  { id: "re-evaluation", label: "🔄 Product Re-evaluation", color: "#D97706" },
];

const columnDescriptions = {
  "new-product": {
    "Funnel": "K1: Request received, champion identified",
    "Reviewing": "K2: Coalition forming, Kaizen scheduled",
    "Analyzing": "K3-K4: 8-agent analysis, Kaizen decision",
    "Backlog": "K5: APPROVED, awaiting implementation capacity",
    "Implementing": "K5-K6: Pilot/rollout in progress",
    "Done": "K8: Lookback complete, formulary finalized",
  },
  "re-evaluation": {
    "Funnel": "K1: Trigger identified (safety, evidence, utilization)",
    "Reviewing": "K2: Stakeholders engaged, Kaizen scheduled",
    "Analyzing": "K3-K4: Lookback analysis, Kaizen decision",
    "Backlog": "K5: COMPLETE, awaiting capacity",
    "Implementing": "K5-K6: Sustain/Modify/Remove executing",
    "Done": "K8: No change required or deimplementation complete",
  },
  "sourcing": {
    "Funnel": "S0/K1: Category assessed, urgency documented",
    "Reviewing": "S1/K2: Coalition building, analysis, Kaizen scheduled",
    "Analyzing": "S2-S3/K3-K4: Value analysis, Kaizen decision",
    "Backlog": "K5: Strategy APPROVED, awaiting contract execution",
    "Implementing": "S4/K5-K6: Contract execution, vendor transition",
    "Done": "S5/K8: Contract live, savings realized, prepare next cycle",
  },
};
```

```js
// ============================================
// DATA FROM LINEAR API
// ============================================

const linearData = await FileAttachment("data/linear-issues.json").json();

// Map Linear data to dashboard structure
const allData = {
  cardiovascular: linearData.cardiovascular || [],
  orthopedic: linearData.orthopedic || [],
  neuroscience: linearData.neuroscience || [],
  "womens-childrens": linearData.womensChildren || [],
  "cross-disciplinary": linearData.crossDisciplinary || [],
};

// Combined data for portfolio view
const allIssues = linearData.all || [];

// Show last sync time
const lastUpdated = linearData.metadata?.lastUpdated ? new Date(linearData.metadata.lastUpdated).toLocaleString() : "Unknown";
```

```js
// ============================================
// FILTER STATE (Service line filter via cards)
// ============================================

const filterState = Mutable(null); // null = show all, or service line id
const activeFilter = filterState.generator;

function setFilter(id) {
  // Toggle: if already filtered to this, clear filter
  filterState.value = (filterState.value === id) ? null : id;
}

function clearFilter() {
  filterState.value = null;
}
```

```js
// ============================================
// FILTERED DATA
// ============================================

const isFiltered = activeFilter != null && activeFilter !== undefined;
const currentIssues = isFiltered ? (allData[activeFilter] || []) : allIssues;
const activeServiceLine = isFiltered ? serviceLines.find(s => s.id === activeFilter) : null;
```


```js
// ============================================
// HELPER FUNCTIONS
// ============================================

function parseFinancialValue(value) {
  if (!value) return { low: 0, high: 0 };
  const match = value.match(/\$?([\d.]+)(?:-([\d.]+))?\s*M?/i);
  if (match) {
    const low = parseFloat(match[1]);
    const high = match[2] ? parseFloat(match[2]) : low;
    return { low, high };
  }
  return { low: 0, high: 0 };
}

function formatFinancialValue(low, high) {
  if (low === 0 && high === 0) return "—";
  return low === high ? `$${low}M` : `$${low}-${high}M`;
}

function calculateSavings(issues, type = "projected") {
  let low = 0, high = 0;
  const field = type === "realized" ? "realizedSavings" : "projectedSavings";
  issues.forEach(i => {
    const parsed = parseFinancialValue(i[field]);
    low += parsed.low;
    high += parsed.high;
  });
  return formatFinancialValue(low, high);
}

function calculateRevenue(issues, type = "projected") {
  let low = 0, high = 0;
  const field = type === "realized" ? "realizedRevenue" : "projectedRevenue";
  issues.forEach(i => {
    const parsed = parseFinancialValue(i[field]);
    low += parsed.low;
    high += parsed.high;
  });
  return formatFinancialValue(low, high);
}

function calculateImpact(issues, type = "projected") {
  let low = 0, high = 0;
  const savingsField = type === "realized" ? "realizedSavings" : "projectedSavings";
  const revenueField = type === "realized" ? "realizedRevenue" : "projectedRevenue";
  issues.forEach(i => {
    const savings = parseFinancialValue(i[savingsField]);
    const revenue = parseFinancialValue(i[revenueField]);
    low += savings.low + revenue.low;
    high += savings.high + revenue.high;
  });
  return formatFinancialValue(low, high);
}

function getUpcomingKaizens(issues) {
  return issues
    .filter(i => i.kaizenDate)
    .sort((a, b) => new Date(a.kaizenDate) - new Date(b.kaizenDate))
    .slice(0, 5);
}

function getServiceLineName(id) {
  const sl = serviceLines.find(s => s.id === id);
  return sl ? sl.name : id;
}
```

```js
// ============================================
// HERO SECTION
// ============================================

html`<div class="hero-section" style="padding: 16px 24px; margin-bottom: 16px;">
  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
    <div style="display: flex; align-items: center; gap: 12px;">
      ${isFiltered && activeServiceLine ? html`
        <span style="font-size: 28px;">${activeServiceLine.icon}</span>
        <div>
          <h1 style="font-size: 1.5rem; margin: 0;">${activeServiceLine.name}</h1>
          <div style="font-size: 11px; opacity: 0.8;">Clinical-Operational-Financial Portfolio</div>
        </div>
        <button onclick=${clearFilter} style="margin-left: 8px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; cursor: pointer;">✕ Clear</button>
      ` : html`
        <div>
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9; margin-bottom: 2px;">CommonSpirit Health</div>
          <h1 style="font-size: 1.5rem; margin: 0;">Clinical-Operational-Financial (COF) Portfolio</h1>
          <div style="font-size: 10px; opacity: 0.7; margin-top: 4px;">🔄 Synced: ${lastUpdated}</div>
        </div>
      `}
    </div>
    <div style="display: flex; gap: 24px; flex-wrap: wrap;">
      <div style="text-align: center;">
        <div style="font-size: 26px; font-weight: 800;">${currentIssues.length}</div>
        <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">Items</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 26px; font-weight: 800;">${currentIssues.filter(i => i.status === "Implementing").length}</div>
        <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">Active</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 26px; font-weight: 800;">${currentIssues.filter(i => i.labels?.some(l => l.toLowerCase().includes("blocked"))).length}</div>
        <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">Blocked</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 26px; font-weight: 800;">${currentIssues.filter(i => i.status === "Done").length}</div>
        <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">Done</div>
      </div>
    </div>
  </div>
</div>`
```

```js
// ============================================
// PIPELINE BY STATUS
// ============================================

html`
<div class="card" style="margin-bottom: 16px; padding: 16px;">
  <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px;">
    ${kanbanStates.map(state => {
      const count = currentIssues.filter(i => i.status === state.id).length;
      return html`
        <div style="text-align: center;">
          <div style="font-size: 26px; font-weight: 800; color: ${state.color};">${count}</div>
          <div style="font-size: 12px; font-weight: 600; color: white; background: ${state.color}; padding: 3px 8px; border-radius: 4px;">${state.label}</div>
        </div>
      `;
    })}
  </div>
</div>`
```

```js
// ============================================
// SERVICE LINE CARDS (Filter buttons)
// ============================================

html`
<div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 12px; align-items: stretch;">
  ${serviceLines.map(sl => {
    const issues = allData[sl.id] || [];
    const implementing = issues.filter(i => i.status === "Implementing").length;
    const done = issues.filter(i => i.status === "Done").length;
    const blocked = issues.filter(i => i.labels?.some(l => l.toLowerCase().includes("blocked"))).length;
    const isActive = activeFilter === sl.id;
    return html`
      <div class="card" style="border-top: 3px solid ${sl.color}; cursor: pointer; transition: all 0.2s ease; padding: 10px 12px; display: flex; flex-direction: column; height: 100%; ${isActive ? `background: ${sl.color}10; box-shadow: 0 0 0 2px ${sl.color};` : ''}"
        onclick=${() => setFilter(sl.id)}
        onmouseover=${(e) => { if (!isActive) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}}
        onmouseout=${(e) => { if (!isActive) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}}>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="font-size: 26px;">${sl.icon}</span>
          <div>
            <div style="font-weight: 700; font-size: 16px; color: ${brand.gray};">${sl.name}</div>
          </div>
        </div>
        <div style="font-size: 13px; color: ${brand.grayLight}; margin-bottom: 6px; line-height: 1.35; flex: 1;">
          <div><strong style="color: ${brand.gray};">Clinical:</strong> ${sl.champion} <span style="opacity: 0.5;">·</span> <strong style="color: ${brand.gray};">Admin:</strong> ${sl.dyad}</div>
          <div><strong style="color: ${brand.gray};">Operations:</strong> ${pillarLeaders[sl.id]?.operations || "TBD"}</div>
          <div><strong style="color: ${brand.gray};">Financial:</strong> ${pillarLeaders[sl.id]?.financial || "TBD"}</div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; font-size: 15px; text-align: center; margin-top: auto;">
          <div>
            <div style="font-weight: 700; color: ${brand.gray};">${issues.length}</div>
            <div style="color: ${brand.grayLight}; font-size: 12px;">Items</div>
          </div>
          <div>
            <div style="font-weight: 700; color: ${brand.magenta};">${implementing}</div>
            <div style="color: ${brand.grayLight}; font-size: 12px;">Active</div>
          </div>
          <div>
            <div style="font-weight: 700; color: ${blocked > 0 ? '#ef4444' : brand.grayLight};">${blocked}</div>
            <div style="color: ${brand.grayLight}; font-size: 12px;">Blocked</div>
          </div>
          <div>
            <div style="font-weight: 700; color: ${done > 0 ? '#10B981' : brand.grayLight};">${done}</div>
            <div style="color: ${brand.grayLight}; font-size: 12px;">Done</div>
          </div>
        </div>
      </div>
    `;
  })}
</div>`
```

```js
// ============================================
// UPCOMING KAIZENS
// ============================================

const upcomingKaizens = getUpcomingKaizens(currentIssues);

upcomingKaizens.length > 0 ? html`
<div class="card" style="margin-bottom: 16px; padding: 14px;">
  <div style="font-size: 12px; text-transform: uppercase; color: ${brand.grayLight}; margin-bottom: 10px;">Upcoming Kaizens</div>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    ${upcomingKaizens.map(item => {
      const sl = serviceLines.find(s => s.id === item.serviceLine);
      return html`
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8fafc; border-radius: 6px; border-left: 3px solid ${sl?.color || brand.gray};">
          <div>
            <div style="font-weight: 600; font-size: 14px; color: ${brand.gray};">${item.title}</div>
            <div style="font-size: 12px; color: ${brand.grayLight};">${sl?.name || item.serviceLine}</div>
          </div>
          <div style="font-weight: 700; font-size: 13px; color: ${brand.purple};">${item.kaizenDate}</div>
        </div>
      `;
    })}
  </div>
</div>` : ""
```

```js
// ============================================
// KANBAN BOARD
// ============================================

// Render Kanban board
function renderKanban(issues, showServiceLine = false) {
  const columns = kanbanStates;

  // Helper to calculate combined impact for a single issue
  function getIssueImpact(issue, type) {
    const savingsField = type === "realized" ? "realizedSavings" : "projectedSavings";
    const revenueField = type === "realized" ? "realizedRevenue" : "projectedRevenue";
    const savings = parseFinancialValue(issue[savingsField]);
    const revenue = parseFinancialValue(issue[revenueField]);
    const low = savings.low + revenue.low;
    const high = savings.high + revenue.high;
    return formatFinancialValue(low, high);
  }

  const swimlaneCount = swimlanes.length;

  return html`
    <div class="card" style="padding: 12px; overflow-x: auto; display: flex; flex-direction: column; height: calc(100vh - 380px); min-height: 380px;">
      <!-- Column Headers -->
      <div style="display: grid; grid-template-columns: 140px repeat(${columns.length}, 1fr); gap: 6px; margin-bottom: 6px; min-width: 1000px; flex-shrink: 0;">
        <div></div>
        ${columns.map(col => html`
          <div style="font-size: 10px; font-weight: 600; color: white; background: ${col.color}; padding: 5px; border-radius: 5px; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${col.label}
          </div>
        `)}
      </div>

      <!-- Swimlanes Container -->
      <div style="flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 1000px; overflow: hidden;">
        ${swimlanes.map(swimlane => {
          const swimlaneIssues = issues.filter(i => i.archetype === swimlane.id);
          const descriptions = columnDescriptions[swimlane.id];

          return html`
            <div style="flex: 1 1 0; display: flex; flex-direction: column; min-height: 100px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <!-- Swimlane Header -->
              <div style="display: grid; grid-template-columns: 140px repeat(${columns.length}, 1fr); gap: 6px; padding: 5px; background: ${swimlane.color}08; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;">
                <div style="font-size: 11px; font-weight: 600; color: ${swimlane.color}; overflow: hidden;">
                  ${swimlane.label}
                </div>
                ${columns.map(col => html`
                  <div style="font-size: 9px; color: ${brand.grayLight}; line-height: 1.25; overflow: hidden;">
                    ${descriptions[col.id]}
                  </div>
                `)}
              </div>

              <!-- Issue Cards (Scrollable) -->
              <div style="flex: 1; overflow-y: auto; padding: 5px;">
                <div style="display: grid; grid-template-columns: 140px repeat(${columns.length}, 1fr); gap: 5px;">
                  <div></div>
                  ${columns.map(col => {
                    const cellIssues = swimlaneIssues.filter(i => i.status === col.id);
                    return html`
                      <div style="min-height: 36px; background: #f8fafc; border-radius: 6px; padding: 4px;">
                        ${cellIssues.map(issue => {
                      const isBlocked = issue.labels?.some(l => l.toLowerCase().includes("blocked"));
                      const sl = serviceLines.find(s => s.id === issue.serviceLine);
                      const hasFinancial = issue.projectedSavings || issue.realizedSavings || issue.projectedRevenue || issue.realizedRevenue;
                      const projectedImpact = getIssueImpact(issue, "projected");
                      const realizedImpact = getIssueImpact(issue, "realized");
                      return html`
                        <a href="https://linear.app/commonspirit/issue/${issue.id}" target="_blank" style="display: block; background: white; border-radius: 5px; padding: 8px; margin-bottom: 4px; border: 1px solid ${isBlocked ? '#fca5a5' : '#e2e8f0'}; border-left: 3px solid ${showServiceLine ? (sl?.color || '#e2e8f0') : (isBlocked ? '#ef4444' : '#e2e8f0')}; text-decoration: none; transition: all 0.2s;">
                          <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="font-size: 12px; font-weight: 600; color: ${brand.gray}; line-height: 1.3;">${issue.title}</div>
                            ${isBlocked ? html`<div style="width: 7px; height: 7px; border-radius: 50%; background: #ef4444; flex-shrink: 0;"></div>` : ""}
                          </div>
                          ${showServiceLine ? html`<div style="font-size: 10px; color: ${sl?.color || brand.grayLight}; margin-top: 2px;">${sl?.icon} ${sl?.name}</div>` : ""}
                          <div style="font-size: 10px; color: ${brand.grayLight}; margin-top: 3px; line-height: 1.3;">${issue.brief}</div>
                          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 4px;">
                            <div style="font-size: 10px; color: ${brand.purple};">${issue.kaizenDate || "TBD"}</div>
                            ${hasFinancial ? html`
                              <div style="font-size: 10px; font-weight: 600; text-align: right;">
                                ${projectedImpact !== "—" ? html`<div style="color: ${brand.teal};">📊 ${projectedImpact}</div>` : ""}
                                ${realizedImpact !== "—" ? html`<div style="color: #10B981;">✓ ${realizedImpact}</div>` : ""}
                              </div>
                            ` : ""}
                          </div>
                        </a>
                      `;
                        })}
                      </div>
                    `;
                  })}
                </div>
              </div>
            </div>
          `;
        })}
      </div>
    </div>
  `;
}
```

```js
// Render the kanban board reactively
display(renderKanban(currentIssues, !isFiltered))
```

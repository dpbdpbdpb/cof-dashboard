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
  { id: "womens-childrens", name: "Women's & Children's", icon: "👶", color: brand.magentaLight, champion: "Larry Shields, MD" },
];

const pillarLeaders = {
  cardiovascular: { clinical: "Dr. Nezar Falluji", operations: "TBD (Terika Designee)", financial: "TBD (JP Designee)" },
  orthopedic: { clinical: "Dr. Ranjan Gupta", operations: "TBD (Terika Designee)", financial: "TBD (JP Designee)" },
  neuroscience: { clinical: "Dr. Tom Devlin", operations: "TBD (Terika Designee)", financial: "TBD (JP Designee)" },
  "womens-childrens": { clinical: "Larry Shields, MD", operations: "TBD (Terika Designee)", financial: "TBD (JP Designee)" },
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
    "Backlog": "K5: APPROVED, awaiting implementation capacity",
    "Implementing": "K5-K6: Sustain/Modify/Remove executing",
    "Done": "K8: Formulary updated, transition complete",
  },
  "sourcing": {
    "Funnel": "S0/K1: Category assessed, urgency documented",
    "Reviewing": "S1/K2: Coalition building, analysis, Kaizen scheduled",
    "Analyzing": "S2-S3/K3-K4: Equivalence analysis, Kaizen decision",
    "Backlog": "K5: Strategy APPROVED, awaiting contract execution",
    "Implementing": "S4/K5-K6: Contract execution, vendor transition",
    "Done": "S5/K8: Contract live, savings realized",
  },
};
```

```js
// ============================================
// SAMPLE DATA (Replace with Linear API later)
// ============================================

const cardiovascularIssues = [
  { id: "COM-380", title: "AGENT Drug-Coated Balloon", brief: "Peripheral artery disease intervention", status: "Implementing", priority: "High", kaizenDate: "2025-10-08", champion: "Dr. Falluji", archetype: "new-product", completion: 90, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "cardiovascular" },
  { id: "COM-386", title: "T/EVAR Sourcing", brief: "Aortic stent graft consolidation", status: "Implementing", priority: "High", kaizenDate: null, champion: "CVSL Council", archetype: "sourcing", completion: 75, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "cardiovascular" },
  { id: "COM-387", title: "Renal Denervation", brief: "Resistant hypertension treatment hubs", status: "Analyzing", priority: "Medium", kaizenDate: null, champion: "Dr. Falluji", archetype: "new-product", completion: 65, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "cardiovascular" },
  { id: "COM-396", title: "EVOQUE", brief: "Tricuspid valve replacement system", status: "Analyzing", priority: "Medium", kaizenDate: null, champion: "Dr. Falluji", archetype: "new-product", completion: 50, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "cardiovascular" },
  { id: "COM-395", title: "DETOUR", brief: "Femoropopliteal bypass system", status: "Analyzing", priority: "Medium", kaizenDate: null, champion: "Dr. Falluji", archetype: "new-product", completion: 0, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "cardiovascular" },
  { id: "COM-397", title: "ESPRIT-BTK", brief: "Below-the-knee drug-eluting stent", status: "Analyzing", priority: "Medium", kaizenDate: null, champion: "Dr. Falluji", archetype: "new-product", completion: 0, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "cardiovascular" },
  { id: "COM-457", title: "GE Cath Lab Modernization", brief: "Imaging equipment standardization", status: "Implementing", priority: "Urgent", kaizenDate: null, champion: "Mary Osborne", archetype: "sourcing", completion: 60, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "cardiovascular" },
];

const orthopedicIssues = [
  { id: "COM-381", title: "Hip/Knee Sourcing Strategy", brief: "$161M implant consolidation, 106 to 4 vendors", status: "Analyzing", priority: "Urgent", kaizenDate: "2026-01-12", champion: "Dr. Ranjan Gupta", archetype: "sourcing", completion: 60, projectedSavings: "$10-16M", realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "orthopedic" },
  { id: "COM-426", title: "Trauma & Distal Extremity", brief: "$84M nails, plates, external fixation", status: "Funnel", priority: "High", kaizenDate: null, champion: "Dr. Cliff Jones", archetype: "sourcing", completion: 20, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "orthopedic" },
  { id: "COM-427", title: "Sports Medicine Sourcing", brief: "$42M anchors, shavers, RF pumps", status: "Funnel", priority: "Medium", kaizenDate: null, champion: "TBD", archetype: "sourcing", completion: 40, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "orthopedic" },
  { id: "COM-428", title: "Spine Sourcing Strategy", brief: "$94M implants, 50 vendors, ortho+neuro", status: "Funnel", priority: "High", kaizenDate: null, champion: "TBD", archetype: "sourcing", completion: 30, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "orthopedic" },
  { id: "COM-425", title: "Shoulders Sourcing", brief: "$38M total/reverse shoulder implants", status: "Funnel", priority: "Medium", kaizenDate: null, champion: "TBD", archetype: "sourcing", completion: 25, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "orthopedic" },
];

const neuroscienceIssues = [
  { id: "COM-383", title: "Robotic TCD for PFO Detection", brief: "Automated stroke risk screening, 3x better than echo", status: "Reviewing", priority: "High", kaizenDate: "2026-01-15", champion: "Dr. Tom Devlin", archetype: "new-product", completion: 75, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "neuroscience" },
  { id: "COM-307", title: "Medivis AI Navigation", brief: "AR surgical navigation for spine procedures", status: "Reviewing", priority: "Medium", kaizenDate: null, champion: "TBD", archetype: "new-product", completion: 20, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, labels: ["blocked"], serviceLine: "neuroscience" },
];

const womensChildrensIssues = [
  { id: "COM-500", title: "Fetal Pillow De-implementation", brief: "First unified three-pillar clinical-supply chain-quality communication", status: "Implementing", priority: "High", kaizenDate: null, champion: "Larry Shields, MD", archetype: "re-evaluation", completion: 80, projectedSavings: null, realizedSavings: null, projectedRevenue: null, realizedRevenue: null, serviceLine: "womens-childrens" },
];

const allData = {
  cardiovascular: cardiovascularIssues,
  orthopedic: orthopedicIssues,
  neuroscience: neuroscienceIssues,
  "womens-childrens": womensChildrensIssues,
};

// Combined data for portfolio view
const allIssues = [...cardiovascularIssues, ...orthopedicIssues, ...neuroscienceIssues, ...womensChildrensIssues];
```

```js
// ============================================
// VIEW STATE (Using Mutable for tab navigation)
// ============================================

const viewOptions = [
  { id: "portfolio", name: "Portfolio", icon: "📊", color: brand.gray },
  ...serviceLines
];

const selectedViewState = Mutable("portfolio");
const selectedViewId = selectedViewState.generator;

function setView(id) {
  selectedViewState.value = id;
}
```

```js
// ============================================
// TAB NAVIGATION BAR
// ============================================

const selectedView = viewOptions.find(v => v.id === selectedViewId) || viewOptions[0];

html`<div style="
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  padding: 4px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  overflow-x: auto;
">
  ${viewOptions.map(v => {
    const isActive = v.id === selectedViewId;
    return html`
      <button
        onclick=${() => setView(v.id)}
        style="
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          background: ${isActive ? v.color : 'transparent'};
          color: ${isActive ? 'white' : brand.gray};
        "
        onmouseover=${(e) => { if (!isActive) { e.target.style.background = '#f1f5f9'; }}}
        onmouseout=${(e) => { if (!isActive) { e.target.style.background = 'transparent'; }}}
      >
        <span style="font-size: 14px;">${v.icon}</span>
        <span>${v.name}</span>
      </button>
    `;
  })}
</div>`
```

```js
// ============================================
// CURRENT DATA BASED ON VIEW
// ============================================

const isPortfolioView = selectedView.id === "portfolio";
const currentIssues = isPortfolioView ? allIssues : (allData[selectedView.id] || []);
const currentLeaders = isPortfolioView ? null : pillarLeaders[selectedView.id];
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
// PORTFOLIO HERO SECTION
// ============================================

isPortfolioView ? html`<div class="hero-section" style="padding: 16px 24px; margin-bottom: 16px;">
  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 28px;">📊</span>
      <h1 style="font-size: 1.5rem; margin: 0;">COF Portfolio</h1>
    </div>
    <div style="display: flex; gap: 24px; flex-wrap: wrap;">
      <div style="text-align: center;">
        <div style="font-size: 26px; font-weight: 800;">${allIssues.length}</div>
        <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">Items</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 26px; font-weight: 800;">${calculateImpact(allIssues, "projected")}</div>
        <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">Projected</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 26px; font-weight: 800;">${calculateImpact(allIssues, "realized")}</div>
        <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">Realized</div>
      </div>
    </div>
  </div>
</div>` : html`<div class="hero-section" style="padding: 16px 24px; margin-bottom: 16px;">
  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 28px;">${selectedView.icon}</span>
      <h1 style="font-size: 1.5rem; margin: 0;">${selectedView.name}</h1>
    </div>
    <div style="display: flex; gap: 24px; flex-wrap: wrap;">
      <div style="text-align: center;">
        <div style="font-size: 26px; font-weight: 800;">${currentIssues.length}</div>
        <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">Items</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 26px; font-weight: 800;">${calculateImpact(currentIssues, "projected")}</div>
        <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">Projected</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 26px; font-weight: 800;">${calculateImpact(currentIssues, "realized")}</div>
        <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">Realized</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 15px; font-weight: 700;">${currentLeaders?.clinical || "—"}</div>
        <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">Champion</div>
      </div>
    </div>
  </div>
</div>`
```

```js
// ============================================
// PIPELINE BY STATUS (Portfolio View Only)
// ============================================

isPortfolioView ? html`
<div class="card" style="margin-bottom: 16px; padding: 16px;">
  <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px;">
    ${kanbanStates.map(state => {
      const count = allIssues.filter(i => i.status === state.id).length;
      return html`
        <div style="text-align: center;">
          <div style="font-size: 26px; font-weight: 800; color: ${state.color};">${count}</div>
          <div style="font-size: 12px; font-weight: 600; color: white; background: ${state.color}; padding: 3px 8px; border-radius: 4px;">${state.label}</div>
        </div>
      `;
    })}
  </div>
</div>` : ""
```

```js
// ============================================
// SERVICE LINE CARDS (Portfolio View Only)
// ============================================

isPortfolioView ? html`
<div class="grid-4" style="margin-bottom: 16px;">
  ${serviceLines.map(sl => {
    const issues = allData[sl.id] || [];
    const implementing = issues.filter(i => i.status === "Implementing").length;
    const blocked = issues.filter(i => i.labels?.some(l => l.toLowerCase().includes("blocked"))).length;
    return html`
      <div class="card" style="border-top: 3px solid ${sl.color}; cursor: pointer; transition: all 0.2s ease; padding: 14px;"
        onclick=${() => setView(sl.id)}
        onmouseover=${(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
        onmouseout=${(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
          <span style="font-size: 22px;">${sl.icon}</span>
          <div>
            <div style="font-weight: 700; font-size: 14px; color: ${brand.gray};">${sl.name}</div>
            <div style="font-size: 12px; color: ${brand.grayLight};">${sl.champion}</div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; font-size: 13px; text-align: center;">
          <div>
            <div style="font-weight: 700; color: ${brand.gray};">${issues.length}</div>
            <div style="color: ${brand.grayLight}; font-size: 11px;">Items</div>
          </div>
          <div>
            <div style="font-weight: 700; color: ${brand.magenta};">${implementing}</div>
            <div style="color: ${brand.grayLight}; font-size: 11px;">Active</div>
          </div>
          <div>
            <div style="font-weight: 700; color: ${blocked > 0 ? '#ef4444' : brand.grayLight};">${blocked}</div>
            <div style="color: ${brand.grayLight}; font-size: 11px;">Blocked</div>
          </div>
        </div>
        <div style="margin-top: 10px; display: flex; justify-content: space-between; font-size: 13px;">
          <span style="color: ${brand.teal};" title="Projected Impact">📊 ${calculateImpact(issues, "projected")}</span>
          <span style="color: #10B981;" title="Realized Impact">✓ ${calculateImpact(issues, "realized")}</span>
        </div>
      </div>
    `;
  })}
</div>` : ""
```

```js
// ============================================
// THREE-PILLAR REPRESENTATIVES (Service Line View Only)
// ============================================

!isPortfolioView && currentLeaders ? html`
<div class="grid-3" style="margin-bottom: 16px;">
  <div class="card" style="border-left: 3px solid ${brand.magenta}; padding: 14px;">
    <div style="font-size: 12px; text-transform: uppercase; color: ${brand.magenta}; margin-bottom: 4px;">Clinical</div>
    <div style="font-size: 14px; font-weight: 600;">${currentLeaders.clinical}</div>
  </div>
  <div class="card" style="border-left: 3px solid ${brand.purple}; padding: 14px;">
    <div style="font-size: 12px; text-transform: uppercase; color: ${brand.purple}; margin-bottom: 4px;">Operations</div>
    <div style="font-size: 14px; font-weight: 600;">${currentLeaders.operations}</div>
  </div>
  <div class="card" style="border-left: 3px solid ${brand.teal}; padding: 14px;">
    <div style="font-size: 12px; text-transform: uppercase; color: ${brand.teal}; margin-bottom: 4px;">Financial</div>
    <div style="font-size: 14px; font-weight: 600;">${currentLeaders.financial}</div>
  </div>
</div>` : ""
```

```js
// ============================================
// UPCOMING KAIZENS (Portfolio View Only)
// ============================================

const upcomingKaizens = getUpcomingKaizens(allIssues);

isPortfolioView && upcomingKaizens.length > 0 ? html`
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

## Product & Sourcing Kanban

```js
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

  return html`
    <div class="card" style="padding: 24px; overflow-x: auto;">
      <!-- Column Headers -->
      <div style="display: grid; grid-template-columns: 180px repeat(${columns.length}, 1fr); gap: 8px; margin-bottom: 12px; min-width: 1000px;">
        <div style="font-size: 12px; color: ${brand.grayLight}; padding: 4px 8px;">Archetype</div>
        ${columns.map(col => html`
          <div style="font-size: 12px; font-weight: 600; color: white; background: ${col.color}; padding: 8px; border-radius: 6px; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
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
              <div style="font-size: 13px; font-weight: 600; color: ${swimlane.color}; background: ${swimlane.color}15; padding: 10px; border-radius: 8px; overflow: hidden;">
                ${swimlane.label}
              </div>
              ${columns.map(col => html`
                <div style="font-size: 11px; color: ${brand.grayLight}; padding: 4px; line-height: 1.3; overflow: hidden;">
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
                      const sl = serviceLines.find(s => s.id === issue.serviceLine);
                      const hasFinancial = issue.projectedSavings || issue.realizedSavings || issue.projectedRevenue || issue.realizedRevenue;
                      const projectedImpact = getIssueImpact(issue, "projected");
                      const realizedImpact = getIssueImpact(issue, "realized");
                      return html`
                        <a href="https://linear.app/commonspirit/issue/${issue.id}" target="_blank" style="display: block; background: white; border-radius: 6px; padding: 10px; margin-bottom: 6px; border: 1px solid ${isBlocked ? '#fca5a5' : '#e2e8f0'}; border-left: 4px solid ${showServiceLine ? (sl?.color || '#e2e8f0') : (isBlocked ? '#ef4444' : '#e2e8f0')}; text-decoration: none; transition: all 0.2s;">
                          <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="font-size: 13px; font-weight: 600; color: ${brand.gray};">${issue.title}</div>
                            ${isBlocked ? html`<div style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444; flex-shrink: 0;"></div>` : ""}
                          </div>
                          ${showServiceLine ? html`<div style="font-size: 11px; color: ${sl?.color || brand.grayLight}; margin-top: 2px;">${sl?.icon} ${sl?.name}</div>` : ""}
                          <div style="font-size: 11px; color: ${brand.grayLight}; margin-top: 4px;">${issue.brief}</div>
                          ${hasFinancial ? html`
                            <div style="font-size: 12px; margin-top: 6px; font-weight: 600; display: flex; flex-direction: column; gap: 2px;">
                              ${projectedImpact !== "—" ? html`<div style="color: ${brand.teal};">📊 ${projectedImpact} <span style="font-weight: 400; font-size: 10px;">projected</span></div>` : ""}
                              ${realizedImpact !== "—" ? html`<div style="color: #10B981;">✓ ${realizedImpact} <span style="font-weight: 400; font-size: 10px;">realized</span></div>` : ""}
                            </div>
                          ` : ""}
                          <div style="font-size: 11px; color: ${brand.purple}; margin-top: 6px;">
                            ${issue.kaizenDate || "TBD"}
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

```js
renderKanban(currentIssues, isPortfolioView)
```

---

```js
html`<div style="text-align: center; color: ${brand.grayLight}; font-size: 12px; margin-top: 32px;">
  <a href="https://linear.app/commonspirit" target="_blank" style="color: ${brand.purple};">Open Linear →</a>
</div>`
```

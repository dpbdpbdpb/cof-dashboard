// Linear API Data Loader for COF Dashboard
// Fetches issues from Linear projects and transforms to COF format

import "dotenv/config";

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const LINEAR_API_URL = "https://api.linear.app/graphql";

// Linear Project IDs for COF Service Lines
const PROJECT_IDS = {
  cardiovascular: "67cab51b-1c35-4d13-b4fa-20800fafb8fa",
  orthopedic: "f94960e7-254e-4987-92bc-a2d36d643cf5",
  neuroscience: "14140c87-a1a4-4c2a-bcf7-936ad14174f7",
  surgery: "d8385a2c-bb0c-4235-aa13-03507eb55ad9",
  crossDisciplinary: "1541827a-2a47-43ed-bdbb-ed1892c17b43",
  womensChildren: "34d99d83-890a-46f3-a939-d8f8f703220e",
  gastroenterology: "4cc643cb-34fd-4f79-90ee-b690bcb66714",
  acuteCare: "c2b32fff-82b6-41f3-8689-a98034cffb1e",
  cofEnablers: "42026ff6-39b8-429e-ac75-48d8ae82f8ff",
  enterprisePartnerships: "6dd46767-43ae-45b3-b81d-402ac15009f9",
  innovationVentures: "2160b056-5391-491b-ab94-f3f3ed349e95",
};

// State mapping: Linear status → COF Kanban
const STATE_MAPPING = {
  "Triage": "Funnel",
  "Backlog": "Backlog",
  "Todo": "Backlog",
  "Analyzing": "Analyzing",
  "In Progress": "Implementing",
  "In Review": "Reviewing",
  "Done": "Done",
  "Canceled": "Done",
};

async function fetchProjectIssues(projectId, projectName) {
  const query = `
    query GetProjectIssues($projectId: String!) {
      project(id: $projectId) {
        id
        name
        issues {
          nodes {
            id
            identifier
            title
            description
            state {
              name
              type
            }
            priority
            labels {
              nodes {
                name
              }
            }
            assignee {
              name
            }
            parent {
              id
            }
            completedAt
            createdAt
            updatedAt
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(LINEAR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": LINEAR_API_KEY,
      },
      body: JSON.stringify({
        query,
        variables: { projectId },
      }),
    });

    const data = await response.json();
    const issues = data.data?.project?.issues?.nodes || [];

    // Only include top-level issues (no parent) - these are program epics
    const topLevelIssues = issues.filter(issue => !issue.parent);

    return topLevelIssues.map(issue => transformIssue(issue, projectName));
  } catch (error) {
    console.error(`Error fetching ${projectName}:`, error);
    return [];
  }
}

// Map internal names to dashboard IDs
const SERVICE_LINE_MAP = {
  "cardiovascular": "cardiovascular",
  "orthopedic": "orthopedic",
  "neuroscience": "neuroscience",
  "surgery": "surgery",
  "crossDisciplinary": "cross-disciplinary",
  "womensChildren": "womens-childrens",
  "gastroenterology": "gastroenterology",
  "acuteCare": "acute-care",
  "cofEnablers": "cof-enablers",
  "enterprisePartnerships": "enterprise-partnerships",
  "innovationVentures": "innovation-ventures",
};

function transformIssue(issue, serviceLine) {
  const labels = issue.labels?.nodes || [];

  return {
    id: issue.identifier,
    title: issue.title,
    brief: extractBrief(issue.description),
    status: STATE_MAPPING[issue.state?.name] || "Funnel",
    linearState: issue.state?.name,
    priority: mapPriority(issue.priority),
    url: `https://linear.app/commonspirit/issue/${issue.identifier}`,
    champion: issue.assignee?.name || "TBD",
    archetype: detectArchetype(labels),
    completion: issue.completedAt ? 100 : estimateCompletion(issue.state?.name),
    projectedSavings: extractSavings(issue.description),
    realizedSavings: null,
    projectedRevenue: extractRevenue(issue.description),
    realizedRevenue: null,
    kaizenDate: extractKaizenDate(issue.description),
    serviceLine: SERVICE_LINE_MAP[serviceLine] || serviceLine,
    labels: labels.map(l => l.name),
    updatedAt: issue.updatedAt,
    createdAt: issue.createdAt,
  };
}

function extractBrief(description) {
  if (!description) return "";
  const firstLine = description.split('\n')[0];
  return firstLine.substring(0, 80) + (firstLine.length > 80 ? "..." : "");
}

function mapPriority(priority) {
  const map = { 1: "Urgent", 2: "High", 3: "Medium", 4: "Low" };
  return map[priority] || "Medium";
}

function detectArchetype(labels) {
  const labelNames = labels.map(l => l.name.toLowerCase());
  // Vendor decisions: sourcing, RFP, vendor-related labels
  if (labelNames.some(l => l.includes("sourcing") || l.includes("rfp") || l.includes("vendor"))) return "vendor";
  // Everything else is formulary (new products + re-evaluations)
  return "formulary";
}

function estimateCompletion(stateName) {
  const estimates = {
    "Triage": 10, "Backlog": 30, "Todo": 40, "Analyzing": 50,
    "In Progress": 60, "In Review": 80, "Done": 100
  };
  return estimates[stateName] || 0;
}

function extractSavings(description) {
  if (!description) return null;
  const match = description.match(/savings[:\s]*\$?([\d.]+(?:-[\d.]+)?)\s*M/i);
  return match ? `$${match[1]}M` : null;
}

function extractRevenue(description) {
  if (!description) return null;
  const match = description.match(/revenue[:\s]*\$?([\d.]+(?:-[\d.]+)?)\s*M/i);
  return match ? `$${match[1]}M` : null;
}

function extractKaizenDate(description) {
  if (!description) return null;
  const match = description.match(/kaizen[:\s]*([\d]{4}-[\d]{2}-[\d]{2})/i);
  return match ? match[1] : null;
}

// Fetch all service lines and portfolios and write to stdout
async function main() {
  const [
    cardiovascular,
    orthopedic,
    neuroscience,
    surgery,
    crossDisciplinary,
    womensChildren,
    gastroenterology,
    acuteCare,
    cofEnablers,
    enterprisePartnerships,
    innovationVentures,
  ] = await Promise.all([
    fetchProjectIssues(PROJECT_IDS.cardiovascular, "cardiovascular"),
    fetchProjectIssues(PROJECT_IDS.orthopedic, "orthopedic"),
    fetchProjectIssues(PROJECT_IDS.neuroscience, "neuroscience"),
    fetchProjectIssues(PROJECT_IDS.surgery, "surgery"),
    fetchProjectIssues(PROJECT_IDS.crossDisciplinary, "crossDisciplinary"),
    fetchProjectIssues(PROJECT_IDS.womensChildren, "womensChildren"),
    fetchProjectIssues(PROJECT_IDS.gastroenterology, "gastroenterology"),
    fetchProjectIssues(PROJECT_IDS.acuteCare, "acuteCare"),
    fetchProjectIssues(PROJECT_IDS.cofEnablers, "cofEnablers"),
    fetchProjectIssues(PROJECT_IDS.enterprisePartnerships, "enterprisePartnerships"),
    fetchProjectIssues(PROJECT_IDS.innovationVentures, "innovationVentures"),
  ]);

  const all = [
    ...cardiovascular,
    ...orthopedic,
    ...neuroscience,
    ...surgery,
    ...crossDisciplinary,
    ...womensChildren,
    ...gastroenterology,
    ...acuteCare,
    ...cofEnablers,
    ...enterprisePartnerships,
    ...innovationVentures,
  ];

  const result = {
    // Service Lines
    cardiovascular,
    orthopedic,
    neuroscience,
    surgery,
    crossDisciplinary,
    womensChildren,
    gastroenterology,
    acuteCare,
    // Enabler Portfolios
    cofEnablers,
    enterprisePartnerships,
    innovationVentures,
    // Aggregates
    all,
    metadata: {
      lastUpdated: new Date().toISOString(),
      counts: {
        cardiovascular: cardiovascular.length,
        orthopedic: orthopedic.length,
        neuroscience: neuroscience.length,
        surgery: surgery.length,
        crossDisciplinary: crossDisciplinary.length,
        womensChildren: womensChildren.length,
        gastroenterology: gastroenterology.length,
        acuteCare: acuteCare.length,
        cofEnablers: cofEnablers.length,
        enterprisePartnerships: enterprisePartnerships.length,
        innovationVentures: innovationVentures.length,
        total: all.length,
      }
    }
  };

  // Write JSON to stdout for Observable Framework
  process.stdout.write(JSON.stringify(result));
}

main().catch(console.error);

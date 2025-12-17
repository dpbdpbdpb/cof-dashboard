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
};

// State mapping: Linear status → COF Kanban
const STATE_MAPPING = {
  "Triage": "Funnel",
  "Backlog": "Backlog",
  "Todo": "Backlog",
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
    
    return issues.map(issue => transformIssue(issue, projectName));
  } catch (error) {
    console.error(`Error fetching ${projectName}:`, error);
    return [];
  }
}

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
    projectedRevenue: extractRevenue(issue.description),
    kaizenDate: extractKaizenDate(issue.description),
    serviceLine,
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
  if (labelNames.some(l => l.includes("sourcing") || l.includes("rfp") || l.includes("vendor"))) return "sourcing";
  if (labelNames.some(l => l.includes("re-eval") || l.includes("lookback"))) return "re-evaluation";
  return "new-product";
}

function estimateCompletion(stateName) {
  const estimates = {
    "Triage": 10, "Backlog": 30, "Todo": 40,
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

// Fetch all service lines
export default async function() {
  const [cardiovascular, orthopedic, neuroscience] = await Promise.all([
    fetchProjectIssues(PROJECT_IDS.cardiovascular, "cardiovascular"),
    fetchProjectIssues(PROJECT_IDS.orthopedic, "orthopedic"),
    fetchProjectIssues(PROJECT_IDS.neuroscience, "neuroscience"),
  ]);

  return {
    cardiovascular,
    orthopedic,
    neuroscience,
    all: [...cardiovascular, ...orthopedic, ...neuroscience],
    metadata: {
      lastUpdated: new Date().toISOString(),
      counts: {
        cardiovascular: cardiovascular.length,
        orthopedic: orthopedic.length,
        neuroscience: neuroscience.length,
        total: cardiovascular.length + orthopedic.length + neuroscience.length,
      }
    }
  };
}

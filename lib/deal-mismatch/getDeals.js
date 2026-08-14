import { FALLBACK_DEALS, FALLBACK_UNSCORED } from "./fallbackData";

const SHEET_ID = "1o_9QYGT2qT7M6CmLzcvuq8nI9ohGC13AD0iAgmqARcE";
const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Sheet1`;

const STAGE_TO_NUM = {
  "Interested": 1,
  "Team Presentation & Next Steps": 2,
  "Proposal & ROI Review": 3,
  "Finalist": 4,
  "Contracting": 5,
};

function parseGvizResponse(text) {
  // gviz wraps its JSON in `google.visualization.Query.setResponse(...)`
  const match = text.match(/setResponse\(([\s\S]*)\);?\s*$/);
  if (!match) throw new Error("Unexpected gviz response shape");
  return JSON.parse(match[1]);
}

function toBool(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.trim().toLowerCase() === "true";
  return false;
}

function toNum(v) {
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

// "Champion (required since Team Presentation); Economic Buyer (required since Team Presentation)"
// -> [{gate, requiredSince}]
function parseMismatchDetails(str) {
  if (!str) return [];
  return str.split(";").map(s => s.trim()).filter(Boolean).map(segment => {
    const m = segment.match(/^(.*?)\s*\(required since (.*?)\)\s*$/);
    if (m) return { gate: m[1].trim(), requiredSince: m[2].trim() };
    return { gate: segment, requiredSince: "" };
  });
}

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

function rowsToDeals(headerLabels, rows) {
  const idx = {};
  headerLabels.forEach((label, i) => { idx[label] = i; });

  const get = (cells, name) => {
    const i = idx[name];
    if (i === undefined || !cells[i]) return null;
    const cell = cells[i];
    // gviz cells are {v: value, f: formatted} or null
    return cell.v !== undefined ? cell.v : null;
  };

  // Keep only the LAST row per deal_id (Sheet is append-only history;
  // last occurrence = most recent run for that deal).
  const latestByDealId = new Map();
  for (const row of rows) {
    const cells = row.c || [];
    const dealId = get(cells, "deal_id");
    if (!dealId) continue;
    latestByDealId.set(dealId, cells);
  }

  const scored = [];
  const unscored = [];

  for (const [dealId, cells] of latestByDealId.entries()) {
    const stageName = get(cells, "stage_name");
    const riskCategory = get(cells, "risk_category");
    const parseError = toBool(get(cells, "parse_error"));

    const base = {
      id: dealId,
      name: get(cells, "deal_name") || "(unnamed deal)",
      owner: get(cells, "owner_name") || "Unassigned",
      value: toNum(get(cells, "amount")) || 0,
      stage: STAGE_TO_NUM[stageName] || 1,
      closeDate: get(cells, "close_date") || null,
      daysInStage: toNum(get(cells, "days_in_current_stage")),
      isRenewalOrExpansion: toBool(get(cells, "is_renewal_or_expansion")),
      repSentiment: get(cells, "rep_sentiment") || null,
    };

    // A deal with no risk_category never made it through scoring (e.g. dropped
    // by a filter before reaching Claude) - show it honestly as pending, not guessed.
    if (!riskCategory) {
      unscored.push({
        ...base,
        nextStep: null,
        note: "No risk_category found for this deal's latest row in the Sheet - it may not have completed scoring on its last run.",
      });
      continue;
    }

    const mismatchDetails = parseMismatchDetails(get(cells, "stage_mismatch_details"));
    const redFlagsStr = get(cells, "red_flags") || "";
    const topSignals = safeJsonParse(get(cells, "top_signals"), []);
    const inferencesStr = get(cells, "inferences_applied") || "";

    scored.push({
      ...base,
      dataQuirk: parseError,
      absoluteScore: toNum(get(cells, "absolute_score")) ?? 0,
      inferredScore: toNum(get(cells, "inferred_score")) ?? 0,
      bjMismatch: toBool(get(cells, "stage_vs_buyers_journey_mismatch")),
      nextStepStale: (() => {
        const cats = safeJsonParse(get(cells, "signal_categories_detected"), {});
        // next_step_staleness isn't in categories_detected in the Sheet schema -
        // reconstruct a display hint from top_signals category M if present.
        const m = (topSignals || []).find(s => s.category === "M");
        return m ? { days: null, stillPending: true, detail: m.sentence } : null;
      })(),
      milestonesAbsolute: {}, // reconstructed below
      contactNames: {
        championPresent: get(cells, "champion_name") || null,
        economicBuyerPresent: get(cells, "economic_buyer_name") || null,
        technicalBuyerPresent: get(cells, "technical_buyer_name") || null,
      },
      stageMismatchDetails: mismatchDetails,
      redFlags: redFlagsStr ? redFlagsStr.split(";").map(s => s.trim()).filter(Boolean) : [],
      inferencesApplied: inferencesStr
        ? inferencesStr.split(";").map(s => s.trim()).filter(Boolean).map(note => ({ field: null, note }))
        : [],
      topSignals,
      riskCategory,
      riskRationale: get(cells, "risk_rationale") || "",
      svpRecommendation: get(cells, "svp_recommendation") || "",
    });

    // Reconstruct contact-role booleans from the name fields (present if a name exists)
    const last = scored[scored.length - 1];
    last.milestonesAbsolute.championPresent = !!last.contactNames.championPresent;
    last.milestonesAbsolute.economicBuyerPresent = !!last.contactNames.economicBuyerPresent;
    last.milestonesAbsolute.technicalBuyerPresent = !!last.contactNames.technicalBuyerPresent;
    // For non-role gates before the current stage: absent from the mismatch list = done.
    // (Gates belonging to the deal's own current stage aren't itemized by the Sheet -
    // left undefined; the Milestones tab shows "-" for those, not a guess.)
    const gateNames = mismatchDetails.map(d => d.gate);
    ["Incumbent Identified", "SAP Initiated", "Demo Completed", "Solution Reqs + Feasibility",
      "ROI Validated", "Proposal Delivered", "Competitive Landscape Documented",
      "Product Enhancement Signoff", "Budget / EB Commitment"].forEach(gate => {
      const key = {
        "Incumbent Identified": "incumbentIdentified", "SAP Initiated": "sapInitiated",
        "Demo Completed": "demoCompleted", "Solution Reqs + Feasibility": "solutionReqs",
        "ROI Validated": "roiValidated", "Proposal Delivered": "proposalDelivered",
        "Competitive Landscape Documented": "competitiveLandscape",
        "Product Enhancement Signoff": "enhancementSignoff", "Budget / EB Commitment": "budgetConfirmed",
      }[gate];
      if (gateNames.includes(gate)) last.milestonesAbsolute[key] = false;
    });
  }

  return { scored, unscored };
}

export async function getDeals() {
  try {
    const res = await fetch(GVIZ_URL, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
    const text = await res.text();
    const json = parseGvizResponse(text);
    const table = json.table;
    if (!table || !table.rows || !table.rows.length) throw new Error("Sheet returned no rows");

    const headerLabels = table.cols.map(c => c.label);
    const { scored, unscored } = rowsToDeals(headerLabels, table.rows);

    if (!scored.length) throw new Error("Parsed 0 scored deals from live Sheet");

    return { deals: scored, unscored, source: "live", fetchedAt: new Date().toISOString() };
  } catch (err) {
    return {
      deals: FALLBACK_DEALS,
      unscored: FALLBACK_UNSCORED,
      source: "fallback",
      fetchError: String(err.message || err),
      fetchedAt: new Date().toISOString(),
    };
  }
}

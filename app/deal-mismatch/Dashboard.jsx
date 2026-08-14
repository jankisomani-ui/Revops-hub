"use client";
import { useState } from "react";

const B = {
  deepPurple: "#79709E", lavender: "#C9BFE9", lavenderTint: "#D9D5F7",
  grey: "#F4F4F4", white: "#FFFFFF", charcoal: "#040610",
  orange: "#E5974D", teal: "#4A9B8E", red: "#C25450", yellow: "#C9A227",
  border: "rgba(4,6,16,0.12)", serif: "'DM Serif Display', Georgia, serif", sans: "'DM Sans', system-ui, sans-serif",
};

const SF_BASE_URL = "https://certifyos2022.lightning.force.com/lightning/r/Opportunity/";
const STAGES = [
  { num: 1, label: "Interested" }, { num: 2, label: "Team Presentation" },
  { num: 3, label: "Proposal & ROI" }, { num: 4, label: "Finalist" }, { num: 5, label: "Contracting" },
];
const MILESTONES = {
  incumbentIdentified: { label: "Incumbent Identified", weight: 4, stage: 1, role: false },
  sapInitiated: { label: "SAP Initiated", weight: 3, stage: 1, role: false },
  championPresent: { label: "Champion", weight: 10, stage: 2, role: true },
  technicalBuyerPresent: { label: "Technical Buyer", weight: 8, stage: 2, role: true },
  demoCompleted: { label: "Demo Completed", weight: 5, stage: 2, role: false },
  solutionReqs: { label: "Solution Reqs + Feasibility", weight: 9, stage: 2, role: false },
  economicBuyerPresent: { label: "Economic Buyer", weight: 10, stage: 3, role: true },
  roiValidated: { label: "ROI Validated", weight: 9, stage: 3, role: false },
  proposalDelivered: { label: "Proposal Delivered", weight: 5, stage: 3, role: false },
  competitiveLandscape: { label: "Competitive Landscape Documented", weight: 6, stage: 3, role: false },
  enhancementSignoff: { label: "Product Enhancement Signoff", weight: 6, stage: 3, role: false },
  budgetConfirmed: { label: "Budget / EB Commitment", weight: 10, stage: 4, role: false },
};
const SIGNAL_LABELS = { D2: "Likely wrong record", I: "Renewal/Expansion", B: "Buyer deferral", C: "Budget blocker", D1: "Stage/content mismatch", J: "Yo-yo pattern", G: "Leadership change", F: "Active RFP", E: "Competitive dissatisfaction", H: "Verbal target date", K: "Rep sentiment flag", L: "Buyer's Journey mismatch", M: "NextStep staleness" };

function fmt(n) { if (!n) return "$0"; if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`; return `$${(n / 1000).toFixed(0)}K`; }
function daysUntil(closeDate) { if (!closeDate) return null; const close = new Date(closeDate); const today = new Date(); return Math.round((close - today) / (1000 * 60 * 60 * 24)); }

const STATUS = {
  critical: { label: "Critical risk", bg: "rgba(229,151,77,0.12)", text: B.orange },
  "at-risk": { label: "At risk", bg: B.lavenderTint, text: B.deepPurple },
  "on-track": { label: "On track", bg: "rgba(61,153,112,0.10)", text: "#2D7A58" },
};
const SENTIMENT_STYLE = { Red: { bg: "rgba(194,84,80,0.12)", text: B.red }, Yellow: { bg: "rgba(201,162,39,0.12)", text: B.yellow }, Green: { bg: "rgba(61,153,112,0.10)", text: "#2D7A58" } };

export default function Dashboard({ initialDeals, initialUnscored, source, fetchedAt, fetchError }) {
  const [sortMode, setSortMode] = useState("risk");
  const [filterMode, setFilterMode] = useState("all");
  const [allDeals] = useState(initialDeals || []);
  const [unscored] = useState(initialUnscored || []);
  const [selected, setSelected] = useState((initialDeals || [])[0] || null);
  const [tab, setTab] = useState("overview");
  const [showUnscored, setShowUnscored] = useState(false);

  const filteredDeals = allDeals.filter(d => {
    if (filterMode === "netnew") return !d.isRenewalOrExpansion;
    if (filterMode === "renewal") return d.isRenewalOrExpansion;
    return true;
  });

  const deals = [...filteredDeals].sort((a, b) => {
    if (sortMode === "closeDate") {
      const da = daysUntil(a.closeDate), db = daysUntil(b.closeDate);
      if (da === null) return 1; if (db === null) return -1;
      return da - db;
    }
    const order = { critical: 0, "at-risk": 1, "on-track": 2 };
    const r = order[a.riskCategory] - order[b.riskCategory];
    if (r !== 0) return r;
    const da = daysUntil(a.closeDate), db = daysUntil(b.closeDate);
    if (da === null) return 1; if (db === null) return -1;
    return da - db;
  });

  const totalPipeline = deals.reduce((s, d) => s + d.value, 0);
  const weightedAbsolute = deals.reduce((s, d) => s + d.value * d.absoluteScore / 100, 0);
  const criticalCount = deals.filter(d => d.riskCategory === "critical").length;
  const bjMismatchCount = deals.filter(d => d.bjMismatch).length;
  const stage = selected && !selected.unscored ? STAGES.find(s => s.num === selected.stage) : null;
  const dUntil = selected ? daysUntil(selected.closeDate) : null;

  return (
    <div style={{ fontFamily: B.sans, background: B.grey, minHeight: "100vh", color: B.charcoal }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .deal-row { transition: background 0.15s; cursor: pointer; border-left: 3px solid transparent; }
        .deal-row:hover { background: ${B.lavenderTint} !important; }
        .deal-row.active { border-left-color: ${B.deepPurple} !important; background: ${B.lavenderTint} !important; }
        .tab-btn, .sort-btn { cursor: pointer; border: none; background: none; font-family: ${B.sans}; }
        .eyebrow { font-family: ${B.sans}; font-size: 11px; font-weight: 500; letter-spacing: 0.2px; text-transform: uppercase; color: rgba(4,6,16,0.45); }
        .sf-link { font-family: ${B.sans}; font-size: 11px; font-weight: 500; color: ${B.deepPurple}; text-decoration: none; border: 1px solid ${B.lavender}; padding: 3px 9px; border-radius: 3px; }
      `}</style>

      <div style={{ background: B.white, borderBottom: `1px solid ${B.border}`, padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="6" fill={B.deepPurple}/><path d="M14 6L20 10V18L14 22L8 18V10L14 6Z" stroke={B.lavenderTint} strokeWidth="1.5" fill="none"/><circle cx="14" cy="14" r="3" fill={B.white}/></svg>
          <span style={{ fontFamily: B.serif, fontSize: 18 }}>CertifyOS</span>
          <span style={{ width: 1, height: 16, background: B.border, margin: "0 8px" }}/>
          <span style={{ fontFamily: B.sans, fontSize: 13, color: "rgba(4,6,16,0.5)" }}>Sales Command Center</span>
          {source === "live" ? (
            <span style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 500, color: "#2D7A58", background: "rgba(61,153,112,0.1)", padding: "2px 8px", borderRadius: 2, marginLeft: 6, textTransform: "uppercase" }}>Live from Sheet</span>
          ) : (
            <span title={fetchError} style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 500, color: B.orange, background: "rgba(229,151,77,0.12)", padding: "2px 8px", borderRadius: 2, marginLeft: 6, textTransform: "uppercase" }}>⚠ Fallback snapshot</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, background: B.grey, padding: 3, borderRadius: 6 }}>
            {[["all", "All"], ["netnew", "Net-New"], ["renewal", "🔄 Renewal"]].map(([mode, label]) => (
              <button key={mode} className="sort-btn" onClick={() => {
                setFilterMode(mode);
                const nextList = allDeals.filter(d => mode === "all" ? true : mode === "netnew" ? !d.isRenewalOrExpansion : d.isRenewalOrExpansion);
                if (nextList.length && !nextList.find(d => d.id === selected?.id)) setSelected(nextList[0]);
              }} style={{ padding: "6px 12px", borderRadius: 4, fontSize: 12, fontWeight: 600, color: filterMode === mode ? B.white : B.deepPurple, background: filterMode === mode ? B.deepPurple : "transparent" }}>{label}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, background: B.grey, padding: 3, borderRadius: 6 }}>
            {[["risk", "Sort: Risk"], ["closeDate", "Sort: Close Date"]].map(([mode, label]) => (
              <button key={mode} className="sort-btn" onClick={() => setSortMode(mode)} style={{ padding: "6px 12px", borderRadius: 4, fontSize: 12, fontWeight: 600, color: sortMode === mode ? B.white : B.deepPurple, background: sortMode === mode ? B.deepPurple : "transparent" }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: B.border }}>
        {[
          { label: `Total pipeline (${deals.length} shown${filterMode !== "all" ? ", filtered" : ""})`, value: fmt(totalPipeline), sub: filterMode === "all" ? `${unscored.length} pending re-score` : `Filter: ${filterMode === "netnew" ? "Net-New only" : "Renewal/Expansion only"}`, accent: B.deepPurple },
          { label: "Weighted forecast (Absolute)", value: fmt(weightedAbsolute), sub: `${totalPipeline ? Math.round(weightedAbsolute / totalPipeline * 100) : 0}% of pipeline`, accent: "#3D9970" },
          { label: "Critical risk", value: `${criticalCount} of ${deals.length}`, sub: `${deals.filter(d => d.riskCategory === "at-risk").length} at risk, ${deals.filter(d => d.riskCategory === "on-track").length} on-track`, accent: B.orange },
          { label: "🔀 Buyer's Journey vs. CRM mismatch", value: `${bjMismatchCount} deals`, sub: "Independent tracker disagrees with stage", accent: B.deepPurple },
        ].map((c, i) => (
          <div key={i} style={{ background: B.white, padding: "18px 20px" }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontFamily: B.serif, fontSize: 24, color: c.accent }}>{c.value}</div>
            <div style={{ fontFamily: B.sans, fontSize: 11, color: "rgba(4,6,16,0.45)", marginTop: 5 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", minHeight: "calc(100vh - 168px)", gap: 1, background: B.border }}>
        <div style={{ background: B.white, overflow: "auto" }}>
          <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${B.border}` }}>
            <div className="eyebrow">Deals — {sortMode === "risk" ? "risk ranked" : "closing soonest"}{filterMode !== "all" ? ` · ${filterMode === "netnew" ? "Net-New" : "Renewal/Expansion"}` : ""}</div>
          </div>
          {deals.map(deal => {
            const st = STATUS[deal.riskCategory] || STATUS["on-track"]; const isActive = selected?.id === deal.id; const dU = daysUntil(deal.closeDate);
            return (
              <div key={deal.id} className={`deal-row${isActive ? " active" : ""}`} onClick={() => { setSelected(deal); setTab("overview"); }}
                style={{ padding: "14px 20px", borderBottom: `1px solid ${B.border}`, background: isActive ? B.lavenderTint : B.white }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <div>
                    <div style={{ fontFamily: B.serif, fontSize: 15 }}>{deal.name}</div>
                    <div style={{ fontFamily: B.sans, fontSize: 11, color: "rgba(4,6,16,0.45)" }}>{deal.owner} · Stage {deal.stage} — {(STAGES.find(s => s.num === deal.stage) || STAGES[0]).label}</div>
                  </div>
                  <span style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 500, textTransform: "uppercase", background: st.bg, color: st.text, padding: "3px 8px", borderRadius: 2, height: "fit-content" }}>{st.label}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: B.sans, fontSize: 14, fontWeight: 600, color: B.deepPurple }}>{fmt(deal.value)}</span>
                  <span style={{ fontFamily: B.sans, fontSize: 11, color: "rgba(4,6,16,0.5)" }}><b style={{ color: B.charcoal }}>{deal.absoluteScore}%</b> abs {deal.inferredScore !== deal.absoluteScore && <>/ <b style={{ color: B.deepPurple }}>{deal.inferredScore}%</b> inf</>}</span>
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
                  {deal.isRenewalOrExpansion && <span style={{ fontSize: 10, color: B.teal, background: "rgba(74,155,142,0.12)", padding: "2px 6px", borderRadius: 3, fontWeight: 600 }}>🔄 Renewal</span>}
                  {deal.repSentiment && <span style={{ fontSize: 10, fontWeight: 700, ...(SENTIMENT_STYLE[deal.repSentiment] || {}), padding: "2px 6px", borderRadius: 3 }}>● Sentiment: {deal.repSentiment}</span>}
                  {deal.bjMismatch && <span style={{ fontSize: 10, color: B.deepPurple, background: B.lavenderTint, padding: "2px 6px", borderRadius: 3, fontWeight: 600 }}>🔀 BJ mismatch</span>}
                  {deal.nextStepStale?.stillPending && <span style={{ fontSize: 10, color: B.orange, background: "rgba(229,151,77,0.15)", padding: "2px 6px", borderRadius: 3, fontWeight: 600 }}>⏱ NextStep stale</span>}
                  {deal.dataQuirk && <span style={{ fontSize: 10, color: "rgba(4,6,16,0.4)", background: B.grey, padding: "2px 6px", borderRadius: 3 }}>⚠ parse quirk</span>}
                </div>
                <div style={{ fontFamily: B.sans, fontSize: 10, color: "rgba(4,6,16,0.4)" }}>{dU === null ? "No close date set" : dU < 0 ? `${Math.abs(dU)}d past close date` : `Closes in ${dU}d`}</div>
              </div>
            );
          })}
          {unscored.length > 0 && (
            <div style={{ padding: "12px 20px", borderTop: `2px solid ${B.border}`, background: B.grey }}>
              <button className="sort-btn" onClick={() => setShowUnscored(!showUnscored)} style={{ fontSize: 11, fontWeight: 600, color: B.deepPurple, display: "flex", alignItems: "center", gap: 6 }}>
                {showUnscored ? "▾" : "▸"} Pending re-score ({unscored.length})
              </button>
              {showUnscored && unscored.map(u => (
                <div key={u.id} className="deal-row" onClick={() => { setSelected({ ...u, unscored: true }); setTab("overview"); }} style={{ padding: "12px 8px 4px", cursor: "pointer" }}>
                  <div style={{ fontFamily: B.serif, fontSize: 14 }}>{u.name}</div>
                  <div style={{ fontFamily: B.sans, fontSize: 11, color: "rgba(4,6,16,0.45)", marginBottom: 4 }}>{u.owner} · {fmt(u.value)}</div>
                  {u.repSentiment && <span style={{ fontSize: 10, fontWeight: 700, ...(SENTIMENT_STYLE[u.repSentiment] || {}), padding: "2px 6px", borderRadius: 3 }}>● Sentiment: {u.repSentiment}</span>}
                  <span style={{ fontSize: 10, color: "rgba(4,6,16,0.5)", background: B.grey, padding: "2px 6px", borderRadius: 3, marginLeft: 4 }}>Not yet scored</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div style={{ background: B.grey, overflow: "auto" }}>
            <div style={{ background: B.white, borderBottom: `1px solid ${B.border}`, padding: "20px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                <h2 style={{ fontFamily: B.serif, fontSize: 26, fontWeight: 400 }}>{selected.name}</h2>
                {selected.unscored ? (
                  <span style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", background: B.grey, color: "rgba(4,6,16,0.5)", padding: "3px 10px", borderRadius: 2 }}>Not yet scored</span>
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", background: (STATUS[selected.riskCategory] || STATUS["on-track"]).bg, color: (STATUS[selected.riskCategory] || STATUS["on-track"]).text, padding: "3px 10px", borderRadius: 2 }}>{(STATUS[selected.riskCategory] || STATUS["on-track"]).label}</span>
                )}
                {selected.isRenewalOrExpansion && <span style={{ fontSize: 10, fontWeight: 600, color: B.teal, background: "rgba(74,155,142,0.12)", padding: "3px 10px", borderRadius: 2 }}>🔄 Renewal/Expansion</span>}
                {selected.repSentiment && <span style={{ fontSize: 10, fontWeight: 700, ...(SENTIMENT_STYLE[selected.repSentiment] || {}), padding: "3px 10px", borderRadius: 2 }}>● Rep Sentiment: {selected.repSentiment}</span>}
                <a className="sf-link" href={`${SF_BASE_URL}${selected.id}/view`} target="_blank" rel="noopener noreferrer">Open in Salesforce ↗</a>
              </div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[["Value", fmt(selected.value)], ["Owner", selected.owner], ["Stage", selected.unscored ? "1 — Interested" : `${selected.stage} — ${(stage || STAGES[0]).label}`], ["Close target", selected.closeDate || "Not set"], ["Days until close", dUntil === null ? "—" : dUntil < 0 ? `${Math.abs(dUntil)}d past due` : `${dUntil}d`]].map(([k, v]) => (
                  <div key={k}><span className="eyebrow">{k}: </span><span style={{ fontSize: 12, fontWeight: 500 }}>{v}</span></div>
                ))}
              </div>
              {selected.dataQuirk && <div style={{ marginTop: 10, fontSize: 11, color: "rgba(4,6,16,0.5)" }}>⚠ This deal's last run had a parse hiccup on one of its three model calls — data shown is usable but worth a re-run to confirm.</div>}
              {selected.unscored && <div style={{ marginTop: 10, padding: "10px 14px", background: B.lavenderTint, borderRadius: 4, fontSize: 12, lineHeight: 1.6 }}>{selected.note}</div>}
            </div>

            {!selected.unscored && (
              <>
                <div style={{ background: B.white, borderBottom: `1px solid ${B.border}`, padding: "0 32px", display: "flex" }}>
                  {["overview", "milestones"].map(t => (
                    <button key={t} className="tab-btn" onClick={() => setTab(t)} style={{ padding: "14px 20px", fontSize: 13, fontWeight: tab === t ? 600 : 400, color: tab === t ? B.deepPurple : "rgba(4,6,16,0.5)", borderBottom: tab === t ? `2px solid ${B.deepPurple}` : "2px solid transparent" }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                  ))}
                </div>
                <div style={{ padding: "24px 32px" }}>
                  {tab === "overview" ? <OverviewTab selected={selected} /> : <MilestonesTab selected={selected} />}
                </div>
              </>
            )}
            {selected.unscored && (
              <div style={{ padding: "24px 32px" }}>
                <Card accent={B.orange}>
                  <div className="eyebrow" style={{ marginBottom: 10, color: B.orange }}>Real NextStep on file</div>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>{selected.nextStep || "—"}</p>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: "10px 32px", fontSize: 10, color: "rgba(4,6,16,0.35)", background: B.white, borderTop: `1px solid ${B.border}` }}>
        Data source: {source === "live" ? "Live Google Sheet" : "Embedded fallback snapshot"} · Last checked {fetchedAt ? new Date(fetchedAt).toLocaleString() : "—"}
      </div>
    </div>
  );
}

function ScoreBar({ absolute, inferred }) {
  const gap = inferred - absolute;
  return (
    <div>
      <div style={{ position: "relative", height: 16, background: B.grey, borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
        {gap > 0 && <div style={{ position: "absolute", inset: 0, width: `${inferred}%`, background: B.lavender }} />}
        <div style={{ position: "absolute", inset: 0, width: `${absolute}%`, background: absolute < 30 ? B.orange : B.charcoal }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12 }}><b>{absolute}%</b> Absolute</span>
        {gap > 0 ? <span style={{ fontSize: 12, color: B.deepPurple }}><b>{inferred}%</b> Inferred (+{gap}pt)</span> : <span style={{ fontSize: 12, color: "rgba(4,6,16,0.4)" }}>No gap</span>}
      </div>
    </div>
  );
}

function OverviewTab({ selected }) {
  const roles = ["championPresent", "economicBuyerPresent", "technicalBuyerPresent"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {selected.bjMismatch && (
        <div style={{ gridColumn: "1 / -1", padding: "12px 16px", background: B.lavenderTint, border: `1px solid ${B.deepPurple}`, borderRadius: 4 }}>
          <span style={{ fontSize: 16 }}>🔀</span> <b style={{ fontSize: 13, color: B.deepPurple }}>Buyer's Journey disagrees with the CRM stage</b> — an independent tracker shows real progress well behind what the Opportunity's StageName implies.
        </div>
      )}
      {selected.nextStepStale?.stillPending && (
        <div style={{ gridColumn: "1 / -1", padding: "12px 16px", background: "rgba(229,151,77,0.12)", border: `1px solid ${B.orange}`, borderRadius: 4 }}>
          <span style={{ fontSize: 16 }}>⏱</span> <b style={{ fontSize: 13, color: B.orange }}>NextStep is stale</b> — {selected.nextStepStale.detail || "the rep's own note still describes pending, unresolved work."}
        </div>
      )}
      {selected.topSignals && selected.topSignals.length > 0 && (
        <div style={{ gridColumn: "1 / -1", padding: "12px 16px", background: B.lavenderTint, borderLeft: `3px solid ${B.deepPurple}`, borderRadius: 4 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Signals</div>
          {selected.topSignals.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < selected.topSignals.length - 1 ? 8 : 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: B.deepPurple, background: B.white, padding: "2px 6px", borderRadius: 3, height: "fit-content" }}>{SIGNAL_LABELS[s.category] || s.category}</span>
              <span style={{ fontSize: 13 }}>{s.sentence}</span>
            </div>
          ))}
        </div>
      )}
      <Card><div className="eyebrow" style={{ marginBottom: 16 }}>Milestone forecast</div><ScoreBar absolute={selected.absoluteScore} inferred={selected.inferredScore} />
        {selected.inferencesApplied && selected.inferencesApplied.length > 0 && (
          <div style={{ marginTop: 14, padding: "10px 14px", background: B.lavenderTint, borderRadius: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: B.deepPurple, marginBottom: 6 }}>What's driving the gap:</div>
            {selected.inferencesApplied.map((inf, i) => <div key={i} style={{ fontSize: 11, color: "rgba(4,6,16,0.6)", marginBottom: 2 }}>{inf.note}</div>)}
          </div>
        )}
      </Card>
      <Card><div className="eyebrow" style={{ marginBottom: 14 }}>Contact roles</div>
        {roles.map((key, i) => {
          const present = selected.milestonesAbsolute[key]; const name = selected.contactNames[key]; const meta = MILESTONES[key];
          return <div key={key} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 10, marginBottom: 10, borderBottom: i < 2 ? `1px solid ${B.border}` : "none" }}><span style={{ fontSize: 13 }}>{meta.label}</span><span style={{ fontSize: 12, color: present ? "#2D7A58" : B.orange, fontWeight: 500 }}>{present ? `✓ ${name}` : "✕ Not linked"}</span></div>;
        })}
      </Card>
      {selected.stageMismatchDetails && selected.stageMismatchDetails.length > 0 && (
        <Card accent={B.orange}><div className="eyebrow" style={{ marginBottom: 12, color: B.orange }}>Stage gaps · {selected.stageMismatchDetails.length}</div>
          {selected.stageMismatchDetails.map((g, i) => <div key={i} style={{ fontSize: 13, marginBottom: 6 }}><b>{g.gate}</b> — required since {g.requiredSince}</div>)}
        </Card>
      )}
      {selected.redFlags && selected.redFlags.length > 0 && (
        <Card><div className="eyebrow" style={{ marginBottom: 14, color: B.orange }}>Additional red flags</div>
          {selected.redFlags.map((flag, i) => <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}><span style={{ color: B.orange }}>✕</span><span style={{ fontSize: 13 }}>{flag}</span></div>)}
        </Card>
      )}
      <Card accent={B.deepPurple}><div className="eyebrow" style={{ marginBottom: 10, color: B.deepPurple }}>Why this risk level</div><p style={{ fontSize: 13, lineHeight: 1.6 }}>{selected.riskRationale}</p></Card>
      <Card accent={"#2D7A58"}><div className="eyebrow" style={{ marginBottom: 10, color: "#2D7A58" }}>This week's action</div><p style={{ fontSize: 13, lineHeight: 1.6 }}>{selected.svpRecommendation}</p></Card>
    </div>
  );
}

function MilestonesTab({ selected }) {
  return (
    <div style={{ background: B.white, border: `1px solid ${B.border}`, borderRadius: 4, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px", padding: "12px 20px", borderBottom: `1px solid ${B.border}`, background: B.grey }}>
        {["Milestone", "Weight", "Status"].map((h, i) => <div key={h} className="eyebrow" style={{ textAlign: i > 0 ? "center" : "left" }}>{h}</div>)}
      </div>
      {STAGES.filter(s => s.num <= selected.stage).map(sm => {
        const ms = Object.entries(MILESTONES).filter(([, m]) => m.stage === sm.num);
        if (!ms.length) return null;
        return (
          <div key={sm.num}>
            <div style={{ padding: "9px 20px", background: B.lavenderTint }}><span className="eyebrow">Stage {sm.num} — {sm.label}</span></div>
            {ms.map(([key, meta], i, arr) => {
              const done = selected.milestonesAbsolute[key];
              const unknown = done === undefined;
              const blocking = sm.num < selected.stage && done === false;
              const name = meta.role ? selected.contactNames[key] : null;
              return (
                <div key={key} style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px", padding: "11px 20px", borderBottom: i < arr.length - 1 ? `1px solid ${B.border}` : "none", background: blocking ? "rgba(229,151,77,0.05)" : B.white, alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: done ? B.charcoal : "rgba(4,6,16,0.5)" }}>{meta.label}</span>
                    {blocking && <span style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", color: B.orange, background: "rgba(229,151,77,0.12)", padding: "2px 7px", borderRadius: 2 }}>Blocking</span>}
                    {meta.role && done && <span style={{ fontSize: 11, color: "rgba(4,6,16,0.45)" }}>— {name}</span>}
                  </div>
                  <div style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: meta.weight >= 9 ? B.orange : meta.weight >= 7 ? B.deepPurple : "rgba(4,6,16,0.5)" }}>{meta.weight}</div>
                  <div style={{ textAlign: "center" }}>{unknown ? <span style={{ color: "rgba(4,6,16,0.3)" }} title="Not itemized in this week's snapshot for the deal's own current stage">—</span> : done ? <span style={{ color: "#3D9970" }}>✓</span> : <span style={{ color: blocking ? B.orange : B.lavender }}>✕</span>}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function Card({ children, accent }) {
  return <div style={{ background: B.white, border: `1px solid ${B.border}`, borderLeft: accent ? `3px solid ${accent}` : `1px solid ${B.border}`, borderRadius: 4, padding: "20px 22px" }}>{children}</div>;
}

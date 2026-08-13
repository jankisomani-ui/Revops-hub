const STAGES = [
  {
    step: "Stage 0",
    name: "Pre-Funnel Intent",
    pct: "—",
    live: false,
    tools: [],
    coverage: "Not yet built — Seam AI / Grw.ai dependent",
  },
  {
    step: "Stage 1",
    name: "Interested",
    pct: "5%",
    live: true,
    tools: ["MEDDIC Gap Detection (UC4)", "Single-Threaded Risk (UC7)", "Economic Buyer Absence (UC15)"],
    coverage: "Live — daily cron + webhook",
  },
  {
    step: "Stage 2",
    name: "Team Presentation",
    pct: "20%",
    live: true,
    tools: ["Silent Stakeholder Detection (UC11)", "Battle Card Generation (UC16)"],
    coverage: "Live — Gong webhook triggered",
  },
  {
    step: "Stage 3",
    name: "Proposal & ROI",
    pct: "40%",
    live: true,
    tools: ["ROI Model Builder (UC14)", "RFP Assistant (UC24)", "SAP Document Generator (UC10)"],
    coverage: "Live — form-driven + webhook",
  },
  {
    step: "Stage 4",
    name: "Finalist",
    pct: "60%",
    live: false,
    tools: [],
    coverage: "No coverage yet — 0 deals currently here",
  },
  {
    step: "Stage 5",
    name: "Contracting",
    pct: "90%",
    live: false,
    tools: [],
    coverage: "No coverage yet — 1 deal here ($368K ARR)",
  },
  {
    step: "Stage 6",
    name: "Closed Won",
    pct: "100%",
    live: true,
    tools: ["Handoff Brief (UC21)"],
    coverage: "Live — Salesforce Closed Won trigger",
  },
]

export default function JourneyPage() {
  return (
    <>
      <section style={{
        position: "relative",
        background: "#79709E",
        color: "#FFFFFF",
        padding: "64px 56px 72px",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: 400, height: 400,
          borderRadius: "50%", background: "#D9D5F7",
          top: -210, right: -150,
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 620 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.2, textTransform: "uppercase", color: "#FFFFFF", margin: "0 0 14px" }}>
            Journey Coverage
          </p>
          <h1 style={{
            fontFamily: "'Ivar Text', Lora, serif",
            fontWeight: 400, fontSize: 48,
            lineHeight: 1.15, margin: "0 0 20px", color: "#FFFFFF",
          }}>
            Where AI is live across the buyer's journey
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.4, margin: 0, color: "#FFFFFF" }}>
            7 stages. 4 with live coverage. Gaps are real — Finalist and Contracting have no AI yet.
          </p>
        </div>
      </section>

      <div style={{ padding: "48px 56px 80px" }}>
        <p className="eyebrow yellow-rule" style={{ margin: "0 0 32px" }}>Stage map</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {STAGES.map(({ step, name, pct, live, tools, coverage }) => (
            <div
              key={step}
              className="card"
              style={{
                padding: "24px 28px",
                display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap",
                borderLeft: live ? "3px solid #79709E" : "3px solid #C9BFE9",
              }}
            >
              {/* Stage label */}
              <div style={{ flexShrink: 0, width: 100 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#6E6F75", margin: "0 0 4px" }}>{step}</p>
                <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{name}</p>
                <p style={{ fontSize: 13, color: "#6E6F75", margin: 0 }}>{pct}</p>
              </div>

              {/* Tools */}
              <div style={{ flex: 1, minWidth: 220 }}>
                {tools.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {tools.map((t) => (
                      <span key={t} style={{
                        fontSize: 12, fontWeight: 700,
                        background: "#D9D5F7",
                        borderRadius: 999, padding: "5px 12px",
                        color: "#040610",
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 14, color: "#6E6F75", margin: 0, fontStyle: "italic" }}>
                    No tools yet
                  </p>
                )}
              </div>

              {/* Status */}
              <div style={{ flexShrink: 0 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: 12, fontWeight: 700,
                  letterSpacing: 0.2, textTransform: "uppercase",
                  background: live ? "#D9D5F7" : "#F4F4F4",
                  borderRadius: 999, padding: "5px 12px",
                  color: "#040610",
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: live ? "#79709E" : "#C9BFE9",
                    flexShrink: 0,
                  }} />
                  {live ? "Live" : "Not built"}
                </span>
                <p style={{ fontSize: 12, color: "#6E6F75", margin: "8px 0 0" }}>{coverage}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cross-stage cadences */}
        <div style={{ marginTop: 48, background: "#FFFFFF", border: "1px solid #C9BFE9", borderRadius: 16, padding: 28 }}>
          <p className="eyebrow" style={{ margin: "0 0 20px" }}>Cross-stage cadences</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { name: "Engine 1 — Deal Scoring", freq: "On demand", desc: "Milestone + signal scoring across all 86 open deals. Three Claude calls per deal." },
              { name: "UC4 — MEDDIC Gaps", freq: "Daily cron + webhook", desc: "Runs every morning as safety net. Also fires on Gong call completion." },
              { name: "UC7 — Single-Thread Risk", freq: "Weekly Friday 8 AM", desc: "Flags deals with only one contact after 7+ days in Stage 1." },
              { name: "UC15 — EB Absence", freq: "Weekly cron + webhook", desc: "Checks Economic Buyer presence in proposal meetings." },
            ].map(({ name, freq, desc }) => (
              <div key={name}>
                <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{name}</p>
                <p style={{ fontSize: 12, color: "#79709E", fontWeight: 700, margin: "0 0 8px" }}>{freq}</p>
                <p style={{ fontSize: 13, color: "#6E6F75", margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

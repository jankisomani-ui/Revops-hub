const ENGINE1_URL = process.env.NEXT_PUBLIC_ENGINE1_URL || "https://n8n-sales-usecase.vercel.app"

export default function CommandCenterPage() {
  return (
    <>
      {/* Hero */}
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
            Sales Leader Command Center
          </p>
          <h1 style={{
            fontFamily: "'Ivar Text', Lora, serif",
            fontWeight: 400, fontSize: 48,
            lineHeight: 1.15, margin: "0 0 20px", color: "#FFFFFF",
          }}>
            Pipeline intelligence
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.4, margin: "0 0 28px", color: "#FFFFFF" }}>
            Engine 1 scores every open deal against the buyer's journey. Three Claude calls per deal — milestone scoring, signal detection, risk judgment.
          </p>
          <a
            href={ENGINE1_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#F3C948", color: "#040610",
              fontWeight: 700, fontSize: 15,
              padding: "12px 24px", borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Open Command Center →
          </a>
        </div>
      </section>

      {/* What it covers */}
      <div style={{ padding: "48px 56px 80px" }}>
        <p className="eyebrow yellow-rule" style={{ margin: "0 0 32px" }}>What Engine 1 tracks</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[
            { title: "Milestone scoring", body: "Absolute score from buyer's journey gate completion. Inferred score from rep activity signals in Gong." },
            { title: "Signal detection", body: "Reads Gong transcripts for buyer deferrals, budget constraints, silent stakeholders, and stage-content mismatches." },
            { title: "Risk judgment", body: "Three-level output: On Track / At Risk / Critical. Driven by milestone gaps + signal weight." },
            { title: "86 deals covered", body: "Full pipeline — not just hunting opps. Excludes test/demo accounts. Runs on demand via n8n workflow." },
          ].map(({ title, body }) => (
            <div key={title} className="card" style={{ padding: 28 }}>
              <h3 style={{ fontFamily: "'Ivar Text', Lora, serif", fontWeight: 400, fontSize: 20, margin: "0 0 12px" }}>
                {title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, color: "#040610" }}>{body}</p>
            </div>
          ))}
        </div>

        {/* Open items callout */}
        <div style={{
          marginTop: 40,
          background: "#FFFFFF",
          border: "1px solid #C9BFE9",
          borderRadius: 16,
          padding: 28,
        }}>
          <p className="eyebrow" style={{ margin: "0 0 16px" }}>Open calibration items</p>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.8, color: "#040610" }}>
            <li>68 of 86 deals currently scoring Critical — known calibration issue, not production-ready for Mitch yet</li>
            <li>Sheet debugging rows need cleanup before sharing</li>
            <li>Contracting-stage milestone definition still undefined</li>
            <li><code>stage_mismatch</code> vs. Buyer's Journey double-counting unresolved</li>
          </ul>
        </div>
      </div>
    </>
  )
}

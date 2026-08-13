import Link from "next/link"

const TOOLS = [
  {
    href: "/jarvis",
    icon: "◎",
    name: "Sales Jarvis",
    desc: "Ask anything about the pipeline. Pick a question and get an answer from the live deal record — not cached data.",
    health: "Live",
    lastRun: "Reads on demand",
    sources: "Salesforce · Gong",
  },
  {
    href: "/command-center",
    icon: "▦",
    name: "Command Center",
    desc: "Full pipeline view for sales leadership. Milestone scores, signal flags, and stage health across all 86 deals.",
    health: "Live",
    lastRun: "Engine 1 · last run today",
    sources: "Salesforce · Gong",
  },
  {
    href: "/rfp",
    icon: "◻",
    name: "RFP Assistant",
    desc: "Upload a requirements sheet. Every question is matched against the approved answer bank and drafted for your review.",
    health: "Live",
    lastRun: "Per submission",
    sources: "Answer bank · Google Drive",
  },
  {
    href: "/roi",
    icon: "◈",
    name: "ROI Model",
    desc: "Three inputs — staffing, claims volume, providers. The model does the rest and sends you a populated sheet to review.",
    health: "Live",
    lastRun: "Per submission",
    sources: "Frozen CertifyOS model",
  },
  {
    href: "/journey",
    icon: "→",
    name: "Journey Coverage",
    desc: "Which stages have AI coverage, which don't, and what each tool is watching for at every gate.",
    health: "Reference",
    lastRun: "Static",
    sources: "Program map",
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section style={{
        position: "relative",
        background: "#79709E",
        color: "#FFFFFF",
        padding: "72px 56px 80px",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", width: 620, height: 620,
          borderRadius: "50%", border: "1px solid #C9BFE9",
          top: -300, right: -300,
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400,
          borderRadius: "50%", background: "#D9D5F7",
          top: -210, right: -150,
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 620 }}>
          <p className="eyebrow-white" style={{ margin: "0 0 14px" }}>
            Internal — Revenue Operations
          </p>
          <h1 style={{
            fontFamily: "'Ivar Text', Lora, serif",
            fontWeight: 400,
            fontSize: 56,
            lineHeight: 1.15,
            margin: "0 0 20px",
            color: "#FFFFFF",
          }}>
            Every AI tool for the buyer's journey
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.4, margin: 0, color: "#FFFFFF" }}>
            Five tools, one place. Each one reads live from the systems the deal already lives in.
          </p>
        </div>
      </section>

      {/* Tool grid */}
      <div style={{ padding: "48px 56px 80px" }}>
        <p className="eyebrow yellow-rule" style={{ margin: "0 0 24px" }}>Tools</p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}>
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} style={{ textDecoration: "none" }}>
              <div className="card" style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                padding: 28,
                cursor: "pointer",
                height: "100%",
              }}>
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <span style={{
                    width: 44, height: 44,
                    borderRadius: "50%",
                    background: "#D9D5F7",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20,
                  }}>
                    {tool.icon}
                  </span>
                  <span className="pill">
                    <span className="pill-dot" />
                    {tool.health}
                  </span>
                </div>

                <h2 style={{
                  fontFamily: "'Ivar Text', Lora, serif",
                  fontWeight: 400,
                  fontSize: 24,
                  lineHeight: 1.15,
                  margin: 0,
                }}>
                  {tool.name}
                </h2>

                <p style={{ fontSize: 14, lineHeight: 1.4, margin: 0, color: "#040610" }}>
                  {tool.desc}
                </p>

                <dl style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "6px 16px",
                  margin: "8px 0 0",
                  fontSize: 12,
                }}>
                  <dt className="eyebrow">Last run</dt>
                  <dd style={{ margin: 0 }}>{tool.lastRun}</dd>
                  <dt className="eyebrow">Reads</dt>
                  <dd style={{ margin: 0 }}>{tool.sources}</dd>
                </dl>

                <span style={{
                  marginTop: "auto",
                  paddingTop: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#79709E",
                }}>
                  Open →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

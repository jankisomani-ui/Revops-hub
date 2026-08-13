const ROI_URL = process.env.NEXT_PUBLIC_ROI_URL || "https://certifyos-roi-model-request-certify-os.vercel.app"

const STEPS = [
  { n: "01", name: "Account", text: "Name the opportunity. This maps to the Salesforce deal and sets the output folder." },
  { n: "02", name: "Staffing", text: "Number of FTEs across credentialing, enrollment, monitoring, and roster functions." },
  { n: "03", name: "Volume", text: "Claims volume, total enrollees, total providers. Three numbers — nothing else required." },
  { n: "04", name: "Review", text: "The populated model comes back to you to sanity-check before any client sees it." },
]

export default function ROIPage() {
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
            ROI Model Builder
          </p>
          <h1 style={{
            fontFamily: "'Ivar Text', Lora, serif",
            fontWeight: 400, fontSize: 48,
            lineHeight: 1.15, margin: "0 0 20px", color: "#FFFFFF",
          }}>
            Pre-populated ROI model in three inputs
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.4, margin: "0 0 28px", color: "#FFFFFF" }}>
            Account, staffing, volume. The frozen CertifyOS model does the rest — unknown fields default to benchmarks rather than blocking the request.
          </p>
          <a
            href={ROI_URL}
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
            Open ROI Model →
          </a>
        </div>
      </section>

      <div style={{ padding: "48px 56px 80px" }}>
        <p className="eyebrow yellow-rule" style={{ margin: "0 0 32px" }}>How it works</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 48 }}>
          {STEPS.map(({ n, name, text }) => (
            <div key={n} className="card" style={{ padding: 28 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#6E6F75", margin: "0 0 12px" }}>{n}</p>
              <h3 style={{
                fontFamily: "'Ivar Text', Lora, serif",
                fontWeight: 400, fontSize: 20, margin: "0 0 12px",
              }}>
                {name}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* What the model covers */}
        <div style={{ background: "#FFFFFF", border: "1px solid #C9BFE9", borderRadius: 16, padding: 28 }}>
          <p className="eyebrow" style={{ margin: "0 0 20px" }}>Savings categories in the model</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              "Payment integrity",
              "Fraud, waste & abuse",
              "Directory accuracy",
              "Care routing",
              "Prior authorization",
              "FTE credentialing time",
              "Provider onboarding speed",
            ].map((cat) => (
              <span key={cat} style={{
                fontSize: 13, fontWeight: 700,
                background: "#D9D5F7",
                borderRadius: 999,
                padding: "6px 14px",
                color: "#040610",
              }}>
                {cat}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#6E6F75", margin: "20px 0 0" }}>
            Master template is frozen — the automation copies it per deal and overwrites only the input cells. The master is never edited.
          </p>
        </div>
      </div>
    </>
  )
}

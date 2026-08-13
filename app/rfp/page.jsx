const RFP_URL = process.env.NEXT_PUBLIC_RFP_URL || "https://certifyos-rfp-assistant.vercel.app"

const STEPS = [
  { n: "01", name: "Upload", text: "Drop in the requirements sheet. Excel extracts cleanly; PDF depends on the layout." },
  { n: "02", name: "Match", text: "Each requirement is matched by category against the 1,143-row approved answer bank." },
  { n: "03", name: "Draft", text: "Answers are pulled verbatim where one exists, drafted where none does. No embedded hedges." },
  { n: "04", name: "Review", text: "You get an emailed review sheet. Every answer needs your approval before it goes out." },
]

export default function RFPPage() {
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
            RFP Assistant
          </p>
          <h1 style={{
            fontFamily: "'Ivar Text', Lora, serif",
            fontWeight: 400, fontSize: 48,
            lineHeight: 1.15, margin: "0 0 20px", color: "#FFFFFF",
          }}>
            First-draft RFP responses in minutes
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.4, margin: "0 0 28px", color: "#FFFFFF" }}>
            Upload a requirements sheet. Every question is matched against the approved answer bank and drafted for your review.
          </p>
          <a
            href={RFP_URL}
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
            Open RFP Assistant →
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

        {/* Answer bank stats */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #C9BFE9",
          borderRadius: 16, padding: 28,
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24,
        }}>
          {[
            { label: "Answer bank rows", value: "1,143" },
            { label: "Categories", value: "11" },
            { label: "Match threshold", value: "≥75% auto-pull" },
            { label: "Below 30%", value: "Flagged as new req" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="eyebrow" style={{ margin: "0 0 8px" }}>{label}</p>
              <p style={{
                fontFamily: "'Ivar Text', Lora, serif",
                fontSize: 32, fontWeight: 400,
                color: "#79709E", margin: 0,
              }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

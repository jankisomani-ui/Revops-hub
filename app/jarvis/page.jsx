"use client"
import { useState } from "react"

const PRESETS = [
  { id: "meddic_gaps",        label: "Which deals have MEDDIC gaps?",          count: "Across all open deals" },
  { id: "eb_absent",          label: "Which proposals had no Economic Buyer?",  count: "Stage 3 and above" },
  { id: "single_threaded",    label: "Which deals are single-threaded?",        count: "Stage 1 and above" },
  { id: "silent_stakeholder", label: "Which demos had a silent stakeholder?",   count: "Stage 2 and above" },
  { id: "closing_no_activity",label: "Deals closing this month with no activity in 14+ days", count: "All stages" },
  { id: "champion_risk",      label: "Which champions are at risk?",            count: "Stage 1–3" },
  { id: "stale_next_step",    label: "Which deals have stale next-step notes?", count: "All open deals" },
  { id: "call_prep",          label: "Prep me for an upcoming call",            count: "Per deal" },
]

const N8N_WEBHOOK = process.env.NEXT_PUBLIC_JARVIS_WEBHOOK || ""

export default function JarvisPage() {
  const [selected, setSelected] = useState(null)
  const [dealName, setDealName] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function run(presetId) {
    setSelected(presetId)
    setResult(null)
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preset: presetId, dealName }),
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError("Could not reach the workflow. Check that the n8n webhook is live.")
    } finally {
      setLoading(false)
    }
  }

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
          <p className="eyebrow-white" style={{ margin: "0 0 14px" }}>Sales Jarvis</p>
          <h1 style={{
            fontFamily: "'Ivar Text', Lora, serif",
            fontWeight: 400, fontSize: 48,
            lineHeight: 1.15, margin: "0 0 20px", color: "#FFFFFF",
          }}>
            Ask anything
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.4, margin: 0, color: "#FFFFFF" }}>
            Pick a question. Each one reads live from the deal record every time you run it.
          </p>
        </div>
      </section>

      <div style={{ padding: "48px 56px 80px" }}>

        {/* Optional deal name for per-deal presets */}
        <div style={{ marginBottom: 32, maxWidth: 480 }}>
          <label className="eyebrow" style={{ display: "block", marginBottom: 8 }}>
            Deal name (optional — required for call prep)
          </label>
          <input
            value={dealName}
            onChange={e => setDealName(e.target.value)}
            placeholder="e.g. BCBS Illinois — PDM"
            style={{
              width: "100%",
              padding: "10px 16px",
              border: "1px solid #C9BFE9",
              borderRadius: 999,
              font: "inherit",
              fontSize: 14,
              background: "#FFFFFF",
              color: "#040610",
              outline: "none",
            }}
          />
        </div>

        {/* Preset grid */}
        <p className="eyebrow yellow-rule" style={{ margin: "0 0 24px" }}>Questions</p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 48,
        }}>
          {PRESETS.map((q) => (
            <button
              key={q.id}
              onClick={() => run(q.id)}
              className="card"
              style={{
                display: "flex", flexDirection: "column", gap: 16,
                padding: 24, textAlign: "left", font: "inherit",
                color: "#040610", cursor: "pointer", minHeight: 120,
                position: "relative", background: "#FFFFFF",
                borderLeft: selected === q.id ? "3px solid #F3C948" : "1px solid #C9BFE9",
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{q.label}</span>
              <span style={{ marginTop: "auto", fontSize: 13, color: "#6E6F75" }}>{q.count}</span>
            </button>
          ))}
        </div>

        {/* Result area */}
        {loading && (
          <div style={{
            background: "#FFFFFF", border: "1px solid #C9BFE9",
            borderRadius: 16, padding: 48, textAlign: "center",
            fontSize: 15, color: "#6E6F75",
          }}>
            Reading from live deal record…
          </div>
        )}

        {error && (
          <div style={{
            background: "#FFFFFF", border: "1px solid #E5974D",
            borderRadius: 16, padding: 32,
            fontSize: 14, color: "#040610",
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && !loading && (
          <div style={{
            background: "#FFFFFF", border: "1px solid #C9BFE9",
            borderRadius: 16, overflow: "hidden",
          }}>
            <div style={{
              padding: "20px 28px",
              borderBottom: "1px solid rgba(4,6,16,0.10)",
              background: "#F4F4F4",
            }}>
              <p className="eyebrow yellow-rule" style={{ margin: 0 }}>
                {PRESETS.find(q => q.id === selected)?.label}
              </p>
            </div>
            <div style={{ padding: 28, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

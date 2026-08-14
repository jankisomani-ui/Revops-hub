'use client'
import { useState, useEffect } from 'react'
import { C } from '../components/ui'

const WEBHOOK = 'https://certifyos.app.n8n.cloud/webhook/jarvis-run-log'

const STAGE_TABS = [
  { id: 'all',                     label: 'Portfolio' },
  { id: 'Interested',              label: 'Stage 1 · Interested' },
  { id: 'Team Presentation',       label: 'Stage 2 · Team Presentation' },
  { id: 'Proposal & ROI Reviewed', label: 'Stage 3 · Proposal & ROI' },
  { id: 'Contracting',             label: 'Stage 4 · Contracting' },
]

// Each tile defines its own columns matching the UC output
const TILES = [
  {
    id: 'meddic',
    q: 'Where are the MEDDIC gaps and which deals are stuck?',
    useCaseName: 'MEDDIC Gap Detection',
    live: true,
    cols: [
      { label: 'Opportunity', render: r => <><strong>{r.opportunity_name}</strong><br/><span style={{fontSize:12,color:'#6E6F75'}}>{r.account_name}</span></> },
      { label: 'Owner',       render: r => r.opportunity_owner },
      { label: 'Stage',       render: r => r.stage_status },
      { label: 'Date',        render: r => fmt(r.run_timestamp) },
      { label: 'What the run log found', render: r => r.headline, wide: true },
    ],
  },
  {
    id: 'eb',
    q: 'Which proposals had no Economic Buyer on the call?',
    useCaseName: 'Economic Buyer Absence Detection',
    live: true,
    cols: [
      { label: 'Opportunity', render: r => <><strong>{r.opportunity_name}</strong><br/><span style={{fontSize:12,color:'#6E6F75'}}>{r.account_name}</span></> },
      { label: 'Owner',       render: r => r.opportunity_owner },
      { label: 'Stage',       render: r => r.stage_status },
      { label: 'Date',        render: r => fmt(r.run_timestamp) },
      { label: 'Finding',     render: r => r.headline, wide: true },
    ],
  },
  {
    id: 'single',
    q: 'Which deals are single-threaded?',
    useCaseName: 'Single-Threaded Deal Risk Detection',
    live: true,
    cols: [
      { label: 'Opportunity',    render: r => <><strong>{r.opportunity_name}</strong></> },
      { label: 'Owner',          render: r => r.opportunity_owner },
      { label: 'Stage',          render: r => r.stage_status },
      { label: 'Days at Stage 1',render: r => parseDays(r.detail) },
      { label: 'Contacts',       render: r => parseContacts(r.detail) },
      { label: 'Summary',        render: r => r.headline, wide: true },
    ],
  },
  {
    id: 'battlecard',
    q: 'Which deals are missing a battle card?',
    useCaseName: 'Tailored Battle Card Generation',
    live: true,
    cols: [
      { label: 'Opportunity', render: r => <><strong>{r.opportunity_name}</strong><br/><span style={{fontSize:12,color:'#6E6F75'}}>{r.account_name}</span></> },
      { label: 'Owner',       render: r => r.opportunity_owner },
      { label: 'Stage',       render: r => r.stage_status },
      { label: 'Date',        render: r => fmt(r.run_timestamp) },
      { label: 'Finding',     render: r => r.headline, wide: true },
    ],
  },
  { id: 'forecast',  q: 'What does the forecast roll up to by rep?', useCaseName: null, live: false },
  { id: 'monday',    q: 'Draft the Monday leadership note',           useCaseName: null, live: false },
]

function fmt(ts) {
  if (!ts) return '—'
  try { return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
  catch { return ts }
}

// Parse "Days at Stage 1: 12 | ..." from detail field
function parseDays(detail) {
  if (!detail) return '—'
  const m = detail.match(/Days at Stage\s*\d*:\s*(\d+)/)
  return m ? <strong>{m[1]}</strong> : '—'
}

// Parse "Distinct contacts: 1 (Name)" or "0 (no contacts linked)" from detail
function parseContacts(detail) {
  if (!detail) return '—'
  const m = detail.match(/Distinct contacts:\s*(\d+[^|]*)/)
  return m ? m[1].trim() : '—'
}

function dedup(rows) {
  const seen = new Map()
  const sorted = [...rows].sort((a, b) => new Date(b.run_timestamp) - new Date(a.run_timestamp))
  for (const r of sorted) {
    const key = `${r.opportunity_id}|${r.use_case_name}`
    if (!seen.has(key)) seen.set(key, r)
  }
  return Array.from(seen.values())
}

export default function JarvisPage() {
  const [rows,     setRows]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [err,      setErr]      = useState(null)
  const [stage,    setStage]    = useState('all')
  const [tile,     setTile]     = useState(null)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetch(WEBHOOK)
      .then(r => r.json())
      .then(d => { setRows(dedup(d.rows || [])); setLoading(false) })
      .catch(() => { setErr('Could not reach the run log webhook.'); setLoading(false) })
  }, [])

  const stageRows = stage === 'all' ? rows : rows.filter(r => r.stage_status === stage)
  const tileRows  = tile ? stageRows.filter(r => r.use_case_name === tile.useCaseName) : []

  function noteFor(t) {
    if (!t.live) return 'Coming soon'
    const n = stageRows.filter(r => r.use_case_name === t.useCaseName).length
    return n === 0 ? 'No findings' : `${n} finding${n !== 1 ? 's' : ''}`
  }

  return (
    <>
      {/* Hero */}
      <section style={{ position:'relative', background:C.purple, color:'#fff', padding:'64px 56px 72px', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%', border:`1px solid rgba(255,255,255,.15)`, top:-350, right:-280, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', width:420, height:420, borderRadius:'50%', background:'rgba(217,213,247,.18)', top:-200, right:-120, pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:1, maxWidth:580 }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(255,255,255,.7)', marginBottom:14 }}>Sales Jarvis</p>
          <h1 style={{ fontFamily:"'Lora',Georgia,serif", fontWeight:400, fontSize:52, lineHeight:1.1, color:'#fff', marginBottom:18 }}>Ask anything</h1>
          <p style={{ fontSize:17, lineHeight:1.5, color:'rgba(255,255,255,.85)' }}>Pick a question. Each one reads live from the deal record every time you open it, so the answer is what is true right now.</p>
        </div>
      </section>

      <div style={{ padding:'40px 56px 80px' }}>

        {/* Stage tabs */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:36 }}>
          {STAGE_TABS.map(t => (
            <button key={t.id}
              onClick={() => { setStage(t.id); setTile(null); setExpanded(null) }}
              style={{
                fontSize:14, fontFamily:'inherit', fontWeight: stage===t.id ? 700 : 400,
                padding:'8px 20px', borderRadius:999, cursor:'pointer',
                background: stage===t.id ? C.purple : '#fff',
                color: stage===t.id ? '#fff' : C.charcoal,
                border: `1px solid ${stage===t.id ? C.purple : C.lav}`,
                transition:'all 120ms',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading && <div style={{ padding:48, textAlign:'center', color:C.muted, fontSize:15 }}>Reading from run log…</div>}
        {err     && <div style={{ padding:20, background:'#fff', border:`1px solid ${C.orange}`, borderRadius:12, fontSize:14 }}><strong>Error:</strong> {err}</div>}

        {!loading && !err && <>
          <h2 style={{ fontFamily:"'Lora',Georgia,serif", fontWeight:400, fontSize:30, marginBottom:4 }}>Across the whole book</h2>
          <p style={{ fontSize:14, color:C.muted, marginBottom:28 }}>Nothing here needs an account — these run across every open deal.</p>

          {/* Tiles */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:44 }}>
            {TILES.map(t => {
              const active = tile?.id === t.id
              return (
                <button key={t.id}
                  onClick={() => { if (!t.live) return; setTile(active ? null : t); setExpanded(null) }}
                  style={{
                    display:'flex', flexDirection:'column', gap:16,
                    background:'#fff', borderRadius:16, padding:'24px 24px 20px',
                    textAlign:'left', fontFamily:'inherit', color:C.charcoal,
                    cursor: t.live ? 'pointer' : 'default',
                    minHeight:120, opacity: t.live ? 1 : 0.5,
                    border: `1px solid ${active ? C.yellow : C.lav}`,
                    borderLeft: active ? `3px solid ${C.yellow}` : `1px solid ${C.lav}`,
                    transition:'border-color 150ms',
                  }}>
                  <span style={{ fontSize:16, fontWeight:700, lineHeight:1.35 }}>{t.q}</span>
                  <span style={{ marginTop:'auto', fontSize:13, color: t.live ? C.muted : C.lav, fontStyle: t.live ? 'normal' : 'italic' }}>
                    {noteFor(t)}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Result table — columns vary per tile */}
          {tile?.live && <>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:C.muted, marginBottom:6 }}>{tile.q}</p>
            <span style={{ display:'block', width:40, height:3, background:C.yellow, marginBottom:10 }}/>
            <p style={{ fontSize:14, color:C.muted, marginBottom:20 }}>Sorted most recent first. Reads directly from the deal record — nothing here is cached.</p>

            {tileRows.length === 0
              ? <div style={{ background:'#fff', border:`1px dashed ${C.lav}`, borderRadius:16, padding:48, textAlign:'center', color:C.muted, fontSize:15 }}>No findings right now.</div>
              : <div style={{ background:'#fff', border:`1px solid ${C.lav}`, borderRadius:16, overflow:'hidden' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                    <thead>
                      <tr style={{ background:C.grey }}>
                        {tile.cols.map(c => (
                          <th key={c.label} style={{
                            textAlign:'left', fontSize:11, fontWeight:700, letterSpacing:'.08em',
                            textTransform:'uppercase', color:C.muted,
                            padding:'12px 16px', borderBottom:`1px solid ${C.lav}`,
                            whiteSpace:'nowrap',
                          }}>{c.label}</th>
                        ))}
                        <th style={{ background:C.grey, borderBottom:`1px solid ${C.lav}`, width:90 }}/>
                      </tr>
                    </thead>
                    <tbody>
                      {tileRows.map((r, i) => (
                        <>
                          <tr key={i} style={{ borderBottom:`1px solid rgba(4,6,16,.07)`, verticalAlign:'top' }}>
                            {tile.cols.map((c, ci) => (
                              <td key={ci} style={{
                                padding:'14px 16px', verticalAlign:'top',
                                maxWidth: c.wide ? 360 : undefined,
                                lineHeight: 1.5,
                                whiteSpace: c.wide ? 'normal' : 'nowrap',
                              }}>
                                {c.render(r)}
                              </td>
                            ))}
                            <td style={{ padding:'14px 16px', verticalAlign:'top', textAlign:'right', whiteSpace:'nowrap' }}>
                              <button onClick={() => setExpanded(expanded===i ? null : i)}
                                style={{ fontSize:13, fontWeight:700, fontFamily:'inherit', background:C.yellow, color:C.charcoal, border:'none', borderRadius:999, padding:'6px 16px', cursor:'pointer' }}>
                                {expanded===i ? 'Close' : 'Detail'}
                              </button>
                            </td>
                          </tr>
                          {expanded===i && (
                            <tr key={'d'+i}>
                              <td colSpan={tile.cols.length + 1} style={{ padding:'16px 20px', background:C.grey, fontSize:13, lineHeight:1.75, whiteSpace:'pre-wrap', borderBottom:`1px solid rgba(4,6,16,.07)` }}>
                                {r.detail}
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
            }
          </>}
        </>}
      </div>
    </>
  )
}

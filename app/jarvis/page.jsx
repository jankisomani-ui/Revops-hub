'use client'
import { useState, useEffect } from 'react'
import { C } from '../components/ui'

const WEBHOOK = 'https://certifyos.app.n8n.cloud/webhook/jarvis-run-log'

const STAGE_TABS = [
  { id: 'all',                      label: 'Portfolio' },
  { id: 'Interested',               label: 'Stage 1 · Interested' },
  { id: 'Team Presentation',        label: 'Stage 2 · Team Presentation' },
  { id: 'Proposal & ROI Reviewed',  label: 'Stage 3 · Proposal & ROI' },
  { id: 'Contracting',              label: 'Stage 4 · Contracting' },
]

const TILES = [
  { id:'meddic',     q:'Where are the MEDDIC gaps and which deals are stuck?',         useCaseName:'MEDDIC Gap Detection',                live:true  },
  { id:'eb',         q:'Which proposals had no Economic Buyer on the call?',            useCaseName:'Economic Buyer Absence Detection',     live:true  },
  { id:'single',     q:'Which deals are single-threaded?',                              useCaseName:'Single-Threaded Deal Risk Detection',  live:true  },
  { id:'battlecard', q:'Which deals are missing a battle card?',                        useCaseName:'Tailored Battle Card Generation',      live:true  },
  { id:'forecast',   q:'What does the forecast roll up to by rep?',                     useCaseName:null,                                   live:false },
  { id:'monday',     q:'Draft the Monday leadership note',                              useCaseName:null,                                   live:false },
]

function fmt(ts) {
  if (!ts) return '—'
  try { return new Date(ts).toLocaleDateString('en-US', { month:'short', day:'numeric' }) }
  catch { return ts }
}

function dedup(rows) {
  const seen = new Map()
  const sorted = [...rows].sort((a,b) => new Date(b.run_timestamp) - new Date(a.run_timestamp))
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

  function countFor(t) {
    if (!t.live) return null
    return stageRows.filter(r => r.use_case_name === t.useCaseName).length
  }
  function noteFor(t) {
    if (!t.live) return 'Coming soon'
    const n = countFor(t)
    return n === 0 ? 'No findings' : `${n} finding${n !== 1 ? 's' : ''}`
  }

  return (
    <>
      <section style={{ position:'relative', background:C.purple, color:'#fff', padding:'64px 56px 72px', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:620, height:620, borderRadius:'50%', border:`1px solid ${C.lav}`, top:-300, right:-300, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:C.lavt, top:-210, right:-150, pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:1, maxWidth:620 }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'#fff', marginBottom:14 }}>Sales Jarvis</p>
          <h1 style={{ fontFamily:"'Lora',Georgia,serif", fontWeight:400, fontSize:48, lineHeight:1.15, color:'#fff', marginBottom:16 }}>Ask anything</h1>
          <p style={{ fontSize:18, lineHeight:1.4, color:'#fff' }}>Pick a question. Each one reads live from the deal record every time you open it, so the answer is what is true right now.</p>
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
                padding:'8px 18px', borderRadius:999, cursor:'pointer',
                background: stage===t.id ? C.purple : '#fff',
                color: stage===t.id ? '#fff' : C.charcoal,
                border: `1px solid ${stage===t.id ? C.purple : C.lav}`,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading && <div style={{ padding:48, textAlign:'center', color:C.muted }}>Reading from run log…</div>}
        {err     && <div style={{ padding:20, border:`1px solid ${C.orange}`, borderRadius:12, fontSize:14 }}>{err}</div>}

        {!loading && !err && <>
          <h2 style={{ fontFamily:"'Lora',Georgia,serif", fontWeight:400, fontSize:28, marginBottom:4 }}>Across the whole book</h2>
          <p style={{ fontSize:14, color:C.muted, marginBottom:24 }}>Nothing here needs an account — these run across every open deal.</p>

          {/* Tiles */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16, marginBottom:40 }}>
            {TILES.map(t => {
              const active = tile?.id === t.id
              return (
                <button key={t.id}
                  onClick={() => { if (!t.live) return; setTile(active ? null : t); setExpanded(null) }}
                  style={{
                    display:'flex', flexDirection:'column', gap:12,
                    background:'#fff', borderRadius:16, padding:24,
                    textAlign:'left', fontFamily:'inherit', color:C.charcoal,
                    cursor: t.live ? 'pointer' : 'default',
                    minHeight:110, opacity: t.live ? 1 : 0.55,
                    border: `1px solid ${active ? C.yellow : C.lav}`,
                    borderLeft: active ? `3px solid ${C.yellow}` : `1px solid ${C.lav}`,
                  }}>
                  <span style={{ fontSize:16, fontWeight:700, lineHeight:1.35 }}>{t.q}</span>
                  <span style={{ marginTop:'auto', fontSize:13, color:C.muted }}>{noteFor(t)}</span>
                </button>
              )
            })}
          </div>

          {/* Result table */}
          {tile?.live && <>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:C.muted, marginBottom:4 }}>{tile.q}</p>
            <span style={{ display:'block', width:40, height:3, background:C.yellow, marginBottom:8 }}/>
            <p style={{ fontSize:14, color:C.muted, marginBottom:20 }}>Sorted most recent first. Reads directly from the deal record — nothing here is cached.</p>

            {tileRows.length === 0
              ? <div style={{ background:'#fff', border:`1px dashed ${C.lav}`, borderRadius:16, padding:48, textAlign:'center', color:C.muted }}>No findings right now.</div>
              : <div style={{ background:'#fff', border:`1px solid ${C.lav}`, borderRadius:16, overflow:'hidden' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                    <thead>
                      <tr style={{ background:C.grey }}>
                        {['Opportunity','Owner','Stage','Signal Date','What the run log found',''].map(h => (
                          <th key={h} style={{ textAlign:'left', fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:C.muted, padding:'13px 16px', borderBottom:`1px solid ${C.lav}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tileRows.map((r, i) => (
                        <>
                          <tr key={i} style={{ borderBottom:`1px solid rgba(4,6,16,.08)` }}>
                            <td style={{ padding:'14px 16px', verticalAlign:'top' }}>
                              <strong>{r.opportunity_name}</strong>
                              <span style={{ display:'block', fontSize:12, color:C.muted }}>{r.account_name}</span>
                            </td>
                            <td style={{ padding:'14px 16px', verticalAlign:'top' }}>{r.opportunity_owner}</td>
                            <td style={{ padding:'14px 16px', verticalAlign:'top', fontSize:13, color:C.muted, whiteSpace:'nowrap' }}>{r.stage_status}</td>
                            <td style={{ padding:'14px 16px', verticalAlign:'top', fontSize:13, color:C.muted, whiteSpace:'nowrap' }}>{fmt(r.run_timestamp)}</td>
                            <td style={{ padding:'14px 16px', verticalAlign:'top', maxWidth:340, lineHeight:1.5 }}>{r.headline}</td>
                            <td style={{ padding:'14px 16px', verticalAlign:'top', textAlign:'right' }}>
                              <button onClick={() => setExpanded(expanded===i ? null : i)}
                                style={{ fontSize:13, fontWeight:700, fontFamily:'inherit', background:C.yellow, color:C.charcoal, border:'none', borderRadius:999, padding:'6px 16px', cursor:'pointer' }}>
                                {expanded===i ? 'Close' : 'Detail'}
                              </button>
                            </td>
                          </tr>
                          {expanded===i && (
                            <tr key={'d'+i}>
                              <td colSpan={6} style={{ padding:'16px 20px', background:C.grey, fontSize:13, lineHeight:1.7, whiteSpace:'pre-wrap', borderBottom:`1px solid rgba(4,6,16,.08)` }}>
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

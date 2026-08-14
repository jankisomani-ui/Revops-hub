import Link from 'next/link'
import { C } from './components/ui'

const TOOLS = [
  {
    href: '/jarvis',
    name: 'Sales Jarvis',
    desc: 'Ask anything about the pipeline — MEDDIC gaps, missing economic buyers, battle cards, and single-threaded deals.',
    health: 'Live',
    lastRun: 'Reads on demand',
    reads: 'Salesforce · Gong',
  },
  {
    href: '/command-center',
    name: 'Sales Leader Command Center',
    desc: 'Milestone scoring, signal detection, and risk judgment across the full pipeline for sales leadership.',
    health: 'Live',
    lastRun: 'Live from run log',
    reads: 'Salesforce · scoring sheet',
  },
  {
    href: '/rfp',
    name: 'RFP Assistant',
    desc: 'Drafts RFP responses from the approved answer bank — verbatim, matched by category, reviewed before it goes out.',
    health: 'Live',
    lastRun: '2 days ago',
    reads: 'Answer bank (Excel)',
  },
  {
    href: '/roi',
    name: 'ROI Model Builder',
    desc: 'Turns deal inputs — FTEs, claims volume, providers — into a savings model across payment integrity and directory accuracy.',
    health: 'Live',
    lastRun: 'Per submission',
    reads: 'Frozen CertifyOS model',
  },
  {
    href: '/journey',
    name: 'Journey coverage',
    desc: 'Which stages have AI coverage, which don\'t, and what each tool watches at every gate.',
    health: 'Reference',
    lastRun: 'Static map',
    reads: 'Program map',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section style={{ position:'relative', background:C.purple, color:'#fff', padding:'72px 56px 88px', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%', border:'1px solid rgba(255,255,255,.12)', top:-350, right:-280, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', width:440, height:440, borderRadius:'50%', background:'rgba(217,213,247,.15)', top:-200, right:-120, pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:1, maxWidth:620 }}>
          <h1 style={{ fontFamily:"'Lora',Georgia,serif", fontWeight:400, fontSize:60, lineHeight:1.1, color:'#fff', marginBottom:20 }}>
            Every AI tool for the buyer's journey
          </h1>
          <p style={{ fontSize:18, lineHeight:1.5, color:'rgba(255,255,255,.85)' }}>
            Four tools, one place. Each one reads live from the systems the deal already lives in.
          </p>
        </div>
      </section>

      {/* Tools grid */}
      <div style={{ padding:'48px 56px 80px' }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:C.muted, marginBottom:8 }}>Tools</p>
        <span style={{ display:'block', width:40, height:3, background:C.yellow, marginBottom:28 }}/>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {TOOLS.map(t => (
            <Link key={t.href} href={t.href} style={{ textDecoration:'none', display:'flex' }}>
              <div style={{
                display:'flex', flexDirection:'column', gap:16,
                background:'#fff', border:`1px solid ${C.lav}`,
                borderRadius:16, padding:28, width:'100%',
                transition:'border-color 150ms',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.purple}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.lav}
              >
                {/* Status pill */}
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:6,
                    fontSize:11, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase',
                    background:C.lavt, borderRadius:999, padding:'4px 12px', color:C.charcoal,
                  }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background:C.purple }}/>
                    {t.health}
                  </span>
                </div>

                {/* Name */}
                <p style={{ fontFamily:"'Lora',Georgia,serif", fontSize:22, fontWeight:400, lineHeight:1.2, color:C.charcoal }}>
                  {t.name}
                </p>

                {/* Desc */}
                <p style={{ fontSize:14, lineHeight:1.55, color:C.charcoal, flex:1 }}>{t.desc}</p>

                {/* Meta */}
                <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'5px 14px', fontSize:12 }}>
                  <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase', color:C.muted }}>Last run</span>
                  <span>{t.lastRun}</span>
                  <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase', color:C.muted }}>Reads</span>
                  <span>{t.reads}</span>
                </div>

                <span style={{ fontSize:14, fontWeight:700, color:C.purple }}>Open →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

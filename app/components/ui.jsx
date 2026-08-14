// Brand token helpers
export const C = {
  purple:'#79709E', lav:'#C9BFE9', lavt:'#D9D5F7',
  grey:'#F4F4F4', charcoal:'#040610', orange:'#E5974D',
  yellow:'#F3C948', yelt:'#FFF38B', muted:'#6E6F75', white:'#FFFFFF',
}

export function Hero({ eyebrow, title, subtitle, cta, ctaHref }) {
  return (
    <section style={{ position:'relative', background:C.purple, color:'#fff', padding:'64px 56px 72px', overflow:'hidden' }}>
      {/* decorative circles */}
      <div style={{ position:'absolute', width:620, height:620, borderRadius:'50%', border:`1px solid ${C.lav}`, top:-300, right:-300, pointerEvents:'none' }}/>
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:C.lavt, top:-210, right:-150, pointerEvents:'none' }}/>
      <div style={{ position:'relative', zIndex:1, maxWidth:620 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'#fff', marginBottom:14 }}>{eyebrow}</p>
        <h1 style={{ fontFamily:"'Lora',Georgia,serif", fontWeight:400, fontSize:48, lineHeight:1.15, color:'#fff', marginBottom:20 }}>{title}</h1>
        {subtitle && <p style={{ fontSize:18, lineHeight:1.4, color:'#fff', marginBottom: cta ? 28 : 0 }}>{subtitle}</p>}
        {cta && ctaHref && (
          <a href={ctaHref} target="_blank" rel="noopener noreferrer" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:C.yellow, color:C.charcoal,
            fontWeight:700, fontSize:15, padding:'12px 24px',
            borderRadius:999, textDecoration:'none',
          }}>
            {cta} →
          </a>
        )}
      </div>
    </section>
  )
}

export function SectionLabel({ children }) {
  return (
    <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:C.muted, marginBottom:24 }}>
      {children}
      <span style={{ display:'block', width:40, height:3, background:C.yellow, marginTop:8 }}/>
    </p>
  )
}

export function Card({ children, style={}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background:'#fff', border:`1px solid ${C.lav}`, borderRadius:16,
        padding:28, cursor: onClick ? 'pointer' : 'default',
        transition:'border-color 150ms', ...style
      }}
      onMouseEnter={e => onClick && (e.currentTarget.style.borderColor = C.purple)}
      onMouseLeave={e => onClick && (e.currentTarget.style.borderColor = C.lav)}
    >
      {children}
    </div>
  )
}

export function Pill({ children, dot=true }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase',
      background:C.lavt, color:C.charcoal, borderRadius:999, padding:'4px 12px',
    }}>
      {dot && <span style={{ width:7, height:7, borderRadius:'50%', background:C.purple, flexShrink:0 }}/>}
      {children}
    </span>
  )
}

export function BtnYellow({ children, onClick, style={} }) {
  return (
    <button onClick={onClick} style={{
      background:C.yellow, color:C.charcoal, fontWeight:700, fontSize:14,
      border:'none', borderRadius:999, padding:'9px 20px', ...style
    }}>
      {children}
    </button>
  )
}

export function PageWrap({ children }) {
  return <div style={{ padding:'48px 56px 80px' }}>{children}</div>
}

export function Grid({ children, min=280 }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(auto-fit,minmax(${min}px,1fr))`, gap:20 }}>
      {children}
    </div>
  )
}

export function Serif({ size=24, children, style={} }) {
  return (
    <span style={{ fontFamily:"'Lora',Georgia,serif", fontWeight:400, fontSize:size, lineHeight:1.15, ...style }}>
      {children}
    </span>
  )
}

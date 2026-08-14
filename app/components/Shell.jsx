'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href:'/',               label:'Home',             icon:'⌂' },
  { href:'/jarvis',         label:'Sales Jarvis',     icon:'◎' },
  { href:'/command-center', label:'Command Center',   icon:'▦' },
  { href:'/rfp',            label:'RFP Assistant',    icon:'◻' },
  { href:'/roi',            label:'ROI Model Builder',icon:'◈' },
  { href:'/journey',        label:'Journey coverage', icon:'→' },
]

export default function Shell({ children }) {
  const [open, setOpen] = useState(true)
  const path = usePathname()

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: open ? 260 : 64,
        flexShrink: 0,
        background: '#fff',
        borderRight: '1px solid rgba(4,6,16,.1)',
        padding: open ? '24px 16px' : '24px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        position: 'sticky',
        top: 0,
        height: '100vh',
        transition: 'width 180ms ease',
        overflow: 'hidden',
      }}>
        {/* Logo row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent: open ? 'space-between' : 'center' }}>
          {open && (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <svg width="26" height="26" viewBox="0 0 187 198" xmlns="http://www.w3.org/2000/svg">
                  <path d="M93.0622 0C41.3608 0 0 40.1424 0 99.5424C0 158.671 41.3608 198 93.0622 198C144.763 198 186.125 157.858 186.125 98.4576C186.125 39.3287 144.763 0 93.0622 0ZM92.7508 141.189L50.1392 98.715L92.7508 56.2412L135.362 98.715L92.7508 141.189Z" fill="#79709E"/>
                </svg>
                <span style={{ fontSize:17, fontWeight:700, letterSpacing:'-.3px', color:'#040610' }}>CertifyOS</span>
              </div>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', color:'#6E6F75', marginTop:6, marginLeft:34 }}>RevOps Hub</p>
            </div>
          )}
          {!open && (
            <svg width="28" height="28" viewBox="0 0 187 198" xmlns="http://www.w3.org/2000/svg">
              <path d="M93.0622 0C41.3608 0 0 40.1424 0 99.5424C0 158.671 41.3608 198 93.0622 198C144.763 198 186.125 157.858 186.125 98.4576C186.125 39.3287 144.763 0 93.0622 0ZM92.7508 141.189L50.1392 98.715L92.7508 56.2412L135.362 98.715L92.7508 141.189Z" fill="#79709E"/>
            </svg>
          )}
          {open && (
            <button onClick={() => setOpen(false)} style={{ width:28, height:28, borderRadius:'50%', border:'1px solid #C9BFE9', background:'#fff', cursor:'pointer', fontSize:14, color:'#040610', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>‹</button>
          )}
        </div>

        {!open && (
          <button onClick={() => setOpen(true)} style={{ width:40, height:40, borderRadius:'50%', border:'1px solid #C9BFE9', background:'#fff', cursor:'pointer', fontSize:14, color:'#040610', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>›</button>
        )}

        {/* Nav */}
        <nav style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {open && <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', color:'#6E6F75', margin:'0 0 6px 10px' }}>Workspace</p>}
          {NAV.map(({ href, label, icon }) => {
            const active = path === href
            return (
              <Link key={href} href={href} style={{ textDecoration:'none' }}>
                <span style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding: open ? '9px 12px' : '9px 0',
                  borderRadius:999, justifyContent: open ? 'flex-start' : 'center',
                  background: active ? '#D9D5F7' : 'transparent',
                  fontSize:14, color:'#040610', fontWeight: active ? 700 : 400,
                  transition:'background 120ms',
                }}>
                  <span style={{ fontSize:16, color: active ? '#79709E' : '#6E6F75', flexShrink:0, width:20, textAlign:'center' }}>{icon}</span>
                  {open && <span style={{ whiteSpace:'nowrap' }}>{label}</span>}
                </span>
              </Link>
            )
          })}
        </nav>

        {open && (
          <div style={{ marginTop:'auto', borderTop:'1px solid rgba(4,6,16,.1)', paddingTop:16, fontSize:11, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', color:'#6E6F75' }}>
            Internal &amp; confidential
          </div>
        )}
      </aside>

      {/* Main content */}
      <main style={{ flex:1, minWidth:0 }}>{children}</main>
    </div>
  )
}

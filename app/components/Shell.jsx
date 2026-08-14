'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',                label: 'Home',             icon: <HomeIcon /> },
  { href: '/jarvis',          label: 'Sales Jarvis',     icon: <JarvisIcon /> },
  { href: '/command-center',  label: 'Command Center',   icon: <CmdIcon /> },
  { href: '/rfp',             label: 'RFP Assistant',    icon: <RfpIcon /> },
  { href: '/roi',             label: 'ROI Model',        icon: <RoiIcon /> },
  { href: '/journey',         label: 'Journey Coverage', icon: <JourneyIcon /> },
]

function HomeIcon()    { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10.5L10 3.5L17 10.5V17H13V13H7V17H3V10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> }
function JarvisIcon()  { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg> }
function CmdIcon()     { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg> }
function RfpIcon()     { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="2" width="12" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7H13M7 10H13M7 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function RoiIcon()     { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 15L7.5 9.5L11 13L15.5 7L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function JourneyIcon() { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10H17M13 6L17 10L13 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> }

export default function Shell({ children }) {
  const [open, setOpen] = useState(true)
  const path = usePathname()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: open ? 260 : 72,
        flexShrink: 0,
        background: '#fff',
        borderRight: '1px solid rgba(4,6,16,.1)',
        padding: '24px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        position: 'sticky',
        top: 0,
        height: '100vh',
        transition: 'width 180ms ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, padding: '0 4px' }}>
          {open && (
            <div>
              <LogoFull />
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#6E6F75', marginTop: 8 }}>RevOps Hub</p>
            </div>
          )}
          {!open && <LogoMark />}
          <button
            onClick={() => setOpen(o => !o)}
            style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', border: '1px solid #C9BFE9', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#040610', lineHeight: 1 }}
          >
            {open ? '‹' : '›'}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {open && <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#6E6F75', margin: '0 0 6px 8px' }}>Workspace</p>}
          {NAV.map(({ href, label, icon }) => {
            const active = path === href
            return (
              <Link key={href} href={href}>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', borderRadius: 999,
                  background: active ? '#D9D5F7' : 'transparent',
                  fontSize: 14, color: '#040610',
                  justifyContent: open ? 'flex-start' : 'center',
                  transition: 'background 120ms',
                }}>
                  <span style={{ flexShrink: 0, display: 'flex', color: active ? '#79709E' : '#6E6F75' }}>{icon}</span>
                  {open && <span style={{ whiteSpace: 'nowrap', fontWeight: active ? 700 : 400 }}>{label}</span>}
                </span>
              </Link>
            )
          })}
        </nav>

        {open && (
          <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(4,6,16,.1)', paddingTop: 16, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#6E6F75' }}>
            Internal &amp; confidential
          </div>
        )}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
    </div>
  )
}

function LogoFull() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <svg width="28" height="28" viewBox="0 0 187 198" xmlns="http://www.w3.org/2000/svg">
        <path d="M93.0622 0C41.3608 0 0 40.1424 0 99.5424C0 158.671 41.3608 198 93.0622 198C144.763 198 186.125 157.858 186.125 98.4576C186.125 39.3287 144.763 0 93.0622 0ZM92.7508 141.189L50.1392 98.715L92.7508 56.2412L135.362 98.715L92.7508 141.189Z" fill="#79709E"/>
      </svg>
      <span style={{ fontSize:18, fontWeight:700, letterSpacing:'-.3px', color:'#040610', fontFamily:'inherit' }}>CertifyOS</span>
    </div>
  )
}

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 187 198" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <path d="M93.0622 0C41.3608 0 0 40.1424 0 99.5424C0 158.671 41.3608 198 93.0622 198C144.763 198 186.125 157.858 186.125 98.4576C186.125 39.3287 144.763 0 93.0622 0ZM92.7508 141.189L50.1392 98.715L92.7508 56.2412L135.362 98.715L92.7508 141.189Z" fill="#79709E"/>
    </svg>
  )
}

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
    <svg height="22" viewBox="0 0 975 198" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <path d="M93.0622 0C41.3608 0 0 40.1424 0 99.5424C0 158.671 41.3608 198 93.0622 198C144.763 198 186.125 157.858 186.125 98.4576C186.125 39.3287 144.763 0 93.0622 0ZM92.7508 141.189L50.1392 98.715L92.7508 56.2412L135.362 98.715L92.7508 141.189Z" fill="#79709E"/>
      <path d="M285.189 163.349C252.313 163.349 225.557 138.162 225.557 100.206C225.557 61.7248 252.138 35.6628 286.063 35.6628C299.179 35.6628 314.043 38.1116 327.158 44.2336V73.9687H320.688C314.043 50.0057 300.927 43.5339 285.539 43.5339C260.707 43.5339 245.143 64.8733 245.143 96.1827C245.143 127.492 261.231 151.63 289.91 151.63C304.25 151.63 317.015 145.333 328.207 126.268L334.153 129.766C326.634 147.082 312.993 163.349 285.189 163.349Z" fill="#040610"/>
      <path d="M382.298 162.824C360.089 162.824 344 145.858 344 119.446C344 90.5855 363.236 72.5695 382.647 72.5695C405.381 72.5695 417.097 89.1862 417.097 106.852C417.097 108.602 417.097 110.35 416.922 111.925H359.389C359.564 138.686 374.078 149.181 389.117 149.181C399.785 149.181 407.129 144.458 414.124 135.363L418.146 137.987C410.102 155.128 397.161 162.824 382.298 162.824ZM359.739 104.229H400.135C399.085 89.711 392.615 79.7409 381.074 79.7409C370.931 79.7409 361.837 88.3116 359.739 104.229Z" fill="#040610"/>
      <path d="M559.549 162.303V156.531L562.697 156.181C568.817 155.482 571.091 153.558 571.091 146.386V96.0077C571.091 89.1861 568.992 87.9618 559.549 85.1631V80.6154L585.955 72.7443H587.529V146.386C587.529 153.558 589.802 155.482 595.923 156.181L599.07 156.531V162.303H559.549Z" fill="#040610"/>
      <path d="M930 163C913 163 897 157 889 152L890 118H897C901 140 912 156 933 156C948 156 958 146 958 131C958 119 950 113 934 107L926 104C906 95 892 87 892 69C892 49 909 36 932 36C948 36 959 39 966 43L966 73H959C955 53 946 43 930 43C917 43 907 53 907 64C907 75 915 81 932 88L940 91C963 100 974 108 974 126C974 147 957 163 930 163Z" fill="#040610"/>
    </svg>
  )
}

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 187 198" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <path d="M93.0622 0C41.3608 0 0 40.1424 0 99.5424C0 158.671 41.3608 198 93.0622 198C144.763 198 186.125 157.858 186.125 98.4576C186.125 39.3287 144.763 0 93.0622 0ZM92.7508 141.189L50.1392 98.715L92.7508 56.2412L135.362 98.715L92.7508 141.189Z" fill="#79709E"/>
    </svg>
  )
}

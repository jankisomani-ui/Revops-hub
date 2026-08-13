"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Logo from "./Logo"

const NAV = [
  { href: "/",               icon: "⬡", label: "Home" },
  { href: "/jarvis",         icon: "◎", label: "Sales Jarvis" },
  { href: "/command-center", icon: "▦",  label: "Command Center" },
  { href: "/rfp",            icon: "◻", label: "RFP Assistant" },
  { href: "/roi",            icon: "◈", label: "ROI Model" },
  { href: "/journey",        icon: "→", label: "Journey Coverage" },
]

export default function Sidebar() {
  const [open, setOpen] = useState(true)
  const path = usePathname()

  return (
    <aside style={{
      width: open ? 260 : 72,
      flexShrink: 0,
      background: "#FFFFFF",
      borderRight: "1px solid rgba(4,6,16,0.10)",
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 28,
      position: "sticky",
      top: 0,
      alignSelf: "flex-start",
      height: "100vh",
      transition: "width 180ms ease-out",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "0 4px" }}>
        {open && (
          <div>
            <Logo height={28} />
            <p className="eyebrow" style={{ margin: "10px 0 0" }}>RevOps Hub</p>
          </div>
        )}
        {!open && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
            <Logo iconOnly height={28} />
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          title={open ? "Collapse" : "Expand"}
          style={{
            flexShrink: 0,
            width: 32, height: 32,
            border: "1px solid #C9BFE9",
            borderRadius: "50%",
            background: "#FFFFFF",
            color: "#040610",
            fontSize: 15,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {open ? "‹" : "›"}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {open && <p className="eyebrow" style={{ margin: "0 0 8px 12px" }}>Workspace</p>}
        {NAV.map(({ href, icon, label }) => {
          const active = path === href
          return (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <span
                className={`nav-btn${active ? " active" : ""}`}
                style={{ justifyContent: open ? "flex-start" : "center" }}
              >
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
                {open && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
              </span>
            </Link>
          )
        })}
      </nav>

      {open && (
        <div style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(4,6,16,0.10)",
          padding: "16px 8px 0",
          fontSize: 12, fontWeight: 700,
          letterSpacing: 0.2,
          textTransform: "uppercase",
          color: "#6E6F75",
        }}>
          Internal &amp; confidential
        </div>
      )}
    </aside>
  )
}

import "./globals.css"
import Sidebar from "./components/Sidebar"

export const metadata = {
  title: "RevOps Hub — CertifyOS",
  description: "Internal revenue operations tools",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ display: "flex", minHeight: "100vh", background: "#F4F4F4" }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </body>
    </html>
  )
}

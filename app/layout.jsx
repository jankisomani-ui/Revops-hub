import './globals.css'
import Shell from './components/Shell'

export const metadata = { title: 'RevOps Hub — CertifyOS' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}

import { Toaster } from 'react-hot-toast'
import { Providers } from './providers'
import { KunTopBar } from '~/components/kun/top-bar/TopBar'
import { KunFooter } from '~/components/kun/Footer'
import { KunNavigationBreadcrumb } from '~/components/kun/NavigationBreadcrumb'
import '~/styles/index.scss'
import './actions'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-Hans" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="relative flex flex-col items-center justify-center min-h-screen bg-radial">
            <KunTopBar />
            <KunNavigationBreadcrumb />
            <div className="flex min-h-[calc(100dvh-256px)] w-full max-w-7xl grow px-6">
              {children}
              <Toaster />
            </div>
            <KunFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}

'use client'

import { AppProgressBar } from 'next-nprogress-bar'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next-nprogress-bar'

import { UserStoreProvider } from '~/store/providers/user'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  return (
    <UserStoreProvider>
      <NextUIProvider navigate={router.push}>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
        <AppProgressBar
          height="4px"
          color="#006fee"
          options={{ showSpinner: false }}
        />
      </NextUIProvider>
    </UserStoreProvider>
  )
}

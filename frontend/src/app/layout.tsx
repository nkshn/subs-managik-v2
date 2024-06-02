import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"
import { Toaster } from "sonner"

import { SITE_NAME } from "@/constants/seo.constants"

import "./globals.scss"
import { Providers } from "./providers"
import { Navbar } from "@/components/navbar"

const zen = Noto_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-zen",
  style: ["normal"]
})

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description: "Subs Managik is app for managing your subscriptions"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${zen.className} bg-white text-gray-500`} >
        <Providers>

          <div className="container mx-auto px-4">
            <Navbar />
            {children}
          </div>

          <Toaster
            theme="light"
            position="bottom-right"
            duration={1500}
          />
        </Providers>
      </body>
    </html>
  )
}

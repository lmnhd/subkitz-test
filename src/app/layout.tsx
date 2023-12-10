import type { Metadata } from 'next'

import config from '@/amplifyconfiguration.json'
import { Amplify } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
import { Dhurjati } from 'next/font/google'
import './globals.css'


Amplify.configure(config)
const dhurjati = Dhurjati({ subsets: ['latin'], weight: ['400'] })
//const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Subkitz',
  description: 'bomb the beat',
}

function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={dhurjati.className}>{children}</body>
    </html>
  )
}

export default RootLayout

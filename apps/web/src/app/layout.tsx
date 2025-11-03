import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, TWITTER_HANDLE } from '@/lib/constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} - The trustless identity layer for Polkadot JAM`,
        template: `%s | ${SITE_NAME}`
    },
    description: SITE_DESCRIPTION,
    keywords: ['JAMID', 'JAM', 'Polkadot', 'identity', 'blockchain', 'web3', 'decentralized', 'on-chain', 'trustless', 'OpenGov', 'DAO', 'ink', 'Rust'],
    authors: [{ name: 'Snowinch S.L.' }],
    creator: 'Snowinch S.L.',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: SITE_URL,
        siteName: SITE_NAME,
        title: `${SITE_NAME} - The trustless identity layer for Polkadot JAM`,
        description: SITE_DESCRIPTION,
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} - The trustless identity layer for Polkadot JAM`,
        description: SITE_DESCRIPTION,
        creator: TWITTER_HANDLE,
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}


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
    icons: {
        icon: [
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon.ico', sizes: 'any' }
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
        ],
        other: [
            { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
            { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' }
        ]
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: SITE_URL,
        siteName: SITE_NAME,
        title: `${SITE_NAME} - The trustless identity layer for Polkadot JAM`,
        description: SITE_DESCRIPTION,
        images: [
            {
                url: '/android-chrome-512x512.png',
                width: 512,
                height: 512,
                alt: `${SITE_NAME} Logo`
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} - The trustless identity layer for Polkadot JAM`,
        description: SITE_DESCRIPTION,
        creator: TWITTER_HANDLE,
        images: ['/android-chrome-512x512.png']
    },
    robots: {
        index: true,
        follow: true,
    },
    manifest: '/site.webmanifest',
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


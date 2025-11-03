'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
    const [mounted, setMounted] = useState(false)
    const { theme, resolvedTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Determine which logo to show
    const currentTheme = mounted ? (resolvedTheme || theme) : 'light'
    const logoSrc = currentTheme === 'dark' ? '/jamid-dark.svg' : '/jamid-light.svg'

    return (
        <header className="border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            {mounted ? (
                                <Image
                                    src={logoSrc}
                                    alt="JAMID Logo"
                                    width={120}
                                    height={40}
                                    priority
                                    className="h-8 w-auto"
                                />
                            ) : (
                                <div className="h-8 w-[120px]" />
                            )}
                        </Link>
                        <nav className="hidden md:flex gap-6">
                            <Link
                                href="/whitepaper"
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                Whitepaper
                            </Link>
                            <Link
                                href="/specs"
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                Specs
                            </Link>
                            <Link
                                href="/open-questions"
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                Open Questions
                            </Link>
                        </nav>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}


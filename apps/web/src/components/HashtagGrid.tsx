'use client'

import { useRef, useState } from 'react'

interface Position {
    x: number
    y: number
}

export function HashtagGrid() {
    const [mousePos, setMousePos] = useState<Position>({ x: -1000, y: -1000 })
    const gridRef = useRef<HTMLDivElement>(null)

    const rows = 12
    const cols = 32
    const totalItems = rows * cols
    const influenceRadius = 100

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!gridRef.current) return

        const rect = gridRef.current.getBoundingClientRect()
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    const handleMouseLeave = () => {
        setMousePos({ x: -1000, y: -1000 })
    }

    const getItemStyle = (index: number) => {
        if (!gridRef.current) return {}

        const col = index % cols
        const row = Math.floor(index / cols)

        const rect = gridRef.current.getBoundingClientRect()
        const itemWidth = rect.width / cols
        const itemHeight = rect.height / rows

        const centerX = col * itemWidth + itemWidth / 2
        const centerY = row * itemHeight + itemHeight / 2

        const dx = centerX - mousePos.x
        const dy = centerY - mousePos.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < influenceRadius) {
            const intensity = Math.max(0, Math.min(1, 1 - (distance / influenceRadius)))
            const rotation = intensity * 360
            const scale = 1 + intensity * 0.5

            // Interpolazione colore
            const r = Math.round(156 + (230 - 156) * intensity)
            const g = Math.round(163 - 163 * intensity)
            const b = Math.round(175 + (122 - 175) * intensity)

            return {
                color: `rgb(${r}, ${g}, ${b})`,
                transform: `scale(${scale}) rotate(${rotation}deg)`,
            }
        }

        return {}
    }

    return (
        <div className="mt-16 w-full max-w-6xl mx-auto select-none overflow-hidden">
            <div
                ref={gridRef}
                className="grid gap-y-1 gap-x-0"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {Array.from({ length: totalItems }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center text-xs sm:text-sm text-gray-400 dark:text-gray-600 cursor-default transition-all duration-75 ease-linear"
                        style={getItemStyle(index)}
                    >
                        #
                    </div>
                ))}
            </div>
        </div>
    )
}

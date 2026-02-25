'use client'

import { useEffect, useRef } from 'react'

interface Sparkle {
  x: number
  y: number
  size: number
  life: number
  maxLife: number
  vx: number
  vy: number
}

export function SparkleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparklesRef = useRef<Sparkle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      for (let i = 0; i < 2; i++) {
        sparklesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          size: Math.random() * 3 + 1,
          life: 0,
          maxLife: Math.random() * 40 + 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      sparklesRef.current = sparklesRef.current.filter((s) => s.life < s.maxLife)

      for (const sparkle of sparklesRef.current) {
        sparkle.life++
        sparkle.x += sparkle.vx
        sparkle.y += sparkle.vy
        const progress = sparkle.life / sparkle.maxLife
        const alpha = 1 - progress
        const size = sparkle.size * (1 - progress * 0.5)

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = `rgba(212, 168, 67, ${alpha})`
        ctx.shadowBlur = size * 3
        ctx.shadowColor = 'rgba(192, 132, 184, 0.6)'

        // Draw a star shape
        ctx.beginPath()
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2
          ctx.moveTo(sparkle.x, sparkle.y)
          ctx.lineTo(
            sparkle.x + Math.cos(angle) * size * 2,
            sparkle.y + Math.sin(angle) * size * 2
          )
        }
        ctx.stroke()
        ctx.strokeStyle = `rgba(212, 168, 67, ${alpha})`
        ctx.lineWidth = 0.5

        ctx.beginPath()
        ctx.arc(sparkle.x, sparkle.y, size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  )
}

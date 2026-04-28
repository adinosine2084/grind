'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Don't activate on touch-only devices
    if (!window.matchMedia('(pointer: fine)').matches) return

    const el = cursorRef.current
    if (!el) return

    const move = (e: MouseEvent) => {
      el.style.left = e.clientX + 'px'
      el.style.top  = e.clientY + 'px'
    }

    // Use event delegation on document — works for dynamic content too
    const onEnter = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('a, button, .task-row, .feature-card, .pricing-card')) {
        el.classList.add('hovered')
      }
    }
    const onLeave = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('a, button, .task-row, .feature-card, .pricing-card')) {
        el.classList.remove('hovered')
      }
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
    }
  }, [])

  return <div className="cursor" ref={cursorRef} aria-hidden="true" />
}

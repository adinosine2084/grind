'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cursorRef.current
    if (!el) return

    const move = (e: MouseEvent) => {
      el.style.left = e.clientX + 'px'
      el.style.top = e.clientY + 'px'
    }

    const addHover = () => el.classList.add('hovered')
    const removeHover = () => el.classList.remove('hovered')

    document.addEventListener('mousemove', move)
    document.querySelectorAll('a,button,.task-row,.feature-card,.pricing-card').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    return () => {
      document.removeEventListener('mousemove', move)
    }
  }, [])

  return <div className="cursor" ref={cursorRef} />
}

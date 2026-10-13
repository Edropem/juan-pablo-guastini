'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (prefersReducedMotion || !isFinePointer) return

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    })

    let frameId: number
    function raf(time: number) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }
    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])

  return null
}

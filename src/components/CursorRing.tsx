'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  const fineQuery = window.matchMedia('(pointer: fine)')
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  fineQuery.addEventListener('change', callback)
  motionQuery.addEventListener('change', callback)
  return () => {
    fineQuery.removeEventListener('change', callback)
    motionQuery.removeEventListener('change', callback)
  }
}

function getSnapshot() {
  return (
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function getServerSnapshot() {
  return false
}

export function CursorRing() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const ringRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!enabled) return

    function onMove(event: MouseEvent) {
      const ring = ringRef.current
      if (ring) ring.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
    }

    function onOver(event: MouseEvent) {
      const target = event.target as HTMLElement
      setActive(Boolean(target.closest('a, button')))
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={ringRef} className={active ? 'cursor-ring cursor-ring--active' : 'cursor-ring'} aria-hidden />
  )
}

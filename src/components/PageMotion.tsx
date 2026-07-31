'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function PageMotion({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

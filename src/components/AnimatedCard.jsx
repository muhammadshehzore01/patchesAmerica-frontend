// project/frontend/src/components/AnimatedCard.jsx
'use client'
import { motion } from 'framer-motion'

export default function AnimatedCard({ children, className = '' }) {
  return (
    <motion.div whileHover={{scale:1.02}} initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10 ${className}`}>
      {children}
    </motion.div>
  )
}

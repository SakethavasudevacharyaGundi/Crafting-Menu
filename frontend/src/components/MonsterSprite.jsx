import React from 'react'
import { motion } from 'framer-motion'

export default function MonsterSprite({ hurt }){
  return (
    <motion.div
      animate={ hurt ? { x: [0, -8, 8, 0], scale: [1,1.03,0.98,1] } : { x: 0 } }
      transition={{ duration: 0.45 }}
      className="w-full h-full flex items-center justify-center"
    >
      <div className={`w-36 h-36 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 ${hurt ? 'ring-4 ring-gray-400/30' : ''}`} />
    </motion.div>
  )
}

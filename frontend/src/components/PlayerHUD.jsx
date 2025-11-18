import React from 'react'
import { useStore } from '../store'

export default function PlayerHUD(){
  const stats = useStore(s=>s.stats)
  const craftQueue = useStore(s=>s.craftQueue)

  return (
    <div className="mt-4 bg-slate-800 p-3 rounded-lg">
      <div className="flex justify-between mb-2">
        <div>
          <div className="text-sm text-slate-300">Total Power</div>
          <div className="font-semibold text-xl">{stats.total_attack_power || 0}</div>
        </div>
        <div>
          <div className="text-sm text-slate-300">Queued Crafts</div>
          <div className="text-lg">{craftQueue?.length || 0}</div>
        </div>
      </div>
    </div>
  )
}

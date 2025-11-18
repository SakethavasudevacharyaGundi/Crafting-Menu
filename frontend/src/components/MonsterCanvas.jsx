import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import { apiPost, apiGet } from '../api'
import MonsterSprite from './MonsterSprite'

export default function MonsterCanvas(){
  const monsters = useStore(s=>s.monsters)
  const playerId = useStore(s=>s.playerId)
  const [selected, setSelected] = useState(null)
  const [hp, setHp] = useState(0)
  const [hitAnim, setHitAnim] = useState(false)

  useEffect(()=>{
    setSelected(monsters[0] || null)
    setHp(monsters[0]?.max_hp || 0)
  }, [monsters])

  async function strike(){
    if (!selected) return
    try {
      await apiPost('/api/attack', { player_id: playerId, monster_id: selected.monster_id })
      await Promise.all([
        apiGet(`/api/inventory/${playerId}`).then(i=>useStore.getState().setInventory(i)),
        apiGet(`/api/stats/${playerId}`).then(s=>useStore.getState().setStats(s))
      ])
      setHitAnim(true)
      setTimeout(()=>setHitAnim(false), 500)
    } catch (e) {
      alert('Attack failed: '+ e.message)
    }
  }

  if (!selected) return <div className="text-slate-400">No monster configured (add /api/monsters)</div>

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Monster: {selected.name}</h3>
        <div className="text-sm text-slate-300">lvl {selected.spawn_level}</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-48 h-48 bg-slate-900 rounded flex items-center justify-center relative overflow-hidden">
          <MonsterSprite hurt={hitAnim} />
        </div>

        <div className="flex-1">
          <div className="bg-red-600 h-5 rounded mb-2">
            <div style={{ width: `${(hp/(selected.max_hp||1))*100}%` }} className="bg-red-400 h-5 rounded transition-all"></div>
          </div>
          <div className="text-sm mb-3">HP: {hp} / {selected.max_hp}</div>

          <div className="flex gap-2">
            <button onClick={strike} className="bg-accent px-3 py-1 rounded">Strike</button>
          </div>
        </div>
      </div>
    </div>
  )
}

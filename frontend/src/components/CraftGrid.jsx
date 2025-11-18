import React from 'react'
import { useStore } from '../store'
import CraftCard from './CraftCard'

export default function CraftGrid(){
  const items = useStore(s=>s.items)

  return (
    <div className="bg-slate-800 p-4 rounded-lg min-h-[60vh]">
      <h2 className="text-lg font-semibold mb-3">Crafting</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.length === 0 ? <div className="text-slate-400">No craftable items (add /api/items)</div> :
          items.map(item => <CraftCard key={item.item_id || item.id} item={item} />)}
      </div>
    </div>
  )
}

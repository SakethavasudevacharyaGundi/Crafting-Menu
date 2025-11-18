import React from 'react'
import { useGameStore } from '../store/useGameStore'
import { apiPost } from '../api'

export default function InventoryPanel(){
  const inventory = useGameStore(s=>s.inventory)
  const spawnTokens = []

  // Ensure inventory is always an array
  const inventoryArray = Array.isArray(inventory) ? inventory : [];

  async function fetchSpawn(){
    try {
      await apiPost('/api/spawn', {})
    } catch (e) { console.error(e) }
  }

  return (
    <div className="bg-slate-800 p-3 rounded-lg">
      <div className="flex justify-between mb-2">
        <h2 className="font-semibold">Inventory</h2>
        <button className="text-sm px-2 py-1 bg-slate-700 rounded" onClick={fetchSpawn}>Spawn</button>
      </div>
      <div className="space-y-2 max-h-[60vh] overflow-auto">
        {inventoryArray.length === 0 ? <div className="text-sm text-slate-400">Empty</div> :
          inventoryArray.map(it => (
            <div key={it.name} className="flex items-center justify-between bg-slate-900 p-2 rounded">
              <div>
                <div className="text-sm font-medium">{it.name}</div>
                <div className="text-xs text-slate-400">qty: {it.qty ?? it.quantity ?? 0}</div>
              </div>
              <div className="text-sm">{it.rarity || ''}</div>
            </div>
          ))
        }
      </div>

      <div className="mt-4">
        <h3 className="font-medium">Spawn Tokens</h3>
        <div className="flex gap-2 mt-2 flex-wrap">
          {spawnTokens.length === 0 && <div className="text-sm text-slate-400">No tokens</div>}
          {spawnTokens.map(token => (
            <button key={token.id} onClick={async ()=>{
              try { await apiPost('/api/spawn', {}) } catch(e){ console.error(e) }
            }} className="bg-amber-500 px-3 py-1 rounded animate-float">
              +{token.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

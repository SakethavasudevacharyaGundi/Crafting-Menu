import React, { useState } from 'react'
import { apiPost, apiGet } from '../api'
import { useStore } from '../store'

export default function CraftCard({ item }){
  const playerId = useStore(s=>s.playerId)
  const [qty, setQty] = useState(1)
  const [busy, setBusy] = useState(false)
  const refresh = async () => {
    const inv = await apiGet(`/api/inventory/${playerId}`).catch(()=>[])
    useStore.getState().setInventory(inv)
    const stats = await apiGet(`/api/stats/${playerId}`).catch(()=>({}))
    useStore.getState().setStats(stats)
  }

  async function craftNow(){
    setBusy(true)
    try {
      await apiPost('/api/craft', { player_id: playerId, item_id: item.item_id || item.id, qty })
      await refresh()
    } catch (e) {
      alert('Craft failed: ' + e.message)
    } finally { setBusy(false) }
  }

  return (
    <div className="bg-slate-900 p-3 rounded-lg">
      <div className="flex justify-between">
        <div>
          <div className="text-sm font-medium">{item.name}</div>
          <div className="text-xs text-slate-400">atk: {item.base_attack || item.attackValue || 0}</div>
        </div>
        <div className="text-xs">{item.rarity}</div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input type="number" value={qty} min={1} onChange={e=>setQty(Number(e.target.value))} className="w-20 p-1 rounded bg-slate-800" />
        <button disabled={busy} onClick={craftNow} className="bg-primary px-3 py-1 rounded">
          {busy ? 'Crafting...' : 'Craft'}
        </button>
      </div>
    </div>
  )
}

import React from 'react'
import InventoryPanel from './InventoryPanel'
import CraftGrid from './CraftGrid'
import MonsterCanvas from './MonsterCanvas'
import PlayerHUD from './PlayerHUD'

export default function Shell({ onRefresh }){
  return (
    <div className="min-h-screen p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-200">Craft & Clash</h1>
        <div className="flex items-center space-x-3">
          <button onClick={onRefresh} className="bg-primary px-3 py-1 rounded">Refresh</button>
        </div>
      </header>

      <main className="grid grid-cols-12 gap-4">
        <aside className="col-span-12 md:col-span-3">
          <InventoryPanel />
        </aside>

        <section className="col-span-12 md:col-span-5">
          <CraftGrid />
        </section>

        <section className="col-span-12 md:col-span-4">
          <MonsterCanvas />
          <PlayerHUD />
        </section>
      </main>
    </div>
  )
}

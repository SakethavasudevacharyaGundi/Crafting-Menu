import React, { useEffect } from 'react'
import GameScreen from './components/GameScreen'
import GameScreenDebug from './components/GameScreen-debug'
import CraftingModal from './components/CraftingModal'
import { useGameStore } from './store/useGameStore'
import { apiGet } from './api'

export default function App(){
  const debug = String(import.meta.env.VITE_DEBUG || '').toLowerCase() === 'true' || String(import.meta.env.VITE_DEBUG) === '1'
  const showCrafting = useGameStore(s => s.showCrafting)
  const craftingOpen = useGameStore(s => s.craftingOpen)
  const setInventory = useGameStore(s => s.setInventory)
  const setRecipes = useGameStore(s => s.setRecipes)
  const setDragon = useGameStore(s => s.setDragon)
  const playerId = useGameStore(s => s.playerId)

  useEffect(() => {
    // Initial data load
    async function loadData() {
      try {
        // Treat refresh as a new session: reset backend inventory to starter item
        try { await fetch('/api/session/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playerId }) }); } catch {}

        const [invRes, recipes] = await Promise.all([
          apiGet(`/api/inventory/${playerId}`).catch(() => ({ inventory: [] })),
          apiGet('/api/recipes').catch(() => [])
        ])
        const inv = invRes.inventory || invRes || []
        setInventory(inv)
        setRecipes(recipes)
      } catch (err) {
        console.error('Failed to load initial data:', err)
      }
    }

    loadData()

    // Poll for updates every 3 seconds
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [playerId, setInventory, setRecipes, setDragon])

  // Reset dragon health to full on each page load (treat each session as new)
  useEffect(() => {
    try { localStorage.clear(); sessionStorage.clear(); } catch {}
    setDragon({ hp: 1000, maxHp: 1000 })
  }, [setDragon])

  return (
    <>
      {debug || String(import.meta.env.VITE_SAFE_MODE) === '1' ? <GameScreenDebug /> : <GameScreen />}
      {(showCrafting || craftingOpen) && <CraftingModal />}
    </>
  )
}

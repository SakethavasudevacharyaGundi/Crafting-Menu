import { create } from 'zustand'

export const useStore = create((set) => ({
  playerId: Number(import.meta.env.VITE_PLAYER_ID || 1),
  inventory: [],
  stats: { total_attack_power: 0 },
  items: [],
  monsters: [],
  spawnTokens: [],
  craftQueue: [],
  loading: false,
  error: null,
  setInventory: (inv) => set({ inventory: inv }),
  setStats: (s) => set({ stats: s }),
  setItems: (it) => set({ items: it }),
  setMonsters: (m) => set({ monsters: m }),
  setSpawnTokens: (t) => set({ spawnTokens: t }),
  setCraftQueue: (q) => set({ craftQueue: q }),
  setLoading: (b) => set({ loading: b }),
  setError: (e) => set({ error: e }),
}))

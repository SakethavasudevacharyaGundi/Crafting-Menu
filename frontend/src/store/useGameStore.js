import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  playerId: 1,
  dragon: { hp: 1000, maxHp: 1000 },
  inventory: [],
  recipes: [],
  spawnItems: [],
  craftingOpen: false,
  selectedWeaponId: null,
  showInventoryDock: false,
  lastHit: null, // { text: string, at: number }
  activityLog: [], // { id, actionType, itemName, qty, timestamp }
  
  setDragon: (dragon) => set({ dragon }),
  setInventory: (inventory) => set({ inventory }),
  setRecipes: (recipes) => set({ recipes }),
  setSpawnItems: (spawnItems) => set({ spawnItems }),
  setSelectedWeaponId: (id) => set({ selectedWeaponId: id }),
  toggleInventoryDock: () => set(s => ({ showInventoryDock: !s.showInventoryDock })),
  setLastHit: (payload) => set({ lastHit: payload }),
  
  // Activity log management
  addToActivityLog: (actionType, itemName, qty = 1) => {
    const newEntry = {
      id: Date.now() + Math.random(),
      actionType,
      itemName,
      qty,
      timestamp: Date.now()
    };
    set(state => ({
      activityLog: [newEntry, ...state.activityLog].slice(0, 5) // Keep only 5 most recent
    }));
  },
  clearActivityLog: () => set({ activityLog: [] }),
  
  openCrafting: () => set({ craftingOpen: true }),
  closeCrafting: () => set({ craftingOpen: false }),
  
  // Legacy compatibility
  showCrafting: false,
  toggleCrafting: () => set(s => ({ showCrafting: !s.showCrafting, craftingOpen: !s.craftingOpen })),
  setCrafting: (v) => set({ showCrafting: !!v, craftingOpen: !!v }),

  playerHP: 9,
  setPlayerHP: (hp) => set({ playerHP: Math.max(0, Math.min(9, hp)) }),

  dragonHP: 80,
  setDragonHP: (v) => set({ dragonHP: Math.max(0, Math.min(100, v)) }),

  activeSlot: 0,
  setActiveSlot: (i) => set({ activeSlot: Math.max(0, Math.min(8, i)) }),

  hotbarOffset: 0, // start index for visible hotbar window
  setHotbarOffset: (n) => set({ hotbarOffset: Math.max(0, n|0) }),

  hotbar: Array.from({ length: 8 }).map((_, i) => ({ id: i, icon: null, qty: 0 })),

  attackDragon: (amount = 7) => set(s => ({ dragonHP: Math.max(0, s.dragonHP - amount) })),
}));

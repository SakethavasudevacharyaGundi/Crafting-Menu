import React from 'react'
import { useGameStore } from '../store/useGameStore'
import { apiPost, apiGet } from '../api'

export default function CraftingModal(){
  const craftingOpen = useGameStore(s => s.craftingOpen)
  const closeCrafting = useGameStore(s => s.closeCrafting)
  const recipes = useGameStore(s => s.recipes)
  const inventory = useGameStore(s => s.inventory)
  const setInventory = useGameStore(s => s.setInventory)
  const playerId = useGameStore(s => s.playerId)

  // Ensure inventory is always an array
  const inventoryArray = Array.isArray(inventory) ? inventory : [];

  if (!craftingOpen) return null

  function canCraft(recipe) {
    if (!recipe.ingredients || recipe.ingredients.length === 0) return false
    return recipe.ingredients.every(ing => {
      const have = inventoryArray.find(i => i.item_id === ing.ingredient_id)
      const haveQty = Number(have?.qty ?? have?.quantity ?? 0)
      const needQty = Number(ing.qty ?? ing.quantity ?? 0)
      return haveQty >= needQty
    })
  }

  async function craft(recipe) {
    try {
      await apiPost('/api/craft', { player_id: playerId, item_id: recipe.item_id })
      // Refresh inventory
  const inv = await apiGet(`/api/inventory/${playerId}`)
  setInventory(inv.inventory || inv || [])
    } catch (e) {
      alert('Craft failed: ' + (e.message || 'Unknown error'))
    }
  }

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': 'text-gray-400',
      'Uncommon': 'text-green-400',
      'Rare': 'text-blue-400',
      'VeryRare': 'text-purple-400'
    }
    return colors[rarity] || 'text-gray-400'
  }

  return (
    <div className="fixed inset-0 backdrop flex items-center justify-center z-50">
      <div className="text-gray-900 p-6 rounded-md shadow-2xl w-[900px] max-w-[95vw] max-h-[90vh] overflow-y-auto pixel-border relative">
        <button
          onClick={closeCrafting}
          className="absolute top-3 right-4 text-2xl font-bold hover:text-red-600 transition-colors"
          aria-label="Close crafting"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">⚒️ Crafting Menu</h2>

        {/* Inventory summary */}
        <div className="mb-4 p-3 rounded border border-gray-400">
          <div className="text-sm font-bold mb-2">📦 Your Inventory:</div>
          <div className="flex flex-wrap gap-2">
            {inventoryArray.length === 0 ? (
              <span className="text-xs text-gray-500">Empty</span>
            ) : (
              inventoryArray.map(item => (
                <div key={item.item_id} className="text-xs px-2 py-1 rounded border border-gray-400">
                  {item.name} <span className="text-gray-300">×{item.qty ?? item.quantity ?? 0}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recipe grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No recipes available
            </div>
          ) : (
            recipes.map(recipe => {
              const craftable = canCraft(recipe)
              return (
                <div 
                  key={recipe.item_id} 
                  className={`p-4 rounded border-2 ${
                    craftable 
                      ? 'border-green-500' 
                      : 'border-red-400'
                  } transition-all hover:shadow-lg`}
                >
                  <div className={`font-bold text-base mb-1 ${getRarityColor(recipe.rarity)}`}>
                    {recipe.name}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    ⚔ Attack: {recipe.base_attack} | ⏱ {recipe.craft_time_seconds}s
                  </div>
                  
                  <div className="mt-3 mb-3">
                    <div className="text-xs font-semibold mb-1">Required:</div>
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                      <div className="space-y-1">
                        {recipe.ingredients.map(ing => {
                          const have = inventoryArray.find(i => i.item_id === ing.ingredient_id)
                          const haveQty = Number(have?.qty ?? have?.quantity ?? 0)
                          const needQty = Number(ing.qty ?? ing.quantity ?? 0)
                          const enough = haveQty >= needQty
                          return (
                            <div 
                              key={ing.ingredient_id} 
                              className={`text-xs ${enough ? 'text-green-700' : 'text-red-700'}`}
                            >
                              • {ing.name || `Item #${ing.ingredient_id}`} ×{needQty} 
                              <span className="text-gray-500"> (have: {haveQty})</span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">No ingredients</div>
                    )}
                  </div>

                  <button 
                    disabled={!craftable} 
                    onClick={() => craft(recipe)} 
                    className={`w-full mt-2 px-3 py-2 rounded font-bold text-sm transition-all border-2 ${
                      craftable 
                        ? 'border-green-600 text-green-600 cursor-pointer' 
                        : 'border-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {craftable ? '✓ Craft' : '✗ Insufficient Materials'}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

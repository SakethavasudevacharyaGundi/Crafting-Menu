import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getItemIconSync } from '../utils/itemIcons';
import { useGameStore } from '../store/useGameStore';
import { apiGet, apiPost } from '../api';

const RecipeBook = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [craftableItems, setCraftableItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState([]);
  const [ingredientsLoading, setIngredientsLoading] = useState(false);
  const inventory = useGameStore(s => s.inventory);
  const setInventory = useGameStore(s => s.setInventory);
  const addToActivityLog = useGameStore(s => s.addToActivityLog);
  const [loading, setLoading] = useState(false);
  const [crafting, setCrafting] = useState(false);
  const playerId = 1;

  useEffect(() => {
    if (isOpen) {
      fetchCraftable();
      fetchInventory();
    }
  }, [isOpen]);

  // Load recipes: show ALL recipes, and annotate which ones are craftable for the player
  const fetchCraftable = async () => {
    setLoading(true);
    try {
      // Fetch all items that have recipes
      const allRecipes = await apiGet('/api/recipes').catch(() => []);

      // Fetch craftable set for the player (optional)
      let craftableSet = new Set();
      try {
        const res = await fetch(`/api/recipes/craftable/${playerId}`);
        const data = await res.json();
        if (data?.success && Array.isArray(data.craftable_items)) {
          craftableSet = new Set(data.craftable_items.map(r => r.item_id));
        }
      } catch (e) {
        console.warn('Failed to load craftable list; showing all recipes without READY flag');
      }

      // Merge: all recipes with can_craft flag
      const merged = (allRecipes || []).map(it => ({
        ...it,
        can_craft: craftableSet.has(it.item_id)
      }));

      // Sort: READY first, then rarity, then name
      const rarityRank = { legendary: 4, epic: 3, rare: 2, common: 1 };
      merged.sort((a, b) => {
        const readyDiff = Number(b.can_craft) - Number(a.can_craft);
        if (readyDiff) return readyDiff;
        const rdiff = (rarityRank[b.rarity] || 0) - (rarityRank[a.rarity] || 0);
        if (rdiff) return rdiff;
        return String(a.name).localeCompare(String(b.name));
      });

      setCraftableItems(merged);

      const initial = merged[0];
      if (initial) {
        setSelectedItem(initial);
        fetchExpanded(initial.item_id);
      } else {
        setSelectedItem(null);
        setRecipeDetails([]);
      }
    } catch (err) {
      console.error(err);
      setCraftableItems([]);
      setSelectedItem(null);
      setRecipeDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const inv = await apiGet(`/api/inventory/${playerId}`);
      setInventory(inv.inventory || inv || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Use expanded recipe (derived/base materials) to match the mock
  const fetchExpanded = async (itemId) => {
    setIngredientsLoading(true);
    try {
      console.log('Fetching expanded recipe for', itemId);
      const data = await apiGet(`/api/recipes/expand/${itemId}/1`);
      console.log('Expanded recipe response', data);
      if (data.success) {
        const list = Array.isArray(data.expanded_recipe) ? data.expanded_recipe : [];
        setRecipeDetails(list);
      } else {
        setRecipeDetails([]);
      }
    } catch (err) {
      console.error(err);
      setRecipeDetails([]);
    } finally {
      setIngredientsLoading(false);
    }
  };

  // Safe numeric coerce helper
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const canCraftSelected = () => {
    if (!selectedItem) {
      console.log('[Craft Check] No item selected');
      return false;
    }
    
    // Debug logging
    console.log('[Craft Check] Selected Item:', selectedItem.name, 'ID:', selectedItem.item_id);
    console.log('[Craft Check] Recipe Details:', recipeDetails);
    console.log('[Craft Check] Inventory Count:', inventory?.length);
    
    // If recipe details haven't loaded yet, can't craft
    if (!recipeDetails || recipeDetails.length === 0) {
      console.log('[Craft Check] No recipe details loaded yet');
      return false;
    }
    
    // ALWAYS use expanded recipe logic instead of can_craft boolean
    // because can_craft may be stale or incorrectly calculated
    const result = (recipeDetails || []).every(ing => {
      const inv = (inventory || []).find(i => i.item_id === ing.item_id);
      const have = toNum(inv?.qty ?? inv?.quantity ?? 0);
      const need = toNum(ing.total_qty ?? ing.quantity ?? ing.qty ?? 0);
      const sufficient = have >= need;
      
      console.log(`[Craft Check] ${ing.name} (ID ${ing.item_id}): have ${have}, need ${need}, sufficient: ${sufficient}`);
      console.log(`[Craft Check]   - Inventory item:`, inv);
      
      return sufficient;
    });
    
    console.log('[Craft Check] Final Result:', result);
    return result;
  };

  const handleCraft = async () => {
    if (!selectedItem || !canCraftSelected() || crafting) return;
    setCrafting(true);
    try {
      const data = await apiPost('/api/craft', {
        player_id: playerId,
        item_id: selectedItem.item_id,
        qty: 1
      });
      if (!data.success) throw new Error(data.error || 'Craft failed');
      
      // Add to activity log
      addToActivityLog('Crafted', selectedItem.name, 1);
      
      await fetchInventory();
      await fetchCraftable();
      // Re-fetch expanded recipe for updated counts
      if (selectedItem) fetchExpanded(selectedItem.item_id);
    } catch (err) {
      console.error(err);
      alert('Crafting failed: ' + err.message);
    } finally {
      setCrafting(false);
    }
  };

  // Get ingredient availability (nullish-coalescing so 0 stays 0)
  const getIngredientStatus = (ing) => {
    const inventoryItem = (inventory || []).find(i => i.item_id === ing.item_id);
    const have = toNum(inventoryItem?.qty ?? inventoryItem?.quantity ?? 0);
    const need = toNum(ing.total_qty ?? ing.quantity ?? ing.qty ?? 0);
    return { have, need, hasEnough: have >= need };
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          console.log('Recipe Book button clicked!');
          setIsOpen(true);
        }}
        className="w-20 h-20 rounded-lg transition-all duration-200 relative hover:scale-105"
        title="Open Recipe Book"
        style={{
          background: '#8B5E3C',
          border: '4px solid #5A3A22',
          boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
        }}
      >
        <span className="text-4xl">📖</span>
      </button>
    );
  }

  console.log('RecipeBook rendering, isOpen:', isOpen);

  // Render modal in a Portal so position: fixed is relative to the viewport
  // and not constrained by transformed ancestors (e.g., -translate-y-1/2).
  return createPortal(
    (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
            style={{ background: 'rgba(0,0,0,0.85)' }}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              style={{
                width: '90%',
                maxWidth: '1100px',
                height: '80vh',
                background: '#E7D3AC',
                border: '6px solid #8B5E3C',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
                fontFamily: '"Press Start 2P", "VT323", monospace',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row'
              }}
            >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center"
            style={{
              background: '#8B5E3C',
              border: '3px solid #5A3A22',
              borderRadius: '6px',
              color: '#F3E5C8',
              fontSize: '20px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
          >
            ✕
          </button>

          {/* LEFT COLUMN - CRAFTING BOOK */}
          <div
            className="flex flex-col"
            style={{
              width: '35%',
              height: '100%',
              borderRight: '6px solid #8B5E3C',
              background: '#D8C2A3'
            }}
          >
            {/* Header */}
            <div
              className="text-center py-3"
              style={{
                borderBottom: '6px solid #8B5E3C',
                background: '#C4AE8C',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#3C1E12',
                letterSpacing: '2px'
              }}
            >
              CRAFTING BOOK
            </div>

            {/* Scrollable List */}
            <div
              className="flex-1 overflow-y-auto"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#8B5E3C #D8C2A3'
              }}
            >
              {loading ? (
                <div className="text-center py-8 text-sm" style={{ color: '#3C1E12' }}>
                  Loading...
                </div>
              ) : craftableItems.length === 0 ? (
                <div className="text-center py-8 text-xs px-4" style={{ color: '#3C1E12' }}>
                  No recipes available
                </div>
              ) : (
                craftableItems.map(item => {
                  const isSelected = selectedItem?.item_id === item.item_id;
                  const icon = getItemIconSync(item.name);
                  
                  return (
                    <div
                      key={item.item_id}
                      onClick={() => {
                        setSelectedItem(item);
                        fetchExpanded(item.item_id);
                      }}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all"
                      style={{
                        borderBottom: '2px solid #8B5E3C',
                        background: isSelected ? '#CDAA7D' : 'transparent',
                        color: '#3C1E12',
                        fontSize: '11px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = '#D5B489';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <img
                        src={icon}
                        alt={item.name}
                        className="w-8 h-8"
                        style={{
                          imageRendering: 'pixelated',
                          border: '2px solid #5A3A22',
                          background: '#F3E5C8',
                          padding: '2px'
                        }}
                      />
                      <span style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                        {item.name}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - PRODUCTION PANEL */}
          <div
            className="flex flex-col"
            style={{
              width: '65%',
              height: '100%',
              background: '#E7D3AC'
            }}
          >
            {/* Header */}
            <div
              className="text-center py-3"
              style={{
                borderBottom: '6px solid #8B5E3C',
                background: '#DCC9A6',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#3C1E12',
                letterSpacing: '2px'
              }}
            >
              PRODUCTION
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
              {selectedItem ? (
                <div className="flex flex-col items-center">
                  {/* Item Display */}
                  <div
                    className="flex flex-col items-center mb-6 p-4"
                    style={{
                      background: '#F3E5C8',
                      border: '4px solid #8B5E3C',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                  >
                    <img
                      src={getItemIconSync(selectedItem.name)}
                      alt={selectedItem.name}
                      className="w-20 h-20 mb-3"
                      style={{
                        imageRendering: 'pixelated',
                        border: '3px solid #5A3A22',
                        background: 'white',
                        padding: '4px'
                      }}
                    />
                    <h3
                      className="text-center"
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#3C1E12',
                        letterSpacing: '1px'
                      }}
                    >
                      {selectedItem.name}
                    </h3>
                  </div>

                  {/* Ingredients Section */}
                  <div className="w-full max-w-md">
                    <h4
                      className="text-center mb-3"
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#3C1E12',
                        letterSpacing: '1px'
                      }}
                    >
                      Ingredients:
                    </h4>

                    <div
                      className="space-y-2"
                      style={{
                        background: '#F3E5C8',
                        border: '4px solid #8B5E3C',
                        borderRadius: '8px',
                        padding: '12px'
                      }}
                    >
                      {ingredientsLoading ? (
                        <div className="text-center py-4 text-xs" style={{ color: '#666' }}>
                          Loading ingredients...
                        </div>
                      ) : recipeDetails.length === 0 ? (
                        <div className="text-center py-4 text-xs" style={{ color: '#3C1E12' }}>
                          No ingredients required
                        </div>
                      ) : (
                        recipeDetails.map(ing => {
                          const status = getIngredientStatus(ing);
                          const icon = getItemIconSync(ing.name);

                          return (
                            <div
                              key={ing.item_id}
                              className="flex justify-between items-center py-2 px-3"
                              style={{
                                background: '#E7D3AC',
                                border: '2px solid #8B5E3C',
                                borderRadius: '4px'
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={icon}
                                  alt={ing.name}
                                  className="w-6 h-6"
                                  style={{
                                    imageRendering: 'pixelated',
                                    border: '2px solid #5A3A22',
                                    background: 'white'
                                  }}
                                />
                                <span style={{ fontSize: '10px', color: '#3C1E12' }}>
                                  {ing.name}
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  color: status.hasEnough ? '#2D8B3C' : '#B33C3C'
                                }}
                              >
                                {status.have}/{status.need}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex-1 flex items-center justify-center"
                  style={{ color: '#8B5E3C', fontSize: '12px' }}
                >
                  Select an item to view recipe
                </div>
              )}

              {/* Craft Button */}
              {selectedItem && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleCraft}
                    disabled={!canCraftSelected() || crafting}
                    className="px-12 py-4 transition-all"
                    style={{
                      background: canCraftSelected() && !crafting ? '#8B5E3C' : '#666',
                      border: '4px solid #5A3A22',
                      borderRadius: '8px',
                      color: '#F3E5C8',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      letterSpacing: '2px',
                      cursor: canCraftSelected() && !crafting ? 'pointer' : 'not-allowed',
                      boxShadow: canCraftSelected() && !crafting ? '0 4px 12px rgba(0,0,0,0.4)' : 'none',
                      transform: canCraftSelected() && !crafting ? 'translateY(0)' : 'translateY(2px)',
                      opacity: canCraftSelected() && !crafting ? 1 : 0.6
                    }}
                    onMouseEnter={(e) => {
                      if (canCraftSelected() && !crafting) {
                        e.currentTarget.style.background = '#A8734C';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (canCraftSelected() && !crafting) {
                        e.currentTarget.style.background = '#8B5E3C';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {crafting ? 'CRAFTING...' : 'CRAFT'}
                  </button>
                </div>
              )}
            </div>
          </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    ),
    document.body
  );
};

export default RecipeBook;
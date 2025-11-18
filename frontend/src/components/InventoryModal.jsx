import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, X } from 'lucide-react';

const rarityColors = {
  common: 'text-gray-400 border-gray-400/50 bg-gray-400/10',
  rare: 'text-blue-400 border-blue-400/50 bg-blue-400/10',
  epic: 'text-purple-400 border-purple-400/50 bg-purple-400/10',
  legendary: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10'
};

const categoryIcons = {
  material: '🧱',
  weapon: '⚔️',
  armor: '🛡️',
  magic: '✨',
  tool: '🔧'
};

const InventoryModal = ({ isOpen, onClose, playerId = 1 }) => {
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('material');
  const [sortBy, setSortBy] = useState('rarity');

  useEffect(() => {
    if (isOpen && playerId) {
      fetchInventory();
    }
  }, [isOpen, playerId]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/inventory/${playerId}/categorized`);
      const data = await response.json();
      
      if (data.success) {
        setInventory(data.inventory);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      if (sortBy === 'rarity') {
        const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      } else if (sortBy === 'quantity') {
        return b.quantity - a.quantity;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'attack') {
        return b.base_attack - a.base_attack;
      }
      return 0;
    });
  };

  const categories = Object.keys(inventory).filter(cat => inventory[cat]?.length > 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-4 border-blue-600/80 rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 relative">
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold text-blue-100 tracking-wider flex items-center space-x-2">
                <Package size={28} />
                <span>INVENTORY</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-blue-100 hover:text-blue-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex h-[70vh]">
            {/* Left Panel - Categories */}
            <div className="w-1/4 bg-gradient-to-b from-gray-800 to-gray-900 border-r-4 border-blue-600/50">
              <div className="p-4 border-b-2 border-blue-600/50">
                <h3 className="text-blue-100 font-bold text-center">Categories</h3>
              </div>
              
              <div className="p-4 space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`w-full p-3 rounded-lg transition-all duration-200 text-left ${
                      activeCategory === category
                        ? 'bg-blue-600/30 border-2 border-blue-400 text-blue-100'
                        : 'bg-gray-700/50 border-2 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{categoryIcons[category]}</span>
                      <div>
                        <div className="font-semibold capitalize">{category}s</div>
                        <div className="text-sm text-gray-400">
                          {inventory[category]?.length || 0} items
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel - Items */}
            <div className="flex-1 bg-gradient-to-b from-gray-700 to-gray-800">
              {/* Sort Controls */}
              <div className="p-4 border-b-2 border-blue-600/50 bg-gradient-to-r from-gray-600 to-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-blue-100 font-bold capitalize">
                    {activeCategory}s ({inventory[activeCategory]?.length || 0})
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-gray-200"
                  >
                    <option value="rarity">Sort by Rarity</option>
                    <option value="name">Sort by Name</option>
                    <option value="quantity">Sort by Quantity</option>
                    {activeCategory === 'weapon' && <option value="attack">Sort by Attack</option>}
                  </select>
                </div>
              </div>

              {/* Items Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="text-center text-blue-200 py-8">Loading inventory...</div>
                ) : inventory[activeCategory]?.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {sortItems(inventory[activeCategory]).map((item) => (
                      <motion.div
                        key={item.item_id}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${rarityColors[item.rarity]}`}
                        whileHover={{ y: -2 }}
                        layout
                      >
                        {/* Item Icon */}
                        <div className="flex justify-center mb-3">
                          <div className={`w-12 h-12 rounded-lg border-2 ${rarityColors[item.rarity]} flex items-center justify-center text-2xl`}>
                            {categoryIcons[item.item_type]}
                          </div>
                        </div>

                        {/* Item Info */}
                        <div className="text-center">
                          <div className="font-bold text-gray-200 text-sm mb-1 truncate" title={item.name}>
                            {item.name}
                          </div>
                          
                          <div className="text-xs space-y-1">
                            <div className={rarityColors[item.rarity].split(' ')[0]}>
                              {item.rarity.toUpperCase()}
                            </div>
                            
                            {item.base_attack > 0 && (
                              <div className="text-red-400 font-bold">
                                ⚔ {item.base_attack}
                              </div>
                            )}
                            
                            <div className="text-gray-300 font-bold">
                              × {item.quantity}
                            </div>
                          </div>
                        </div>

                        {/* Hover Tooltip */}
                        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 text-gray-200 px-3 py-2 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="font-bold">{item.name}</div>
                          <div className={rarityColors[item.rarity].split(' ')[0]}>
                            {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)} {item.item_type}
                          </div>
                          {item.base_attack > 0 && <div>Attack: {item.base_attack}</div>}
                          <div>Quantity: {item.quantity}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-6xl mb-4">{categoryIcons[activeCategory]}</div>
                    <div>No {activeCategory}s in inventory</div>
                    <div className="text-sm mt-2">
                      {activeCategory === 'material' 
                        ? 'Use the Magic Crystal to spawn materials!' 
                        : 'Craft items in the Recipe Book to add them here!'
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InventoryModal;
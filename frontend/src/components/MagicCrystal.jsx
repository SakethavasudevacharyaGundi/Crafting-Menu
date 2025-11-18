import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const rarityColors = {
  common: 'text-gray-400 border-gray-400',
  rare: 'text-blue-400 border-blue-400',
  epic: 'text-purple-400 border-purple-400',
  legendary: 'text-yellow-400 border-yellow-400'
};

const rarityGlow = {
  common: 'shadow-gray-400/50',
  rare: 'shadow-blue-400/50',
  epic: 'shadow-purple-400/50',
  legendary: 'shadow-yellow-400/50'
};

const MagicCrystal = ({ playerId = 1, onItemsCollected }) => {
  const [isSpawning, setIsSpawning] = useState(false);
  const [spawnedItems, setSpawnedItems] = useState([]);
  const [cooldown, setCooldown] = useState(false);

  const handleCrystalClick = useCallback(async () => {
    if (isSpawning || cooldown) return;

    setIsSpawning(true);
    setCooldown(true);

    try {
      const response = await fetch('/api/spawn/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId })
      });

      const data = await response.json();
      
      if (data.success && data.spawned_items.length > 0) {
        setSpawnedItems(data.spawned_items);
        
        // Call parent callback if provided
        if (onItemsCollected) {
          onItemsCollected(data.spawned_items);
        }

        // Clear spawned items after animation
        setTimeout(() => {
          setSpawnedItems([]);
          setIsSpawning(false);
        }, 3000);
      } else {
        setIsSpawning(false);
      }
    } catch (error) {
      console.error('Failed to spawn items:', error);
      setIsSpawning(false);
    }

    // Cooldown period
    setTimeout(() => {
      setCooldown(false);
    }, 2000);
  }, [playerId, onItemsCollected, isSpawning, cooldown]);

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
      {/* Magic Crystal */}
      <motion.div
        className={`relative cursor-pointer ${cooldown ? 'opacity-50' : 'opacity-100'}`}
        whileHover={!cooldown ? { scale: 1.1 } : {}}
        whileTap={!cooldown ? { scale: 0.95 } : {}}
        onClick={handleCrystalClick}
        animate={{
          rotate: isSpawning ? 360 : 0,
          scale: isSpawning ? [1, 1.2, 1] : 1
        }}
        transition={{
          rotate: { duration: 1, ease: "easeInOut" },
          scale: { duration: 0.5, repeat: isSpawning ? Infinity : 0 }
        }}
      >
        {/* Crystal Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full blur-md"
          animate={{
            opacity: isSpawning ? [0.6, 1, 0.6] : 0.4,
            scale: isSpawning ? [1, 1.3, 1] : 1
          }}
          transition={{ duration: 1, repeat: isSpawning ? Infinity : 0 }}
        />
        
        {/* Crystal Body */}
        <div className="relative w-16 h-16 bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 rounded-full shadow-lg border-2 border-gray-400">
          <div className="absolute inset-2 bg-gradient-to-br from-gray-200/40 to-transparent rounded-full" />
          <div className="absolute top-2 left-2 w-3 h-3 bg-gray-200/60 rounded-full blur-sm" />
        </div>

        {/* Cooldown overlay */}
        {cooldown && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <span className="text-gray-200 text-xs font-bold">⏳</span>
          </div>
        )}
      </motion.div>

      {/* Floating Items */}
      <AnimatePresence>
        {spawnedItems.map((item, index) => (
          <SpawnedItem
            key={`${item.name}-${index}`}
            item={item}
            index={index}
            onCollect={() => {
              setSpawnedItems(prev => prev.filter((_, i) => i !== index));
            }}
          />
        ))}
      </AnimatePresence>

      {/* Instructions */}
      {!isSpawning && !cooldown && (
        <motion.div
          className="absolute -left-32 top-1/2 transform -translate-y-1/2 text-gray-200 px-3 py-1 rounded-lg text-sm whitespace-nowrap"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          Click to spawn materials! ✨
        </motion.div>
      )}
    </div>
  );
};

const SpawnedItem = ({ item, index, onCollect }) => {
  const angle = (index * 60) + (Math.random() * 40 - 20); // Spread items in different directions
  const distance = 80 + (Math.random() * 40); // Random distance

  const targetX = Math.cos((angle * Math.PI) / 180) * distance;
  const targetY = Math.sin((angle * Math.PI) / 180) * distance;

  return (
    <motion.div
      className={`absolute top-8 left-8 cursor-pointer z-60 ${rarityColors[item.rarity]} ${rarityGlow[item.rarity]}`}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      animate={{
        x: targetX,
        y: targetY,
        scale: [0, 1.2, 1],
        opacity: [0, 1, 1],
      }}
      exit={{
        scale: 0,
        opacity: 0,
        transition: { duration: 0.2 }
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.1 }}
      onClick={onCollect}
    >
      {/* Item Icon Background */}
      <div className={`w-12 h-12 border-2 rounded-lg bg-black/80 flex items-center justify-center shadow-lg`}>
        {/* Item Icon - You can replace these with actual icons */}
        <span className="text-lg font-bold">
          {item.item_type === 'material' && '🧱'}
          {item.item_type === 'weapon' && '⚔️'}
          {item.item_type === 'armor' && '🛡️'}
          {item.item_type === 'magic' && '✨'}
          {item.item_type === 'tool' && '🔧'}
        </span>
      </div>

      {/* Item Tooltip */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-gray-200 px-2 py-1 rounded text-xs whitespace-nowrap">
        <div className="font-bold">{item.name}</div>
        <div className={`text-xs ${rarityColors[item.rarity].split(' ')[0]}`}>
          {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
        </div>
      </div>

      {/* Rarity Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-lg ${rarityGlow[item.rarity]} opacity-50`}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default MagicCrystal;
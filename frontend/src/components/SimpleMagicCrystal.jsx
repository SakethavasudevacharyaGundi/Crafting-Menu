import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { apiGet, apiPost } from '../api';
import { getItemIconSync } from '../utils/itemIcons';

const MagicCrystal = () => {
  const [isSpawning, setIsSpawning] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [flyingItems, setFlyingItems] = useState([]);
  const [hover, setHover] = useState(false);
  const setInventory = useGameStore(s => s.setInventory);
  const playerId = useGameStore(s => s.playerId);
  const inventory = useGameStore(s => s.inventory);
  const setHotbarOffset = useGameStore(s => s.setHotbarOffset);
  const addToActivityLog = useGameStore(s => s.addToActivityLog);

  const handleCrystalClick = async () => {
    if (isSpawning || cooldown) return;

    setIsSpawning(true);
    setCooldown(true);

    try {
      // ask backend to spawn 1..3 instances
      const count = Math.floor(Math.random() * 3) + 1;
      const data = await apiPost('/api/spawn', { count });
      if (data.ok && Array.isArray(data.spawned)) {
        const items = data.spawned.map((spawn, index) => ({
          id: `${spawn.spawnId}`,
          spawnId: spawn.spawnId,
          name: spawn.name,
          rarity: spawn.rarity || 'unknown',
          icon: getItemIconSync(spawn.name),
          delay: index * 100
        }));
        
        setFlyingItems(items);

        // Auto-collect immediately so inventory reflects spawned results; keep icons as visual loot
        try {
          await Promise.all(items.map(it => apiPost('/api/collect', { spawnId: Number(it.spawnId), playerId })));
          const inv = await apiGet(`/api/inventory/${playerId}`);
          setInventory(inv.inventory || inv);
          
          // Add to activity log
          items.forEach(item => {
            addToActivityLog('Spawned', item.name, 1);
          });
          
          const equippables = (inv.inventory || inv || []).filter(it => (it.base_attack>0)||['weapon','tool','magic'].includes(String(it.item_type).toLowerCase()));
          if(equippables.length>9){ setHotbarOffset(Math.max(0, equippables.length-9)); }
        } catch (err) {
          console.error('auto-collect failed', err);
        }

        // Remove floating icons after a short timeout (visual cleanup)
        setTimeout(() => setFlyingItems([]), 2000);
      }
    } catch (error) {
      console.error('Failed to spawn items:', error);
    }

    setIsSpawning(false);
    // Cooldown period (0.5s)
    setTimeout(() => { setCooldown(false); }, 500);
  };

  return (
    <div className="fixed right-6 bottom-6 z-40">
      <button
        className={`w-16 h-16 rounded-full transition-all duration-200 relative
          ${cooldown ? 'opacity-60 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}
          ${isSpawning ? 'animate-pulse' : ''}`}
        onClick={handleCrystalClick}
        disabled={cooldown}
        title="Click to spawn materials!"
        onMouseEnter={()=>setHover(true)}
        onMouseLeave={()=>setHover(false)}
        style={{
          background: 'radial-gradient(circle, #9b6b3a 0%, #5C4033 55%, #3E2723 100%)',
          border: '4px solid #2B1A0A',
          boxShadow: cooldown 
            ? '0 0 12px rgba(91,60,39,0.35) inset' 
            : '0 0 30px rgba(240,216,176,0.45), 0 0 60px rgba(91,60,39,0.5), inset 0 2px 10px rgba(255,255,255,0.08)',
        }}
      >
        <span className="text-3xl drop-shadow-lg" style={{ color: cooldown ? '#B89B76' : '#F0D8B0' }}>✨</span>
      </button>

      {/* Hover label */}
      <AnimatePresence>
        {hover && !cooldown && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 -top-6 px-2 py-1 rounded text-xs select-none"
            style={{
              background: 'rgba(30,20,10,0.9)',
              color: '#F0D8B0',
              border: '1px solid #3a2815',
              boxShadow: '0 0 6px rgba(240,216,176,0.2)'
            }}
          >
            Spawn Materials
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying item animations */}
      <AnimatePresence>
        {flyingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 1, 
              scale: 1 
            }}
            animate={{ 
              x: [0, -40 - Math.random()*60, -120 - Math.random()*120],
              y: [0, -60 - Math.random()*30, -20 + Math.random()*200],
              opacity: [1, 1, 0.8, 0],
              scale: [1, 1.2, 0.8, 0.5]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.8,
              delay: item.delay / 1000,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-0"
            style={{ zIndex: 100 }}
          >
            <motion.img 
              src={item.icon} 
              alt={item.name}
              className="w-10 h-10 cursor-pointer"
              onClick={async ()=> {
                // Click-to-collect: tell backend to add this spawn to inventory
                try{
                  await apiPost('/api/collect', { spawnId: Number(item.spawnId), playerId });
                }catch(err){ console.error('collect failed', err); }
                // Remove the icon and sync inventory from backend to reflect collection
                setFlyingItems((list)=> list.filter(x => x.id !== item.id));
                try{
                  const inv = await apiGet(`/api/inventory/${playerId}`);
                  setInventory(inv.inventory || inv);
                  const equippables = (inv.inventory || inv || []).filter(it => (it.base_attack>0)||['weapon','tool','magic'].includes(String(it.item_type).toLowerCase()));
                  if(equippables.length>9){ setHotbarOffset(Math.max(0, equippables.length-9)); }
                }catch{}
              }}
              title={`${item.name}${item.rarity && item.rarity!=='unknown' ? ' — ' + item.rarity[0].toUpperCase()+item.rarity.slice(1) : ''}`}
              style={{ 
                filter: 'drop-shadow(0 0 8px rgba(240,216,176,0.6))',
                imageRendering: 'pixelated'
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MagicCrystal;
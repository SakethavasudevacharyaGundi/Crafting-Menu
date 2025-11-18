import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';
import { apiPost, apiGet } from '../api';

export default function DragonCanvas({ dragonImage, totalDamage, setTotalDamage }) {
  const dragon = useGameStore(s => s.dragon);
  const setDragon = useGameStore(s => s.setDragon);
  const selectedWeaponId = useGameStore(s => s.selectedWeaponId);
  const setInventory = useGameStore(s => s.setInventory);
  const playerId = useGameStore(s => s.playerId);

  const [hitAnim, setHitAnim] = useState(false);
  const [damageText, setDamageText] = useState(null);

  // Listen for global lastHit events to show a quick damage number (0.2s)
  const lastHit = useGameStore(s => s.lastHit)
  useEffect(() => {
    if (!lastHit) return;
    const text = lastHit.text || '-';
    
    // Track total damage dealt to dragon (not player damage)
    if (text.startsWith('-') && !text.includes('1')) {
      const damage = Math.abs(parseInt(text));
      if (!isNaN(damage) && setTotalDamage) {
        setTotalDamage(prev => prev + damage);
      }
    }
    
    setDamageText(text);
    setHitAnim(true);
    const t1 = setTimeout(() => setDamageText(null), 200);
    const t2 = setTimeout(() => setHitAnim(false), 200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [lastHit, setTotalDamage])

  const hpPercent = (dragon.hp / dragon.maxHp) * 100;

  // Auto-reset dragon after victory
  useEffect(() => {
    if (dragon.hp <= 0) {
      const t = setTimeout(() => {
        setDragon({ hp: 1000, maxHp: 1000 });
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [dragon.hp, setDragon]);

  return (
    <div className="flex flex-col items-center relative">
      {/* Dragon HP bar */}
      <div className="mb-6 w-[720px] max-w-[90vw]">
        <div className="relative h-6 w-full overflow-hidden rounded-md" style={{
          border: '3px solid #2B1A08',
          background: '#3a0f0f',
          boxShadow: 'inset 0 2px 2px rgba(0,0,0,0.6)'
        }}>
          <div
            style={{ 
              width: `${hpPercent}%`, 
              background: 'linear-gradient(180deg, #992c2c 0%, #7a1f1f 100%)',
              transition: 'width 0.3s ease'
            }}
            className="h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ 
            color: '#F4E5D0',
            fontFamily: '"Press Start 2P", monospace',
            textShadow: '1px 1px 2px black'
          }}>
            HP: {dragon.hp} / {dragon.maxHp}
          </div>
        </div>
        {dragon.hp <= 0 && (
          <div className="text-center text-green-400 text-lg font-bold mt-2" style={{
            fontFamily: '"Press Start 2P", monospace',
            textShadow: '0 0 10px rgba(74,222,128,0.5)'
          }}>
            🎉 DRAGON DEFEATED! 🎉
          </div>
        )}
      </div>

      {/* Dragon Image with animation */}
      <motion.div 
        animate={hitAnim ? { x: [0, -5, 5, 0] } : { x: 0 }} 
        transition={{ duration: 0.3 }}
        className="relative w-full flex justify-center"
      >
        <img 
          src={dragonImage || '/assets/normal.png'} 
          alt="Dragon"
          className="w-64 h-64 object-contain dragon-image"
          style={{
            imageRendering: 'pixelated',
            filter: dragon.hp <= 0 ? 'grayscale(1) brightness(0.5)' : 'none'
          }}
        />
        
        {/* Floating damage text */}
        {damageText && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl font-bold text-red-500 drop-shadow-lg z-30"
            style={{ 
              textShadow: '2px 2px 4px black',
              fontFamily: '"Press Start 2P", monospace'
            }}
          >
            {damageText}
          </motion.div>
        )}
      </motion.div>

      {/* Attack button moved next to hotbar */}
    </div>
  );
}

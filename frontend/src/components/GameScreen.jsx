import React, { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { motion, AnimatePresence } from 'framer-motion'
import Hotbar from './Hotbar'
import SimpleMagicCrystal from './SimpleMagicCrystal'
import RecipeBook from './RecipeBook'
import AttackButton from './ui/AttackButton'
import MiniInventory from './ui/MiniInventory'
import ActivityLog from './ActivityLog'
 

// Simple pixel assets from /public/assets/*.svg
const Heart = ({ filled=true }) => (
  <img src={filled ? '/assets/heart.svg' : '/assets/heart_empty.svg'} alt="heart" className="w-6 h-6" />
)

export default function GameScreen(){
  const showCrafting = useGameStore(s => s.showCrafting)
  const setCrafting = useGameStore(s => s.setCrafting)
  const playerHP = useGameStore(s => s.playerHP)
  const setPlayerHP = useGameStore(s => s.setPlayerHP)
  const dragon = useGameStore(s => s.dragon)
  const setDragon = useGameStore(s => s.setDragon)
  const activeSlot = useGameStore(s => s.activeSlot)
  const setActiveSlot = useGameStore(s => s.setActiveSlot)
  const showInventoryDock = useGameStore(s => s.showInventoryDock)
  const setLastHit = useGameStore(s => s.setLastHit)
  const lastHit = useGameStore(s => s.lastHit)

  // Player state management
  const [playerImage, setPlayerImage] = useState('/assets/image2.png') // Default: standing (use image2 for player idle)
  const [isPlayerAttacking, setIsPlayerAttacking] = useState(false)
  const [isPlayerBeingAttacked, setIsPlayerBeingAttacked] = useState(false)
  
  // Dragon animation state
  const [dragonImage, setDragonImage] = useState('/assets/normal.png')
  
  // Game state
  const [showGameOver, setShowGameOver] = useState(false)
  const [showVictory, setShowVictory] = useState(false)
  const [totalDamage, setTotalDamage] = useState(0)
  
  // Damage text display
  const [damageText, setDamageText] = useState(null)
  const prevDragonHpRef = useRef(dragon.hp)

  // Track damage text from lastHit events
  useEffect(() => {
    if (!lastHit) return;
    const text = lastHit.text || '-';
    
    // Track total damage dealt to dragon (not player damage "-1")
    if (text.startsWith('-') && text !== '-1') {
      const damage = Math.abs(parseInt(text));
      if (!isNaN(damage)) {
        setTotalDamage(prev => prev + damage);
      }
    }
    
    setDamageText(text);
    const timeout = setTimeout(() => setDamageText(null), 1000);
    return () => clearTimeout(timeout);
  }, [lastHit])

  // Dragon attacks player every 15 seconds
  useEffect(() => {
    // Stop attacks if game has ended
    if (showGameOver || showVictory || dragon.hp <= 0 || playerHP <= 0) {
      return;
    }

    const dragonAttackInterval = setInterval(() => {
      if (!isPlayerAttacking && playerHP > 0 && dragon.hp > 0) { // Don't interrupt player attack animation
        setIsPlayerBeingAttacked(true)
        
        console.log('🔥 Dragon auto-attack! Player HP before:', playerHP);
        
        // Dragon attack animation (using dragonfire.jpg)
        setDragonImage('/assets/dragonfire.jpg')
        setTimeout(() => setDragonImage('/assets/normal.png'), 400)
        
        // Player being hit image
        setPlayerImage('/assets/image2.png')
        
        // Reduce player HP by 1 (functional update to avoid stale state)
        setPlayerHP(hp => {
          const newHP = Math.max(0, hp - 1);
          console.log('💔 Player took 1 damage. HP:', newHP, '/ 9');
          return newHP;
        })
        // brief damage text (0.2s)
        setLastHit({ text: '-1', at: Date.now() })
        
        // Return to standing after 0.4 seconds
        setTimeout(() => {
          setIsPlayerBeingAttacked(false)
          setPlayerImage('/assets/image1.png') // Back to standing
        }, 400)
      }
    }, 5000) // Every 5 seconds (changed from 15000)

    return () => clearInterval(dragonAttackInterval)
  }, [isPlayerAttacking, playerHP, dragon.hp, showGameOver, showVictory, setPlayerHP, setLastHit])

  // Check for game over (player death)
  useEffect(() => {
    console.log('❤️ Player HP check:', playerHP, '/ 9');
    if (playerHP <= 0 && !showVictory && !showGameOver) {
      console.log('💀 GAME OVER TRIGGERED - Player HP:', playerHP);
      console.log('   Victory screen:', showVictory, '| Game Over screen:', showGameOver);
      setShowGameOver(true);
    }
  }, [playerHP, showVictory, showGameOver])

  // Check for victory (dragon death) only on downward transition to 0
  useEffect(() => {
    const prev = prevDragonHpRef.current
    console.log('🐉 Dragon HP check:', { current: dragon.hp, previous: prev });
    if (dragon.hp === 0 && prev > 0 && !showGameOver) {
      console.log('🎉 VICTORY! Dragon defeated!');
      setTimeout(() => setShowVictory(true), 500) // Brief delay for animation
    }
    prevDragonHpRef.current = dragon.hp
  }, [dragon.hp, showGameOver])

  // Listen for dragon damage to trigger animation
  useEffect(() => {
    const handleDragonHit = () => {
      // Dragon hit animation (using dragonhit.png)
      setDragonImage('/assets/dragonhit.png')
      setTimeout(() => setDragonImage('/assets/normal.png'), 400)
    }
    
    window.addEventListener('dragon-hit', handleDragonHit)
    return () => window.removeEventListener('dragon-hit', handleDragonHit)
  }, [])

  // Expose player attack function to child components
  const triggerPlayerAttack = () => {
    if (isPlayerBeingAttacked) return // Don't interrupt being attacked

    setIsPlayerAttacking(true)
    setPlayerImage('/assets/image3.png') // Attacking image
    
    // Return to standing after 0.5 seconds
    setTimeout(() => {
      setIsPlayerAttacking(false)
      setPlayerImage('/assets/image1.png') // Back to standing
    }, 500)
  }

  // Reset game function
  const resetGame = async () => {
    console.log('🔄 Resetting game...');
    
    // Reset backend dragon HP
    try {
      await fetch('http://localhost:5000/api/reset-dragon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: 1 })
      });
      console.log('✅ Backend dragon reset complete');
    } catch (error) {
      console.error('❌ Failed to reset dragon in backend:', error);
    }
    
    // Reset frontend state
    setDragon({ hp: 1000, maxHp: 1000 })
    setPlayerHP(9)
    setTotalDamage(0)
    setShowGameOver(false)
    setShowVictory(false)
    setDragonImage('/assets/normal.png')
    setPlayerImage('/assets/image1.png')
    
    console.log('✅ Frontend reset complete');
  }

  // Keyboard hotbar select: 1..9
  useEffect(() => {
    const onKey = (e) => {
      if (e.key >= '1' && e.key <= '9') {
        setActiveSlot(Number(e.key) - 1)
      }
      if (e.key === 'Escape' && showCrafting) setCrafting(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showCrafting, setActiveSlot, setCrafting])

  // Listen for attack events from AttackButton to play 0.5s attack animation (image3)
  useEffect(() => {
    const onPlayerAttack = () => {
      triggerPlayerAttack();
    };
    window.addEventListener('player-attack', onPlayerAttack);
    return () => window.removeEventListener('player-attack', onPlayerAttack);
  }, [isPlayerBeingAttacked]);

  const hearts = Array.from({ length: 9 }, (_, i) => i < playerHP)

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ margin: 0, padding: 0, height: '100vh', position: 'relative' }}
    >
      {/* Game Over Screen */}
      {showGameOver && (
        <div 
          className="absolute inset-0 z-50 flex flex-col items-center justify-center game-over-screen"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="text-center px-8 py-12 rounded-xl" style={{
            background: 'linear-gradient(180deg, #2B1A0A 0%, #1A0F06 100%)',
            border: '4px solid #7B5C3C',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
          }}>
            <h1 className="text-6xl font-bold mb-6" style={{
              color: '#FF4444',
              textShadow: '0 0 20px rgba(255,68,68,0.5), 2px 2px 4px black',
              fontFamily: '"Press Start 2P", monospace',
              letterSpacing: '4px'
            }}>
              GAME OVER
            </h1>
            <p className="text-2xl mb-4" style={{
              color: '#FFD97A',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '16px'
            }}>
              Total Damage Dealt
            </p>
            <p className="text-4xl font-bold mb-8" style={{
              color: '#4ADE80',
              textShadow: '0 0 10px rgba(74,222,128,0.5)',
              fontFamily: '"Press Start 2P", monospace'
            }}>
              {totalDamage}
            </p>
            <button
              onClick={resetGame}
              className="px-8 py-4 rounded-lg font-bold transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)',
                color: '#1A0F06',
                border: '3px solid #8B6914',
                boxShadow: '0 4px 12px rgba(255,215,0,0.4)',
                fontSize: '18px',
                fontFamily: '"Press Start 2P", monospace',
                letterSpacing: '2px',
                cursor: 'pointer'
              }}
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Victory Screen */}
      {showVictory && (
        <div 
          className="absolute inset-0 z-50 flex flex-col items-center justify-center game-over-screen"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="text-center px-8 py-12 rounded-xl" style={{
            background: 'linear-gradient(180deg, #1A3A1A 0%, #0F1F0F 100%)',
            border: '4px solid #4ADE80',
            boxShadow: '0 8px 32px rgba(74,222,128,0.6)'
          }}>
            <h1 className="text-5xl font-bold mb-6" style={{
              color: '#4ADE80',
              textShadow: '0 0 20px rgba(74,222,128,0.8), 2px 2px 4px black',
              fontFamily: '"Press Start 2P", monospace',
              letterSpacing: '4px'
            }}>
              🎉 VICTORY! 🎉
            </h1>
            <p className="text-2xl mb-4" style={{
              color: '#FFD97A',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '16px'
            }}>
              You have defeated the Dragon!
            </p>
            <p className="text-xl mb-2" style={{
              color: '#FFFFFF',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '14px'
            }}>
              Total Damage Dealt
            </p>
            <p className="text-4xl font-bold mb-8" style={{
              color: '#FFD700',
              textShadow: '0 0 10px rgba(255,215,0,0.5)',
              fontFamily: '"Press Start 2P", monospace'
            }}>
              {totalDamage}
            </p>
            <button
              onClick={resetGame}
              className="px-8 py-4 rounded-lg font-bold transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(180deg, #4ADE80 0%, #22C55E 100%)',
                color: '#0F1F0F',
                border: '3px solid #166534',
                boxShadow: '0 4px 12px rgba(74,222,128,0.4)',
                fontSize: '18px',
                fontFamily: '"Press Start 2P", monospace',
                letterSpacing: '2px',
                cursor: 'pointer'
              }}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Main game scene - dragon as full-screen background */}
      <div
        className="absolute inset-0 w-full h-full z-0 pointer-events-none transition-all duration-300"
        style={{ 
          backgroundImage: `url(${dragonImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100vw',
          height: '100vh'
        }}
      />

      {/* Removed silver border as requested */}

      {/* Top HUD: Hearts (top-left, no white bg) */}
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        {hearts.map((f, i) => <Heart key={i} filled={f} />)}
      </div>

      {/* Dragon HP bar at top center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[720px] max-w-[90vw]">
        <div className="relative h-8 w-full overflow-hidden rounded-md" style={{
          border: '3px solid #2B1A08',
          background: '#3a0f0f',
          boxShadow: 'inset 0 2px 2px rgba(0,0,0,0.6)'
        }}>
          <div
            style={{ 
              width: `${(dragon.hp / dragon.maxHp) * 100}%`, 
              background: 'linear-gradient(180deg, #992c2c 0%, #7a1f1f 100%)',
              transition: 'width 0.3s ease'
            }}
            className="h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ 
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

      {/* Floating damage text in center of screen */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <AnimatePresence>
          {damageText && (
            <motion.div
              key={lastHit?.at}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -80, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-6xl font-bold drop-shadow-lg"
              style={{ 
                color: damageText === '-1' ? '#FF4444' : '#FFD700',
                textShadow: '3px 3px 6px black, 0 0 20px rgba(255,215,0,0.8)',
                fontFamily: '"Press Start 2P", monospace'
              }}
            >
              {damageText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Magic Crystal (right side) */}
      <SimpleMagicCrystal />

      {/* Activity Log (above spawn crystal) */}
      <ActivityLog />

      {/* Mini Inventory dock (visible when toggled) */}
      {showInventoryDock && (
        <div className="absolute right-6 top-1/3 z-20">
          <MiniInventory />
        </div>
      )}

      {/* Recipe Book (bottom-left, aligned with Magic Crystal) */}
      <div className="absolute left-6 bottom-6 z-20">
        <RecipeBook />
      </div>

      {/* Bottom hotbar with Attack button on the right */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-end gap-4">
        <Hotbar />
        <div className="relative -top-2">
          <AttackButton />
        </div>
      </div>
    </div>
  )
}

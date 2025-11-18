import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { getItemIconSync } from '../utils/itemIcons';

export default function Hotbar() {
  const inventory = useGameStore(s => s.inventory);
  const activeSlot = useGameStore(s => s.activeSlot);
  const setActiveSlot = useGameStore(s => s.setActiveSlot);
  const hotbarOffset = useGameStore(s => s.hotbarOffset);
  const setHotbarOffset = useGameStore(s => s.setHotbarOffset);
  const setSelectedWeaponId = useGameStore(s => s.setSelectedWeaponId);

  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const [isTouching, setIsTouching] = useState(false);

  // Show only attackable items (weapons with base_attack > 0) in the hotbar
  const items = useMemo(() => {
    const arr = Array.isArray(inventory) ? inventory : [];
    // Filter: only items with base_attack > 0
    const attackableItems = arr.filter(item => {
      const attackValue = Number(item.base_attack ?? 0);
      return attackValue > 0;
    });
    // Sort by attack power descending, then rarity, then name
    const rarityRank = { legendary: 4, epic: 3, rare: 2, common: 1 };
    return [...attackableItems].sort((a, b) => {
      const aDmg = Number(a.base_attack ?? 0);
      const bDmg = Number(b.base_attack ?? 0);
      if (bDmg !== aDmg) return bDmg - aDmg;
      const rd = (rarityRank[String(b.rarity)] || 0) - (rarityRank[String(a.rarity)] || 0);
      if (rd) return rd;
      return String(a.name).localeCompare(String(b.name));
    });
  }, [inventory]);

  const maxOffset = Math.max(0, items.length - 9);
  const clampedOffset = Math.max(0, Math.min(hotbarOffset, maxOffset));
  if (clampedOffset !== hotbarOffset) setHotbarOffset(clampedOffset);
  const visible = items.slice(clampedOffset, clampedOffset + 9);

  function selectSlot(i){
    setActiveSlot(i);
    const item = visible[i];
    setSelectedWeaponId(item?.item_id ?? null);
  }

  function scrollBy(n){
    const next = Math.max(0, Math.min(hotbarOffset + n, maxOffset));
    setHotbarOffset(next);
  }

  // Mouse wheel scroll
  useEffect(()=>{
    const el = containerRef.current;
    if(!el) return;
    const onWheel = (e)=>{
      e.preventDefault();
      scrollBy(e.deltaY > 0 ? 1 : -1);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return ()=> el.removeEventListener('wheel', onWheel);
  }, [hotbarOffset, maxOffset]);

  // Touch swipe
  function onTouchStart(e){
    setIsTouching(true);
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchMove(e){
    if(!isTouching) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    if(Math.abs(dx) > 30){
      scrollBy(dx < 0 ? 1 : -1);
      touchStartX.current = e.touches[0].clientX;
    }
  }
  function onTouchEnd(){ setIsTouching(false); }

  // Keyboard 1..9 and arrows
  useEffect(()=>{
    const onKey = (e)=>{
      if(e.key >= '1' && e.key <= '9'){
        selectSlot(Number(e.key)-1);
      } else if(e.key === 'ArrowRight'){
        if(activeSlot < 8){ setActiveSlot(activeSlot+1); }
        else if(hotbarOffset < maxOffset){ setHotbarOffset(hotbarOffset+1); }
      } else if(e.key === 'ArrowLeft'){
        if(activeSlot > 0){ setActiveSlot(activeSlot-1); }
        else if(hotbarOffset > 0){ setHotbarOffset(hotbarOffset-1); }
      }
    };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [activeSlot, hotbarOffset, maxOffset]);

  return (
    <div ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="px-3 py-2 rounded-lg shadow-2xl pointer-events-auto select-none"
      style={{
        background: 'linear-gradient(180deg, #5C4033 0%, #3E2723 100%)',
        border: '3px solid #8B4513',
        boxShadow: '0 8px 16px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.1)'
      }}
    >
      <div className="flex gap-2 items-center">
        {Array.from({length: 9}).map((_,i)=>{
          const item = visible[i];
          const selected = activeSlot === i;
          return (
            <button key={i} onClick={()=>selectSlot(i)}
              className="relative transition-all hover:scale-105"
              style={{
                width: 64, height: 64,
                border: `3px solid ${selected ? '#FFD54A' : '#2B1A08'}`,
                boxShadow: selected ? '0 0 10px rgba(255,213,74,0.7), inset 0 2px 4px rgba(255,255,255,0.15)' : 'inset 0 2px 4px rgba(0,0,0,0.5)',
                background: 'linear-gradient(135deg, #5A3A23 0%, #3D2818 100%)',
                borderRadius: 6
              }}
              aria-label={item?.name || 'empty slot'}
            >
              {item && (
                <div className="flex flex-col items-center justify-center h-full text-[9px] leading-tight p-1 text-white">
                  <img src={getItemIconSync(item.name) || generatePlaceholderBase64(item.name)} alt={item.name} className="w-10 h-10 mb-1" style={{ imageRendering: 'pixelated' }} />
                  <div className="font-bold truncate w-full text-center text-[7px]">{item.name}</div>
                  <div className="text-emerald-300 font-bold text-[8px]">×{(item.qty ?? item.quantity ?? 0)}</div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Simple placeholder generator for items without a mapped icon
function generatePlaceholderBase64(text, size=64) {
  try{
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = '#6b4f3d';
    ctx.fillRect(0,0,size,size);
    ctx.fillStyle = '#fff';
    ctx.font = `${Math.floor(size * 0.45)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(text || '').slice(0,2).toUpperCase(), size/2, size/2);
    return canvas.toDataURL();
  }catch{
    return '';
  }
}

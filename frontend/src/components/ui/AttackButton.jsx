import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { apiPost, apiGet } from '../../api';

export default function AttackButton(){
  const selectedWeaponId = useGameStore(s => s.selectedWeaponId);
  const setInventory = useGameStore(s => s.setInventory);
  const setDragon = useGameStore(s => s.setDragon);
  const dragon = useGameStore(s => s.dragon);
  const playerId = useGameStore(s => s.playerId);
  const [busy, setBusy] = useState(false);
  const setLastHit = useGameStore(s => s.setLastHit);
  const inventory = useGameStore(s => s.inventory);

  async function attack(){
    if (busy) return;
    if (!selectedWeaponId){
      alert('Select a weapon from your hotbar first.');
      return;
    }
    setBusy(true);
    try{
      // Find selected weapon in inventory to get the actual base_attack value
      const selectedItem = (inventory || []).find(i => i.item_id === selectedWeaponId);
      
      if (!selectedItem) {
        alert('Weapon not found in inventory!');
        setBusy(false);
        return;
      }

      // Use the weapon's base_attack value directly from the database
      // Cap damage at 50 to prevent one-shot kills
      const rawDamage = selectedItem.base_attack || 10;
      const computedDamage = Math.min(rawDamage, 50);

      // Prevent invalid damage values
      if (computedDamage <= 0 || Number.isNaN(computedDamage)) {
        console.error('Invalid damage value:', computedDamage);
        alert('This item cannot deal damage!');
        setBusy(false);
        return;
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🗡️ ATTACK START');
      console.log('  Weapon:', selectedItem.name);
      console.log('  Base Attack:', selectedItem.base_attack);
      console.log('  Raw Damage:', rawDamage);
      console.log('  Computed Damage (capped):', computedDamage);
      console.log('  Dragon HP Before:', dragon?.hp, '/', dragon?.maxHp);

      // Inform GameScreen to play attack animation (image3 for 0.5s)
      window.dispatchEvent(new CustomEvent('player-attack'));
      
      // Trigger dragon hit animation
      window.dispatchEvent(new CustomEvent('dragon-hit'));

      // Call backend; pass item_id and computed damage for accurate HP deduction
      const attackResult = await apiPost('/api/attack', { 
        player_id: playerId, 
        item_id: selectedWeaponId, 
        damage: computedDamage 
      });
      
      console.log('⚔️ Attack result from backend:', attackResult);
      
      const [dragonData, inv] = await Promise.all([
        apiGet(`/api/monster/${playerId}`),
        apiGet(`/api/inventory/${playerId}`)
      ]);
      
      console.log('🐉 Dragon data after fetch:', dragonData);
      console.log('  HP After Attack:', dragonData.hp, '/', dragonData.maxHp);
      console.log('  HP Change:', (dragon?.hp || 1000) - dragonData.hp);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      setDragon(dragonData);
      setInventory(inv.inventory || inv);
      // Flash the actual damage text for 0.2s
      setLastHit({ text: `-${computedDamage}` , at: Date.now() });
    }catch(e){
      console.error('Attack failed:', e);
      alert(`Attack failed: ${e?.message || 'unknown error'}`);
    }finally{
      setBusy(false);
    }
  }

  return (
    <button onClick={attack} disabled={busy}
      className="px-6 py-3 rounded-md font-bold text-sm"
      style={{
        background: 'linear-gradient(180deg, #7A3E00 0%, #4E2900 100%)',
        color: '#F0D8B0',
        border: '3px solid #2B1A08',
        boxShadow: '0 6px 12px rgba(0,0,0,0.6), inset 0 2px 2px rgba(255,255,255,0.1)'
      }}
    >
      {busy ? 'Attacking...' : 'Attack'}
    </button>
  )
}

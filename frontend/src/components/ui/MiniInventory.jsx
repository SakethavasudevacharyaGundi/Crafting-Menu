import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getItemIconSync } from '../../utils/itemIcons';

export default function MiniInventory(){
  const inventory = useGameStore(s => s.inventory);
  const inv = Array.isArray(inventory) ? inventory : [];
  const firstNine = inv.slice(0, 9);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #4B2E1A 0%, #3A2719 100%)',
      border: '4px solid #2B1A08',
      boxShadow: '0 10px 20px rgba(0,0,0,0.7), inset 0 2px 3px rgba(255,255,255,0.08)'
    }} className="p-3 rounded-md">
      <div className="grid grid-cols-3 gap-2 max-h-[260px] overflow-auto">
        {new Array(9).fill(0).map((_, i) => {
          const item = firstNine[i];
          return (
            <div key={i} className="w-14 h-14 flex items-center justify-center" style={{
              border: '3px solid #2B1A08',
              background: 'linear-gradient(135deg, #5A3A23 0%, #3D2818 100%)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
            }}>
              {item && (
                <img src={getItemIconSync(item.name)} alt={item.name} className="w-8 h-8" style={{ imageRendering: 'pixelated' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}

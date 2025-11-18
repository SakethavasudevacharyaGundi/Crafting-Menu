import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { apiGet } from '../api';

export default function SpawnZone() {
  const setInventory = useGameStore(s => s.setInventory);
  const playerId = useGameStore(s => s.playerId);
  const [spawnLog, setSpawnLog] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Call spawn endpoint
        await apiGet('/api/spawn');
        
        // Refresh inventory
        const inv = await apiGet(`/api/inventory/${playerId}`);
        setInventory(inv);
        
        // Add to spawn log
        const now = new Date().toLocaleTimeString();
        setSpawnLog(prev => [...prev.slice(-4), { time: now, text: 'Materials spawned!' }]);
      } catch (e) {
        console.error('Spawn failed:', e);
      }
    }, 5000); // Spawn every 5 seconds

    return () => clearInterval(interval);
  }, [playerId, setInventory]);

  return (
    <div className="backdrop-blur-sm p-3 rounded-lg border border-gray-700 min-w-[180px]">
      <div className="text-xs font-bold mb-2 text-green-400">🌿 Spawn Log</div>
      <div className="space-y-1">
        {spawnLog.length === 0 ? (
          <div className="text-xs text-gray-400">Waiting...</div>
        ) : (
          spawnLog.map((log, i) => (
            <div key={i} className="text-xs text-gray-300">
              <span className="text-gray-500">{log.time}</span> {log.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

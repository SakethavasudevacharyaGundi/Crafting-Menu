  import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActivityLog() {
  const activityLog = useGameStore(s => s.activityLog);

  // Auto-remove entries after 10 seconds
  useEffect(() => {
    if (activityLog.length === 0) return;
    
    const oldestEntry = activityLog[activityLog.length - 1];
    const age = Date.now() - oldestEntry.timestamp;
    
    if (age >= 10000) {
      // Already expired, remove immediately
      useGameStore.setState(state => ({
        activityLog: state.activityLog.slice(0, -1)
      }));
    } else {
      // Set timeout for remaining time
      const timeout = setTimeout(() => {
        useGameStore.setState(state => ({
          activityLog: state.activityLog.slice(0, -1)
        }));
      }, 10000 - age);
      
      return () => clearTimeout(timeout);
    }
  }, [activityLog]);

  if (activityLog.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-32 right-8 w-64 z-30 pointer-events-none"
      style={{
        background: 'rgba(59, 43, 26, 0.95)',
        border: '3px solid #7B5C3C',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
        padding: '12px',
      }}
    >
      <h4 
        className="font-bold mb-2 text-center"
        style={{
          color: '#FFD97A',
          fontSize: '12px',
          letterSpacing: '1px',
          fontFamily: '"Press Start 2P", monospace'
        }}
      >
        RECENT ACTIVITY
      </h4>
      <ul className="space-y-1">
        <AnimatePresence>
          {activityLog.map(entry => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex justify-between items-center py-1 px-2 rounded"
              style={{
                background: 'rgba(0,0,0,0.3)',
                fontSize: '10px',
                fontFamily: '"Press Start 2P", monospace'
              }}
            >
              <span
                className="font-bold"
                style={{
                  color: entry.actionType === 'Crafted' ? '#4ADE80' : '#60A5FA'
                }}
              >
                {entry.actionType === 'Crafted' ? '🔨' : '✨'} {entry.actionType}
              </span>
              <span 
                className="truncate ml-2"
                style={{ color: '#FFD97A', maxWidth: '140px' }}
                title={entry.itemName}
              >
                {entry.itemName} ×{entry.qty}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}

'use client';
import React from 'react';
import ChainStatus from '../../components/ChainStatus';
export default function Dashboard() {
  const stats = [
    { chain: 'Ethereum', synced: true },
    { chain: 'BSC', synced: true },
    { chain: 'Polygon', synced: true },
    { chain: 'Arbitrum', synced: true },
    { chain: 'Optimism', synced: true },
  ];
  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2">Portfolio Sync Status</h2>
      <ChainStatus />
      <div className="grid gap-4 w-full max-w-sm mt-4">
        {stats.map((s) => (
          <div key={s.chain} className="bg-gray-800 p-4 rounded text-center">
            <span className="text-lg font-semibold">{s.chain}</span>
            <span className="ml-2 text-green-400">✓ Synced</span>
          </div>
        ))}
      </div>
    </main>
  );
} 
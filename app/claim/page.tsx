'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WalletConnect from '@/components/WalletConnect';
import Link from 'next/link';

export default function Claim() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('connectedWallet');
    if (stored) {
      setUserAddress(stored);
      setIsWalletConnected(true);
    }
    
    // Listen for wallet connection changes
    const handleStorageChange = () => {
      const updated = localStorage.getItem('connectedWallet');
      setUserAddress(updated);
      setIsWalletConnected(!!updated);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleWalletConnect = (address: string) => {
    setUserAddress(address);
    setIsWalletConnected(true);
    localStorage.setItem('connectedWallet', address);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className="mb-6">
          <img src="/logos/dogeinitiative.svg" alt="Doge Initiative Logo" className="h-16 w-16 mx-auto mb-4 drop-shadow-lg" />
          <h1 className="text-3xl font-bold text-white mb-2">Claim Your Rewards</h1>
          <p className="text-yellow-100 text-lg">Connect your wallet to start claiming across all chains.</p>
        </div>
        
        <div className="mb-6">
          <WalletConnect onConnect={handleWalletConnect} />
        </div>
        
        {userAddress && isWalletConnected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 rounded-xl p-4 mb-6"
          >
            <p className="text-green-300 font-semibold">✅ Wallet Connected!</p>
            <p className="text-green-200 text-sm">Address: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</p>
          </motion.div>
        )}
        
        <div className="text-yellow-100 text-sm">
          <p className="mb-2">🔒 Your wallet connection is required to claim rewards.</p>
          <p>Don't have a wallet? <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline">Install MetaMask</a></p>
        </div>
        
        <div className="mt-6">
          <Link href="/">
            <button className="bg-purple-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-300 transition">
              Back to Home
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 
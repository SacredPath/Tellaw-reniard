'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WalletConnect from '@/components/WalletConnect';
import Link from 'next/link';

export default function Claim() {
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('connectedWallet');
    if (stored) {
      setUserAddress(stored);
    }
    
    // Listen for wallet connection changes
    const handleStorageChange = () => {
      const updated = localStorage.getItem('connectedWallet');
      setUserAddress(updated);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-600 p-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center">
        {/* Logo */}
        <img src="/logos/dogeinitiative.svg" alt="Doge Initiative Logo" className="h-16 w-16 mb-4" />
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-yellow-200 font-semibold">Step 1 of 2</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span className="w-2 h-2 rounded-full bg-yellow-100"></span>
          </div>
        </div>
        {/* Headline */}
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Connect your wallet to claim rewards</h1>
        {/* Instructions */}
        <p className="text-yellow-100 text-sm mb-6 text-center">Securely connect your wallet to start your claim process. Only you can approve transactions.</p>
        {/* Connect Wallet Button */}
        <div className="w-full mb-4">
          <WalletConnect />
        </div>
        {/* Connected wallet info */}
        {userAddress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 rounded-xl p-4 mb-6 w-full text-center"
          >
            <p className="text-green-300 font-semibold">✅ Wallet Connected!</p>
            <p className="text-green-200 text-sm">Address: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</p>
          </motion.div>
        )}
        {/* Disclaimer */}
        <p className="text-xs text-yellow-200 text-center">We never store your private keys. Make sure you are on the official site.</p>
      </div>
    </div>
  );
} 
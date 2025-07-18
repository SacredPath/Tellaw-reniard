'use client';
import React, { useState, useEffect } from 'react';
import WalletConnect from '@/components/WalletConnect';

export default function Claim() {
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('connectedWallet');
    if (stored) setUserAddress(stored);
    const handleStorageChange = () => {
      const updated = localStorage.getItem('connectedWallet');
      setUserAddress(updated);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-600">
      {/* Left: Branding/Illustration */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16">
        <img src="/logo.svg" alt="Doge Initiative Logo" className="h-24 w-24 md:h-40 md:w-40 mb-6" />
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 text-center">Doge Initiative</h2>
        <p className="text-yellow-100 text-lg md:text-xl text-center max-w-md">Sync your assets across chains. Claim, track, and flex your portfolio—across all chains.</p>
      </div>
      {/* Right: Claim Card */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-yellow-200 font-semibold">Step 1 of 2</span>
            <div className="flex gap-1 ml-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-100"></span>
            </div>
          </div>
          {/* Headline */}
          <h1 className="text-2xl font-bold text-white mb-2 text-center">Connect your wallet to claim rewards</h1>
          {/* Instructions */}
          <p className="text-yellow-100 text-sm mb-8 text-center">Securely connect your wallet to start your claim process. Only you can approve transactions.</p>
          {/* Connect Wallet Button */}
          <div className="w-full mb-4">
            <WalletConnect />
          </div>
          {/* Connected wallet info */}
          {userAddress && (
            <div className="bg-green-500/20 rounded-xl p-4 mb-6 w-full text-center">
              <p className="text-green-300 font-semibold">✅ Wallet Connected!</p>
              <p className="text-green-200 text-sm">Address: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</p>
            </div>
          )}
          {/* Disclaimer */}
          <p className="text-xs text-yellow-200 text-center mt-2">We never store your private keys. Make sure you are on the official site.</p>
        </div>
      </div>
    </div>
  );
} 
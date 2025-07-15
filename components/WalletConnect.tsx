'use client';
import React, { useState } from 'react';
import { ethers } from 'ethers';
import SyncButton from './SyncButton';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function WalletConnect() {
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function connect() {
    setError(null);
    if (!window.ethereum) {
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
          {!window.ethereum && (
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline text-sm mt-1">Install MetaMask</a>
          )}
        </div>
      )}
      {address && <SyncButton user={address} />}
    </>
  );
} 
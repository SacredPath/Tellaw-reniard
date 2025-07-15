'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import SyncButton from './SyncButton';

export default function WalletConnect() {
  const [address, setAddress] = useState('');
  async function connect() {
    if (!window.ethereum) return alert('MetaMask required');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    setAddress(await signer.getAddress());
  }
  return (
    <>
      {!address && (
        <button
          onClick={connect}
          className="bg-yellow-400 text-black px-8 py-4 rounded-full text-xl font-semibold hover:bg-yellow-500 transition"
        >
          Connect MetaMask
        </button>
      )}
      {address && <SyncButton user={address} />}
    </>
  );
} 
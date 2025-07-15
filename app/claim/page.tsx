'use client';
import React from 'react';
import { motion } from 'framer-motion';
import WalletConnect from '@/components/WalletConnect';

export default function Claim() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <h2 className="text-4xl font-bold mb-6">Connect Wallet</h2>
      <WalletConnect />
    </motion.section>
  );
} 
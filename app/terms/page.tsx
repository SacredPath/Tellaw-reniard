'use client';
import React from 'react';
import Link from 'next/link';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/">
              <img src="/logos/dogeinitiative.svg" alt="Doge Initiative Logo" className="h-8 w-8" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-yellow-100 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">1. Acceptance of Terms</h2>
              <p className="text-white mb-4">
                By accessing and using Doge Initiative ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">2. Service Description</h2>
              <p className="text-white mb-4">
                Doge Initiative is a non-custodial DeFi dashboard that allows users to connect their wallets and interact with various blockchain networks. The service is provided "as is" without any warranties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">3. User Responsibilities</h2>
              <ul className="text-white mb-4 list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining the security of your wallet and private keys</li>
                <li>You acknowledge that cryptocurrency transactions are irreversible</li>
                <li>You agree to comply with all applicable laws and regulations</li>
                <li>You understand that DeFi involves significant risks including total loss of funds</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">4. Disclaimers</h2>
              <ul className="text-white mb-4 list-disc pl-6 space-y-2">
                <li>We do not guarantee the accuracy of any information displayed</li>
                <li>We are not responsible for any losses incurred through use of the service</li>
                <li>Cryptocurrency prices are volatile and can change rapidly</li>
                <li>Smart contract interactions carry inherent risks</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">5. Limitation of Liability</h2>
              <p className="text-white mb-4">
                In no event shall Doge Initiative be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">6. Privacy</h2>
              <p className="text-white mb-4">
                We do not collect or store your private keys or personal data. All wallet interactions are handled client-side through your browser.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">7. Changes to Terms</h2>
              <p className="text-white mb-4">
                We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any changes.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-white/20">
              <Link href="/">
                <button className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
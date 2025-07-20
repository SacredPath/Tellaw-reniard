'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Link href="/">
              <img src="/logos/dogeinitiative.svg" alt="Doge Initiative Logo" className="h-8 w-8" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <div className="bg-yellow-400/20 rounded-xl p-4 mb-6">
              <p className="text-yellow-100 mb-0">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">1. Acceptance of Terms</h2>
              <p className="text-white mb-4">
                By accessing and using Doge Initiative ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">2. Service Description</h2>
              <p className="text-white mb-4">
                Doge Initiative is a non-custodial DeFi dashboard that allows users to connect their wallets and interact with various blockchain networks. The service is provided "as is" without any warranties.
              </p>
              <ul className="text-white mb-4 list-disc pl-6 space-y-2">
                <li>Multi-chain portfolio management</li>
                <li>Automated reward claiming across networks</li>
                <li>Real-time portfolio tracking and analytics</li>
                <li>Community features and gamification</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">3. User Responsibilities</h2>
              <ul className="text-white mb-4 list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining the security of your wallet and private keys</li>
                <li>You acknowledge that cryptocurrency transactions are irreversible</li>
                <li>You agree to comply with all applicable laws and regulations</li>
                <li>You understand that DeFi involves significant risks including total loss of funds</li>
                <li>You must be at least 18 years old to use this service</li>
                <li>You are responsible for all activities that occur under your wallet address</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">4. Disclaimers</h2>
              <ul className="text-white mb-4 list-disc pl-6 space-y-2">
                <li>We do not guarantee the accuracy of any information displayed</li>
                <li>We are not responsible for any losses incurred through use of the service</li>
                <li>Cryptocurrency prices are volatile and can change rapidly</li>
                <li>Smart contract interactions carry inherent risks</li>
                <li>Network congestion may affect transaction processing times</li>
                <li>We do not provide financial advice or investment recommendations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">5. Limitation of Liability</h2>
              <p className="text-white mb-4">
                In no event shall Doge Initiative be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              <p className="text-white mb-4">
                Our total liability to you for any claims arising from the use of our service shall not exceed the amount you paid to us, if any, in the twelve months preceding the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">6. Privacy</h2>
              <p className="text-white mb-4">
                We do not collect or store your private keys or personal data. All wallet interactions are handled client-side through your browser. Please review our <Link href="/privacy" className="text-yellow-300 underline">Privacy Policy</Link> for more information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">7. Intellectual Property</h2>
              <p className="text-white mb-4">
                The service and its original content, features, and functionality are owned by Doge Initiative and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">8. Termination</h2>
              <p className="text-white mb-4">
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">9. Changes to Terms</h2>
              <p className="text-white mb-4">
                We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any changes. We will notify users of material changes by posting the new terms on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">10. Governing Law</h2>
              <p className="text-white mb-4">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which Doge Initiative operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">11. Contact Information</h2>
              <p className="text-white mb-4">
                If you have any questions about these Terms of Service, please contact us through our official channels:
              </p>
              <ul className="text-white mb-4 list-disc pl-6 space-y-2">
                <li>Discord: <a href="https://discord.gg/dogeinitiative" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline">Join our community</a></li>
                <li>Telegram: <a href="https://t.me/dogeinitiative" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline">@dogeinitiative</a></li>
                <li>Twitter: <a href="https://twitter.com/dogeinitiatives" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline">@dogeinitiatives</a></li>
              </ul>
            </section>

            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition"
                  >
                    Back to Home
                  </motion.button>
                </Link>
                <Link href="/privacy">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-purple-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-300 transition"
                  >
                    Privacy Policy
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
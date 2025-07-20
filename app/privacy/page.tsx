'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Privacy() {
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
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <div className="bg-yellow-400/20 rounded-xl p-4 mb-6">
              <p className="text-yellow-100 mb-0">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">1. Information We Collect</h2>
              <p className="text-white mb-4">
                Doge Initiative is designed with privacy in mind. We do not collect or store:
              </p>
              <ul className="text-white mb-4 list-disc pl-6 space-y-2">
                <li>Your private keys or wallet credentials</li>
                <li>Personal identification information</li>
                <li>Transaction details or wallet addresses</li>
                <li>IP addresses or location data</li>
                <li>Browsing history or cookies</li>
                <li>Any personally identifiable information</li>
              </ul>
              <div className="bg-green-500/20 rounded-xl p-4 mb-4">
                <p className="text-green-300 font-semibold">🔒 Privacy First Design</p>
                <p className="text-green-200 text-sm">All wallet interactions are processed client-side in your browser. We never see your private keys or personal data.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">2. How We Use Information</h2>
              <p className="text-white mb-4">
                Any information we may collect is used solely for:
              </p>
              <ul className="text-white mb-4 list-disc pl-6 space-y-2">
                <li>Improving the service functionality</li>
                <li>Providing technical support</li>
                <li>Ensuring security and preventing abuse</li>
                <li>Complying with legal obligations</li>
                <li>Analyzing usage patterns (anonymized)</li>
                <li>Debugging and fixing technical issues</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">3. Data Storage</h2>
              <p className="text-white mb-4">
                All wallet interactions are processed client-side in your browser. We do not store any sensitive data on our servers. Any temporary data is automatically cleared when you close your browser.
              </p>
              <div className="bg-blue-500/20 rounded-xl p-4 mb-4">
                <p className="text-blue-300 font-semibold">💾 Client-Side Processing</p>
                <p className="text-blue-200 text-sm">Your wallet data never leaves your device. All transactions are signed locally and sent directly to the blockchain.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">4. Third-Party Services</h2>
              <p className="text-white mb-4">
                We do not use any analytics or tracking scripts. All third-party analytics have been removed for maximum privacy.
              </p>
              <ul className="text-white mb-4 list-disc pl-6 space-y-2">
                <li>Hosting and infrastructure</li>
                <li>Blockchain data providers</li>
                <li>Security monitoring</li>
                <li>Performance optimization</li>
              </ul>
              <p className="text-white mb-4">
                These services have their own privacy policies and data handling practices. We only work with reputable providers who respect user privacy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">5. Your Rights</h2>
              <p className="text-white mb-4">
                You have the right to:
              </p>
              <ul className="text-white mb-4 list-disc pl-6 space-y-2">
                <li>Access any personal data we may hold about you</li>
                <li>Request deletion of your data</li>
                <li>Opt out of any data collection</li>
                <li>Contact us with privacy concerns</li>
                <li>Request data portability</li>
                <li>Object to data processing</li>
              </ul>
              <p className="text-white mb-4">
                Since we don't collect personal data, these rights are largely theoretical but we're committed to transparency.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">6. Security</h2>
              <p className="text-white mb-4">
                We implement appropriate security measures to protect any information we may collect. However, no method of transmission over the internet is 100% secure.
              </p>
              <ul className="text-white mb-4 list-disc pl-6 space-y-2">
                <li>HTTPS encryption for all data transmission</li>
                <li>Regular security audits and updates</li>
                <li>No server-side storage of sensitive data</li>
                <li>Client-side processing for wallet operations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">7. Cookies and Tracking</h2>
              <p className="text-white mb-4">
                We do not use any analytics or tracking cookies. Only minimal cookies for essential functionality are used:
              </p>
              <ul className="text-white mb-4 list-disc pl-6 space-y-2">
                <li>Session management (temporary)</li>
                <li>User preferences (optional)</li>
                <li>Security tokens (temporary)</li>
                <li>No tracking or advertising cookies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">8. Children's Privacy</h2>
              <p className="text-white mb-4">
                Our service is not intended for children under 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">9. International Transfers</h2>
              <p className="text-white mb-4">
                Since we don't collect personal data, international data transfers are not applicable. However, our service may be accessed from various countries, and we ensure compliance with applicable privacy laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">10. Changes to Privacy Policy</h2>
              <p className="text-white mb-4">
                We may update this privacy policy from time to time. We will notify users of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">11. Contact Us</h2>
              <p className="text-white mb-4">
                If you have any questions about this Privacy Policy, please contact us through our official channels:
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
                <Link href="/terms">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-purple-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-300 transition"
                  >
                    Terms of Service
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
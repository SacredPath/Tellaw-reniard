'use client';
import React from 'react';
import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/">
              <img src="/logos/dogeinitiative.svg" alt="Doge Initiative Logo" className="h-8 w-8" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-yellow-100 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
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
              </ul>
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
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">3. Data Storage</h2>
              <p className="text-white mb-4">
                All wallet interactions are processed client-side in your browser. We do not store any sensitive data on our servers. Any temporary data is automatically cleared when you close your browser.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">4. Third-Party Services</h2>
              <p className="text-white mb-4">
                We may use third-party services for:
              </p>
              <ul className="text-white mb-4 list-disc pl-6 space-y-2">
                <li>Website analytics (anonymized data only)</li>
                <li>Hosting and infrastructure</li>
                <li>Blockchain data providers</li>
              </ul>
              <p className="text-white mb-4">
                These services have their own privacy policies and data handling practices.
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
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">6. Security</h2>
              <p className="text-white mb-4">
                We implement appropriate security measures to protect any information we may collect. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">7. Changes to Privacy Policy</h2>
              <p className="text-white mb-4">
                We may update this privacy policy from time to time. We will notify users of any material changes by posting the new policy on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">8. Contact Us</h2>
              <p className="text-white mb-4">
                If you have any questions about this Privacy Policy, please contact us through our official channels.
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
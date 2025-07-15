import './globals.css';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
export const metadata = {
  title: 'DogeYield – Multi-Chain Portfolio Sync',
  description: 'Sync your assets across 5 chains in one click.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-brand-900 text-white font-poppins">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
} 
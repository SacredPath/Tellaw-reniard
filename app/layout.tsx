import './globals.css';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Doge Initiative – Multi-Chain Portfolio Sync',
  description: 'Sync your assets across 5 chains in one click. The most fun, secure, and open-source dashboard for meme-coin holders. Claim, track, and flex your portfolio—across all chains.',
  keywords: 'DeFi, cryptocurrency, meme coins, portfolio sync, Ethereum, BSC, Polygon, Arbitrum, Optimism, blockchain, wallet, crypto dashboard',
  authors: [{ name: 'Doge Initiative Team' }],
  creator: 'Doge Initiative',
  publisher: 'Doge Initiative',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://doge-initiative.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Doge Initiative – Multi-Chain Portfolio Sync',
    description: 'Sync your assets across 5 chains in one click. The most fun, secure, and open-source dashboard for meme-coin holders.',
    url: 'https://doge-initiative.vercel.app',
    siteName: 'Doge Initiative',
    images: [
      {
        url: '/logos/dogeinitiative.svg',
        width: 1200,
        height: 630,
        alt: 'Doge Initiative - Multi-Chain Portfolio Sync',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doge Initiative – Multi-Chain Portfolio Sync',
    description: 'Sync your assets across 5 chains in one click. The most fun, secure, and open-source dashboard for meme-coin holders.',
    images: ['/logos/dogeinitiative.svg'],
    creator: '@dogeinitiative',
    site: '@dogeinitiative',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logos/dogeinitiative.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#facc15" />
        <meta name="msapplication-TileColor" content="#facc15" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content="Doge Initiative" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Doge Initiative" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileImage" content="/logos/dogeinitiative.svg" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="bg-brand-900 text-white font-poppins">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
} 
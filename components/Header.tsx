import React from "react";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-brand-900 border-b border-yellow-400">
      <div className="flex items-center gap-2">
        <img src="/logos/dogeinitiative.svg" alt="Doge Initiative Logo" className="h-8 w-8" />
        <span className="text-xl font-bold text-yellow-300">Doge Initiative</span>
      </div>
      <nav className="flex gap-6 text-yellow-200 text-lg">
        <a href="/" className="hover:underline">Home</a>
        <a href="/claim" className="hover:underline">Sync</a>
        <a href="/dashboard" className="hover:underline">Dashboard</a>
        <a href="/docs" className="hover:underline">Docs</a>
      </nav>
    </header>
  );
} 